const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

function addMessage(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    if (className === "bot-message") {
    messageDiv.innerHTML = marked.parse(message);
    } else {
    messageDiv.textContent = message;
      }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message", "typing");

    typingDiv.innerHTML = `
      <span class="typing-dots" aria-hidden="true">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
      <span class="sr-only">Typing...</span>
    `;

    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return typingDiv;
}

async function getBotReply(userMessage) {

    try {

        const response = await fetch("http://127.0.0.1:8000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: userMessage
            })

        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        return data.reply;

    } catch (error) {

        console.error(error);

        return "❌ Unable to connect to the AI backend.";

    }
}

sendButton.addEventListener("click", async () => {

    const message = userInput.value.trim();

    if (message === "") return;

    addMessage(message, "user-message");

    userInput.value = "";

    const typingDiv = showTyping();

    const botReply = await getBotReply(message);

    typingDiv.remove();

    addMessage(botReply, "bot-message");

    localStorage.setItem("chatHistory", chatBox.innerHTML);

});

userInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        sendButton.click();
    }

});

window.onload = () => {

    chatBox.innerHTML = "";

    addMessage(
        "👋 Welcome to BuddyAI!\n\nI'm your personal AI assistant.\n\nAsk me anything about:\n\n• Programming 💻\n• AI 🤖\n• Studies 📚\n• Career 🚀\n• General Knowledge 🌍\n\nHow can I help you today?",
        "bot-message"
    );

};
