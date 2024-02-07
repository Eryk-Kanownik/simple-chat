const socket = io("http://localhost:5000");

const messageFeed = document.querySelector(".messages");
const messageForm = document.querySelector("#form");

let username = "";

window.addEventListener("load", () => {
  if (localStorage.getItem("username")) {
    username = localStorage.getItem("username");
    socket.emit("new-user", username);
  } else {
    username = prompt("What is your name?");
    localStorage.setItem("username", username);
    socket.emit("new-user", username);
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let messageString = `${username}: ${
    document.querySelector("#message").value
  }`;
  messageFeed.appendChild(createMessage(messageString));
  socket.emit("send-message", messageString);
  document.querySelector("#message").value = "";
});

socket.on("user-joined", (str) => {
  messageFeed.appendChild(createAlert(str));
});

socket.on("user-left", (str) => {
  messageFeed.appendChild(createAlert(str));
});

socket.on("incoming-message", (str) => {
  messageFeed.appendChild(createMessage(str));
});

function createAlert(str) {
  let div = document.createElement("div");
  div.className = "message-alert";
  div.innerHTML = str;
  return div;
}

function createMessage(str) {
  let div = document.createElement("div");
  div.className = "message-card";
  div.innerHTML = str;
  return div;
}
