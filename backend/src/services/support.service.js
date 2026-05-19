// Support-ticket service.
//
// Owns the ticket + message bookkeeping (unread counters, lastMessageAt,
// status auto-flips). Controllers stay thin and just translate between
// HTTP and these calls.

const mongoose = require("mongoose");
const { SupportTicket, SupportMessage, User } = require("../models");

async function createTicket({ userId, subject, category, body }) {
  if (!userId) throw new Error("userId required");
  if (!subject || !body) throw new Error("subject and body required");

  const ticket = await SupportTicket.create({
    userId,
    subject: String(subject).slice(0, 200),
    category: category || "other",
    status: "open",
    unreadByAdmin: 1,
    unreadByUser: 0,
    lastMessageAt: new Date(),
  });
  await SupportMessage.create({
    ticketId: ticket._id,
    senderId: userId,
    senderRole: "user",
    body: String(body).slice(0, 4000),
  });
  return ticket;
}

// Lists tickets for either the current user (`viewer="user"`) or the
// admin (`viewer="admin"`). Admin view exposes every non-deleted
// ticket; user view restricts to their own.
async function listTickets({ viewerId, viewer, status, limit = 50, page = 1 }) {
  const query = { isDeleted: false };
  if (viewer === "user") query.userId = viewerId;
  if (status && status !== "all") query.status = status;

  const items = await SupportTicket.find(query)
    .sort({ lastMessageAt: -1 })
    .skip(Math.max(0, (page - 1) * limit))
    .limit(limit)
    .populate({ path: "userId", select: "fullName username email image role" });
  const total = await SupportTicket.countDocuments(query);
  return { results: items, totalResults: total, page, limit };
}

async function getTicket({ ticketId, viewerId, viewer }) {
  const ticket = await SupportTicket.findOne({ _id: ticketId, isDeleted: false }).populate({
    path: "userId",
    select: "fullName username email image role",
  });
  if (!ticket) throw new Error("Ticket not found");
  if (viewer === "user" && String(ticket.userId._id || ticket.userId) !== String(viewerId)) {
    throw new Error("Forbidden");
  }
  const messages = await SupportMessage.find({ ticketId: ticket._id })
    .sort({ createdAt: 1 })
    .populate({ path: "senderId", select: "fullName username email image role" });
  // Open the thread = mark the viewer's unread counter to zero.
  if (viewer === "user" && ticket.unreadByUser > 0) {
    ticket.unreadByUser = 0;
    await ticket.save();
  } else if (viewer === "admin" && ticket.unreadByAdmin > 0) {
    ticket.unreadByAdmin = 0;
    await ticket.save();
  }
  return { ticket, messages };
}

async function postMessage({ ticketId, senderId, senderRole, body }) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket || ticket.isDeleted) throw new Error("Ticket not found");
  if (!body) throw new Error("Message body required");

  if (
    senderRole === "user" &&
    String(ticket.userId) !== String(senderId)
  ) {
    throw new Error("Forbidden");
  }

  const msg = await SupportMessage.create({
    ticketId: ticket._id,
    senderId,
    senderRole,
    body: String(body).slice(0, 4000),
  });

  ticket.lastMessageAt = msg.createdAt;
  if (senderRole === "user") {
    ticket.unreadByAdmin += 1;
    // A reply from the user re-opens a resolved ticket.
    if (ticket.status === "resolved") ticket.status = "open";
  } else {
    ticket.unreadByUser += 1;
    // Admin replied — mark as pending on the user.
    if (ticket.status === "open") ticket.status = "pending";
  }
  await ticket.save();
  return msg;
}

async function updateStatus({ ticketId, status, viewerRole }) {
  if (viewerRole !== "admin") throw new Error("Forbidden");
  const allowed = ["open", "pending", "resolved", "closed"];
  if (!allowed.includes(status)) throw new Error("Invalid status");
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket || ticket.isDeleted) throw new Error("Ticket not found");
  ticket.status = status;
  await ticket.save();
  return ticket;
}

module.exports = {
  createTicket,
  listTickets,
  getTicket,
  postMessage,
  updateStatus,
};
