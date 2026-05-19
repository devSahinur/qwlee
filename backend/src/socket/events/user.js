// Legacy user/connect handler — kept for the existing frontend which
// emits `user/connect` with a client-supplied userId after socket open.
// New clients should put their access-token in the socket handshake auth
// payload (see socketServer.js) and skip this event entirely; presence
// flips automatically once the handshake JWT is verified.
//
// All presence writes flow through socket/presence.js so the multi-tab
// connection counter and lastSeen update stay correct regardless of which
// path the client takes. socketServer.js owns the disconnect lifecycle.

const mongoose = require("mongoose");
const presence = require("../presence");

module.exports = (socket) => {
  socket.on("user/connect", async (data) => {
    try {
      const { userId } = data || {};
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID: ${userId}`);
      }
      // Handshake-verified userId wins over client-supplied.
      const id = socket.verifiedUserId || String(userId);
      socket.join(id);
      socket.userId = id;
      await presence.addConnection(id, socket.id);
      socket.broadcast.emit("user/connect", id);
    } catch (error) {
      console.error(`Error in user/connect: ${error.message}`);
    }
  });
};
