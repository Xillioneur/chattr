$(document).ready(() => {
  const socket = io.connect();

  let currentUser;
  socket.emit("get online users");

  $("#createUserBtn").click(e => {
    e.preventDefault();
    if ($("#usernameInput").val().length > 0) {
      socket.emit("new user", $("#usernameInput").val());
      currentUser = $("#usernameInput").val();
      $(".usernameForm").remove();
      $(".mainContainer").css("display", "flex");
    }
  });

  $("#sendChatBtn").click(e => {
    e.preventDefault();
    let message = $("#chatInput").val();
    // Make sure it's not empty
    if (message.length > 0) {
      // Emit the message with the current user to the server
      socket.emit("new message", {
        sender: currentUser,
        message: message
      });
      $("#chatInput").val("");
    }
  });

  $("#newChannelBtn").click(() => {
    let newChannel = $("#newChannelInput").val();

    if (newChannel.length > 0) {
      socket.emit("new channel", newChannel);
      $("#newChannelInput").val("");
    }
  });

  socket.on("new user", username => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    $(".usersOnline").append(`<div class="userOnline">${username}</div>`);
  });

  socket.on("new message", data => {
    $(".messageContainer").append(`
      <div class="message">
        <p class="messageUser">${data.sender}: </p>
        <p class="messageText">${data.message}</p>
      </div>
    `);
  });

  socket.on("get online users", onlineUsers => {
    for (username in onlineUsers) {
      $(".usersOnline").append(`<p class="userOnline">${username}</p>`);
    }
  });

  socket.on("user has left", onlineUsers => {
    $(".usersOnline").empty();
    for (username in onlineUsers) {
      $(".usersOnline").append(`<p>${username}</p>`);
    }
  });

  socket.on("new channel", newChannel => {
    $(".channels").append(`<div class="channel">${newChannel}</div>`);
  });

  socket.on("user changed channel", data => {
    $(".channel-current").addClass("channel");
    $(".channel-current").removeClass("channel-current");
    $(`.channel:contains('${data.channel}')`).addClass("channel-current");
    $(".channel-current").removeClass("channel");
    $(".message").remove();
    data.messages.forEach(message => {
      $(".messageContainer").append(`
      <div class="message">
        <p class="messageUser">${message.sender}: </p>
        <p class="messageText">${message.message}</p>
      </div>
    `);
    });
  });
});
