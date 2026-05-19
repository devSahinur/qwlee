// Multi-tab-aware presence tracker. We can't just flip `online: false` on
// the first disconnect — a user with two tabs would go offline as soon as
// they closed one. Instead we keep a count of live sockets per user and
// only mark offline when it drops to zero. `lastSeen` is updated on the
// final disconnect.

const { User } = require("../models");

// userId (string) → Set<socketId>
const connections = new Map();

async function addConnection(userId, socketId) {
  if (!userId) return;
  let set = connections.get(userId);
  if (!set) {
    set = new Set();
    connections.set(userId, set);
  }
  const wasOffline = set.size === 0;
  set.add(socketId);
  if (wasOffline) {
    await User.updateOne(
      { _id: userId },
      { $set: { online: true, lastSeen: new Date() } }
    ).catch(() => {});
  }
}

async function removeConnection(userId, socketId) {
  if (!userId) return;
  const set = connections.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) {
    connections.delete(userId);
    await User.updateOne(
      { _id: userId },
      { $set: { online: false, lastSeen: new Date() } }
    ).catch(() => {});
    return { wentOffline: true };
  }
  return { wentOffline: false };
}

function isOnline(userId) {
  const set = connections.get(String(userId));
  return !!(set && set.size > 0);
}

function onlineUserIds() {
  return [...connections.keys()];
}

module.exports = {
  addConnection,
  removeConnection,
  isOnline,
  onlineUserIds,
};
