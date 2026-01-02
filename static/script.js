// AI-Ensemble Frontend Script
// Contract: expects backend JSON of the form
// {
//   ok: true,
//   model: "...",
//   planes: {
//     conservative: "...",
//     balanced: "...",
//     exploratory: "..."
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-btn");
  const scenarioInput = document.getElementById("scenario-input");

  const conservativeBox = document.getElementById("plane-conservative");
  const balancedBox = document.getElementById("plane-balanced");
  const exploratoryBox = document.getElementById("plane-exploratory");

  if (!sendButton || !scenarioInput) {
    console.error("UI elements missing — check index.html wiring");
    return;
  }

  sendButton.addEventListener("click", async () => {
    const prompt = scenarioInput.value.trim();

    if (!prompt) {
      alert("Please enter a scenario prompt.");
      return;
    }

    // Clear previous outputs
    conservativeBox.textContent = "Loading…";
    balancedBox.textContent = "Loading…";
    exploratoryBox.textContent = "Loading…";

    const payload = {
      prompt: prompt
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({  message: promptText})
;

      // If backend returned HTML (auth page), JSON parsing will fail
const text = await response.text();
console.log("RAW RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  throw new Error("Response is not valid JSON");
}

if (!data.ok || !data.planes) {
  throw new Error("Invalid API response");
}

document.getElementById("conservative-output").textContent =
  data.planes.conservative || "";

document.getElementById("balanced-output").textContent =
  data.planes.balanced || "";

document.getElementById("exploratory-output").textContent =
  data.planes.exploratory || "";

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(
          "Backend did not return JSON. Received HTML instead."
        );
      }

      if (!data.ok) {
        throw new Error(data.error || "Backend returned ok=false");
      }

      if (!data.planes) {
        throw new Error("Missing 'planes' object in response");
      }

      // Render each plane explicitly
      conservativeBox.textContent =
        data.planes.conservative || "(empty)";
      balancedBox.textContent =
        data.planes.balanced || "(empty)";
      exploratoryBox.textContent =
        data.planes.exploratory || "(empty)";

    } catch (err) {
      console.error(err);

      const msg =
        err.message ||
        "Unexpected error while contacting backend.";

      conservativeBox.textContent = "Error: " + msg;
      balancedBox.textContent = "Error: " + msg;
      exploratoryBox.textContent = "Error: " + msg;
    }
  });
});
const textconst text
