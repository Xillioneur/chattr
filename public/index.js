$(document).ready(() => {
  const socket = io.connect();

  $("#createUserBtn").click(e => {
    e.preventDefault();
    let username = $("#usernameInput").val();
    console.log(username);
    if (username.length > 0) {
      socket.emit("new user", username);
      $(".usernameForm").remove();
    }
  });

  socket.on("new user", username => {
    console.log(`✋ ${username} has joined the chat! ✋`);
  });
});
