/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message
  const userMsg = document.createElement("div");
  userMsg.classList.add("user-message");
  userMsg.textContent = message;
  chatWindow.appendChild(userMsg);

  // Clear input field
  userInput.value = "";

  // Show loading
  const botMsg = document.createElement("div");
  botMsg.classList.add("bot-message");
  botMsg.textContent = "💬 Thinking...";
  chatWindow.appendChild(botMsg);

  try {
  const response = await fetch("https://loreal-chatbot.allisonrthelen.workers.dev/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: message }
    ]
  }),
});

    const data = await response.json();
    botMsg.textContent = data.reply || "⚠️ Sorry, I didn't catch that.";
  } catch (error) {
    botMsg.textContent = "❌ Error getting response.";
    console.error(error);
  }
});
