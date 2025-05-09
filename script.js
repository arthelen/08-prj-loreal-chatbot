const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const chatSound = document.getElementById("chatSound");
const retryBtn = document.getElementById("retryBtn");

// Show welcome message
appendMessage("ai", "👋 Hi there! I'm your L’Oréal beauty assistant and happy to help! Ask me anything about products, skincare, haircare routines, and more!");

const messages = [
  {
    role: "system",
    content:
      "You are a helpful and friendly L’Oréal beauty assistant that knows everything about the brand's products. Only answer questions related to beauty, skincare, haircare, cosmetics, and L’Oréal products, routines, and recommendations. Your replies should reflect a natural conversation flow with detailed, yet concise answers, with a fun tone and emojis occasionally. If the user asks something unrelated, apologize, say you are unable to answer that, and politely redirect them back to beauty or L’Oréal-related topics.",
  }
];

// Handle retry button
retryBtn.addEventListener("click", () => {
  chatWindow.innerHTML = "";

  messages.length = 0;
  messages.push({
    role: "system",
    content:
      "You are a helpful and friendly L’Oréal beauty assistant that knows everything about the brand's products. Only answer questions related to beauty, skincare, haircare, cosmetics, and L’Oréal products, routines, and recommendations. Your replies should reflect a natural conversation flow with detailed, yet concise answers, with a fun tone and emojis occasionally. If the user asks something unrelated, apologize, say you are unable to answer that, and politely redirect them back to beauty or L’Oréal-related topics.",
  });

  appendMessage("ai", "👋 Hi there! I'm your L’Oréal beauty assistant and happy to help! Ask me anything about products, skincare, haircare routines, and more!");
});

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  messages.push({ role: "user", content: message });
  appendMessage("user", message);
  userInput.value = "";

  // Play sound
  if (chatSound) {
    chatSound.currentTime = 0;
    chatSound.play();
  }

  const loadingMessages = [
    "✨ Blending the perfect response...",
    "💄 Touching up my answer... just a sec!",
    "🧴 Lathering up some advice for you...",
    "💬 Just a spritz of brilliance coming right up!",
    "💁‍♀️ Flipping through our beauty book..."
  ];

  const randomLoading = () =>
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  appendMessage("ai", randomLoading());

  try {
    const response = await fetch("https://loreal-chatbot.allisonrthelen.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const reply = data.reply || "⚠️ Sorry, I didn't catch that!";

    chatWindow.lastChild.querySelector(".bubble").textContent = reply;
    messages.push({ role: "assistant", content: reply });

    // Play same sound for bot reply
    if (chatSound) {
      chatSound.currentTime = 0;
      chatSound.play();
    }

  } catch (error) {
    chatWindow.lastChild.querySelector(".bubble").textContent = "❌ Error getting response! Please try again later.";
    console.error(error);
  }
});

// Function to append chat bubbles
function appendMessage(role, text) {
  const msgWrapper = document.createElement("div");
  msgWrapper.classList.add("msg", role);
  msgWrapper.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msgWrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}