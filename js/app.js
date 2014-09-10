var chat = require('./js/chat-client.js');

// Setup chat events
chat.onOnline = function() {
  alert("You're now online");
}

chat.onMessage = function(msg) {
  alert(msg.from + ": " + msg.body);
}

chat.onError = function(error) {
  alert("ERROR: " + error);
  console.log("Error: ", error);
}

chat.onSubscribeRequest = function(who) {
  if(window.confirm(who + " wants to see your availability. Allow?")) chat.acceptPresenceSubscription(who);
}

// Setup setting controls
document.getElementById("login").addEventListener("click", function() {
  chat.connect({ jid: document.getElementById("jid").value, password: document.getElementById("password").value });
}, false);
