// The core Firebase JS SDK is always required and must be listed first
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAxRNXPM_F0KU3I4oxlu4ZsL1-gtaw1yBw",
  authDomain: "chatapp-vanillajs.firebaseapp.com",
  databaseURL:
    "https://chatapp-vanillajs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-vanillajs",
  storageBucket: "chatapp-vanillajs.appspot.com",
  messagingSenderId: "965779128959",
  appId: "1:965779128959:web:19c0fee8cb5ad7734c754a",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const msgForm = document.getElementById("msgForm");

var myName = prompt("Enter your name");

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

firebase
  .database()
  .ref("messages")
  .on("child_added", (snapshot) => {
    let html = "";

    if (snapshot.val().sender === myName) {
      html = `
      <div class="message message-personal new">
        <div id="message-${snapshot.key}">
          ${snapshot.val().message} 
          <button class="btn-delete" data-id="${
            snapshot.key
          }" onclick="deleteMessage(this);">Delete</button>
        </div>
        <figure class="avatar">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdX6tPX96Zk00S47LcCYAdoFK8INeCElPeJrVDrh8phAGqUZP_g" />
        </figure>
      </div>
      `;
    } else {
      html = `
      <div class="message new">
        <div id="message-${snapshot.key}">${snapshot.val().message}</div>
        <figure class="avatar">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdX6tPX96Zk00S47LcCYAdoFK8INeCElPeJrVDrh8phAGqUZP_g" />
        </figure>
      </div>
      `;
    }

    document.getElementById("msgContent").innerHTML += html;
  });

firebase
  .database()
  .ref("messages")
  .on("child_removed", (snapshot) => {
    document.getElementById("message-" + snapshot.key).innerHTML =
      "This message has been removed";
  });

function sendMessage() {
  const msgInput = document.getElementById("msgInput");

  if (msgInput.value) {
    firebase.database().ref("messages").push().set({
      sender: myName,
      message: msgInput.value,
    });
  }

  msgInput.value = "";
}

function deleteMessage(self) {
  const messageId = self.getAttribute("data-id");
  firebase.database().ref("messages").child(messageId).remove();
}
