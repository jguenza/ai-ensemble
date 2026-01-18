document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // Core DOM bindings (existing)
  // ==============================

  const chat = document.getElementById("chat");
  const input = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");

  // ==============================
  // Frontend message modifiers
  // ==============================

  const CONCEPTUAL_PREFIX =
    "answer this from a Martin Heidegger point of view: ";

  const APPLIED_SUFFIX =
    " make critical evaluation of this prompt as Carl Schmitt with  Marqués de Sade irony";

  // ==============================
  // Conceptual UI bindings
  // ==============================

  const conceptualInput = document.getElementById("conceptualInput");
  const conceptualBtn = document.getElementById("conceptualBtn");
  const conceptualOutput = document.getElementById("conceptualOutput");

  // ==============================
  // Applied Research UI bindings
  // ==============================

  const appliedInput = document.getElementById("appliedInput");
  const appliedBtn = document.getElementById("appliedBtn");
  const appliedOutput = document.getElementById("appliedOutput");

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
  // Ensemble handler (middle)
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
  // Conceptual handler (top)
  // ==============================

  conceptualBtn.addEventListener("click", async () => {
    const prompt = conceptualInput.value.trim();
    if (!prompt) return;

    conceptualOutput.textContent = "Thinking conceptually…";
    if (window.MathJax) MathJax.typeset();

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
        conceptualOutput.textContent =
          "Error: Invalid response from backend";
        return;
      }

      // Exploratory plane → Conceptual
      conceptualOutput.innerHTML = data.planes.exploratory;
      if (window.MathJax) MathJax.typeset();   
    } catch (err) {
      conceptualOutput.textContent = "Error: API call failed";
      console.error(err);
    }
  });

  // ==============================
  // Applied Research handler (bottom)
  // ==============================

  appliedBtn.addEventListener("click", async () => {
    const prompt = appliedInput.value.trim();
    if (!prompt) return;

    appliedOutput.textContent = "Thinking (applied research)…";
    if (window.MathJax) MathJax.typeset();
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
        appliedOutput.textContent =
          "Error: Invalid response from backend";
        return;
      }

      // Balanced plane → Applied Research
      appliedOutput.innerHTML = data.planes.balanced;
      if (window.MathJax) MathJax.typeset();
    } catch (err) {
      appliedOutput.textContent = "Error: API call failed";
      console.error(err);
    }
  });

});
