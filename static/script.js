document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // Existing bindings (UNCHANGED)
  // ==============================

  const chat = document.getElementById("chat");
  const input = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");

  // Conceptual prefix (already present in your file)
  const CONCEPTUAL_PREFIX =
    "answer this from a philosophical point of view: ";

   const APPLIED_SUFFIX =
  " and explain how you came to this solution";

  // ==============================
  // NEW bindings — Conceptual UI
  // ==============================

  const conceptualInput = document.getElementById("conceptualInput");
  const conceptualBtn = document.getElementById("conceptualBtn");
  const conceptualOutput = document.getElementById("conceptualOutput");

  // ==============================
  // Helper: append to ensemble chat
  // ==============================

  function append(text, className = "") {
    const div = document.createElement("div");
    div.textContent = text;
    if (className) div.className = className;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // ==============================
  // Ensemble handler (Input A)
  // ==============================

  sendBtn.addEventListener("click", async () => {
    const prompt = input.value.trim();
    if (!prompt) return;

    append(`You:\n${prompt}`, "user");
    input.value = "";

    try {
      const response = await fetch(
        "https://statsapp-47vj4.ondigitalocean.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt })
        }
      );

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

  // ==============================
  // Conceptual handler (Input B)
  // ==============================

  conceptualBtn.addEventListener("click", async () => {
    const prompt = conceptualInput.value.trim();
    if (!prompt) return;

    conceptualOutput.textContent = "Thinking conceptually…";

    try {
      const response = await fetch(
        "https://statsapp-47vj4.ondigitalocean.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: CONCEPTUAL_PREFIX + prompt
          })
        }
      );

      const data = await response.json();

      if (!data.ok || !data.planes || !data.planes.exploratory) {
        conceptualOutput.textContent = "Error: Invalid response from backend";
        return;
      }

      // Exploratory plane shown as Conceptual
      conceptualOutput.textContent = data.planes.exploratory;

    } catch (err) {
      conceptualOutput.textContent = "Error: API call failed";
      console.error(err);
    }
  });

});
appliedBtn.addEventListener("click", async () => {
  const prompt = appliedInput.value.trim();
  if (!prompt) return;

  appliedOutput.textContent = "Thinking (applied research)…";

  try {
    const response = await fetch(
      "https://statsapp-47vj4.ondigitalocean.app/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt + APPLIED_SUFFIX
        })
      }
    );

    const data = await response.json();

    if (!data.ok || !data.planes || !data.planes.balanced) {
      appliedOutput.textContent = "Error: Invalid response from backend";
      return;
    }

    // Selective rendering: BALANCED only
    appliedOutput.textContent = data.planes.balanced;

  } catch (err) {
    appliedOutput.textContent = "Error: API call failed";
    console.error(err);
  }
});
