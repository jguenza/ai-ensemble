// === DOM references ===
const sendBtn = document.getElementById("sendBtn");
const promptInput = document.getElementById("prompt");

const planeTargets = {
  conservative: document.querySelector("#alt-conservative .content"),
  balanced: document.querySelector("#alt-balanced .content"),
  exploratory: document.querySelector("#alt-exploratory .content"),
};

// === Safety checks (fail fast if HTML is wrong) ===
if (!sendBtn || !promptInput) {
  throw new Error("UI wiring error: sendBtn or prompt input missing");
}

for (const key in planeTargets) {
  if (!planeTargets[key]) {
    throw new Error(`UI wiring error: missing container for plane '${key}'`);
  }
}

// === Helper: clear / set all planes ===
function setAllPlanes(text) {
  for (const key in planeTargets) {
    planeTargets[key].textContent = text;
  }
}

// === Main send handler ===
sendBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  sendBtn.disabled = true;
  setAllPlanes("Thinking…");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    // === Validate response shape ===
    if (!data || data.ok !== true) {
      throw new Error(data?.error || "Backend returned ok=false");
    }

    if (!data.planes || typeof data.planes !== "object") {
      throw new Error("Invalid response: missing 'planes' object");
    }

    // === Required plane keys ===
    const requiredPlanes = ["conservative", "balanced", "exploratory"];

    for (const key of requiredPlanes) {
      if (!(key in data.planes)) throw new Error(`Missing plane '${key}' in response`);
      if (typeof data.planes[key] !== "string") throw new Error(`Plane '${key}' is not a string`);
    }

    // === Render planes (no parsing, no inference) ===
    planeTargets.conservative.textContent = data.planes.conservative;
    planeTargets.balanced.textContent = data.planes.balanced;
    planeTargets.exploratory.textContent = data.planes.exploratory;

  } catch (err) {
    setAllPlanes("Error: " + err.message);
  } finally {
    sendBtn.disabled = false;
  }
});
