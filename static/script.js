document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // Core DOM bindings (ensemble)
  // ==============================

  const chat = document.getElementById("chat");
  const input = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");

  // ==============================
  // Frontend message modifiers
  // ==============================

  const CONCEPTUAL_PREFIX =
    "guide the user to improve this prompt as you are expert in the mentined topics:";

  const APPLIED_SUFFIX =
    " explore the weak points as you are an expert in the mentioned topics ";

  // ==============================
  // Refining UI bindings (was Conceptual)
  // ==============================

  const conceptualInput  = document.getElementById("RefiningInput");
  const conceptualBtn    = document.getElementById("RefiningBtn");
  const conceptualOutput = document.getElementById("RefiningOutput");

  // ==============================
  // Output evaluator bindings (was Applied Research)
  // ==============================

  const appliedInput  = document.getElementById("OutputInput");
  const appliedBtn    = document.getElementById("appliedBtn");
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
  // Refining handler (top)
  // ==============================

  conceptualBtn.addEventListener("click", async () => {
    const prompt = conceptualInput.value.trim();
    if (!prompt) return;

    conceptualOutput.textContent = "improving your prompt…";
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

      // Exploratory plane → Refining
      conceptualOutput.innerHTML = data.planes.exploratory;
      if (window.MathJax) MathJax.typeset();

    } catch (err) {
      conceptualOutput.textContent = "Error: API call failed";
      console.error(err);
    }
  });

  // ==============================
  // Output evaluator handler (bottom)
  // ==============================

  appliedBtn.addEventListener("click", async () => {
    const prompt = appliedInput.value.trim();
    if (!prompt) return;

    appliedOutput.textContent = "Evaluating response…";
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

      // Balanced plane → Output evaluator
      appliedOutput.innerHTML = data.planes.balanced;
      if (window.MathJax) MathJax.typeset();

    } catch (err) {
      appliedOutput.textContent = "Error: API call failed";
      console.error(err);
    }
  });

});
