document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://statsapp-47vj4.ondigitalocean.app";

  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const conservativeBox = document.getElementById("plane-conservative");
  const balancedBox = document.getElementById("plane-balanced");
  const exploratoryBox = document.getElementById("plane-exploratory");

  function clearOutput() {
    conservativeBox.textContent = "";
    balancedBox.textContent = "";
    exploratoryBox.textContent = "";
  }

  function setLoading(state) {
    sendBtn.disabled = state;
    sendBtn.textContent = state ? "Thinking…" : "Send";
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    clearOutput();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      conservativeBox.textContent =
        data.planes?.conservative || "[no conservative output]";

      balancedBox.textContent =
        data.planes?.balanced || "[no balanced output]";

      exploratoryBox.textContent =
        data.planes?.exploratory || "[no exploratory output]";

    } catch (err) {
      conservativeBox.textContent = "Frontend fetch error";
    } finally {
      setLoading(false);
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
