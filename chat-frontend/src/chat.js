import "./echo";
import axios from "axios";

const conversationId = 1;

Echo.private(`conversation.${conversationId}`).listen("MessageSent", (e) => {
  console.log("New message:", e);
  addMessage(e);
});

function addMessage(message) {
  const div = document.createElement("div");
  div.innerText = message.body;
  document.querySelector("#chat").appendChild(div);
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#send").onclick = async () => {
    const body = document.querySelector("#message").value;

    await axios.post("http://localhost:8000/api/messages", {
      conversation_id: conversationId,
      body,
    });

    document.querySelector("#message").value = "";
  };
});
