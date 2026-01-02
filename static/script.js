document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");

  function append(text, className = "") {
    const div = document.createElement("div");
    div.textContent = text;
    if (className) div.className = className;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  sendBtn.addEventListener("click", async () => {
    const prompt = input.value.trim();
    if (!prompt) return;

    append(`You:\n${prompt}`, "user");
    input.value = "";

    try {
      const response = await fetch("https://statsapp-47vj4.ondigitalocean.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });

      const data = await response.json();

      if (!data.ok || !data.planes) {
        append("Error: Invalid response from backend");
        return;
      }

      append("Conservative:", "plane");
      append(data.planes.conservative, "plane");

      append("Balanced:", "plane");
      append(data.planes.balanced, "plane");

      append("Exploratory:", "plane");
      append(data.planes.exploratory, "plane");

    } catch (err) {
      append("Error: API call failed");
      console.error(err);
    }
  });
});
