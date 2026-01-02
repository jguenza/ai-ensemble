// AI-Ensemble frontend script
// Contract: POST /api/chat  -> { ok, model, planes:{conservative,balanced,exploratory} }

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const promptInput = document.getElementById("promptInput");

  const outConservative = document.getElementById("out-conservative");
  const outBalanced = document.getElementById("out-balanced");
  const outExploratory = document.getElementById("out-exploratory");

  function clearOutputs() {
    outConservative.textContent = "";
    outBalanced.textContent = "";
    outExploratory.textContent = "";
  }

  function showError(msg) {
    outConservative.textContent = msg;
    outBalanced.textContent = msg;
    outExploratory.textContent = msg;
  }

  sendBtn.addEventListener("click", async () => {
    const promptText = promptInput.value.trim();
    if (!promptText) {
      return;
    }

    clearOutputs();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: promptText
          })
        }
      );

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        showError("Error: Backend did not return JSON");
        console.error("Raw response:", text);
        return;
      }

      if (!data.ok || !data.planes) {
        showError("Error: Invalid API response");
        console.error(data);
        return;
      }

      outConservative.textContent = data.planes.conservative || "";
      outBalanced.textContent = data.planes.balanced || "";
      outExploratory.textContent = data.planes.exploratory || "";

    } catch (err) {
      showError("Error: API call failed");
      console.error(err);
    }
  });
});
