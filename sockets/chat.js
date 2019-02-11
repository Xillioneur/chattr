module.exports = (io, socket) => {
  console.log("time to chat");
  socket.on("new user", username => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    //Send the username to all clients currently connected
    io.emit("new user", username);
  });
};
