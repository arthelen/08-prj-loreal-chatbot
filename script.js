const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

appendMessage("ai", "👋 Hi there! I'm your L’Oréal beauty assistant. Ask me anything about products, skincare, haircare routines, and more, I would be happy to help!");

const messages = [
  { role: "system", content: "You are a helpful and friendly L’Oréal beauty assistant that knows everything about the brand's products. Only answer questions related to beauty, skincare, haircare, cosmetics, and  L’Oréal products, routines, and recommendations. Your replies should reflect a natural conversation flow with detailed, yet concise answers, with a fun tone and emojis. If the user asks something unrelated, apologize, say you are unable to answer that, and politely redirect them back to beauty or L’Oréal-related topics." }
];

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  messages.push({ role: "user", content: message });
  appendMessage("user", message);
  userInput.value = "";

  appendMessage("ai", "💬 Thinking...");

  try {
    const response = await fetch("https://loreal-chatbot.allisonrthelen.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const reply = data.reply || "⚠️ Sorry, I didn't catch that.";

    chatWindow.lastChild.querySelector(".bubble").textContent = reply;
    messages.push({ role: "assistant", content: reply });

  } catch (error) {
    chatWindow.lastChild.querySelector(".bubble").textContent = "❌ Error getting response.";
    console.error(error);
  }
});

function appendMessage(role, text) {
  const msgWrapper = document.createElement("div");
  msgWrapper.classList.add("msg", role);
  msgWrapper.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msgWrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
