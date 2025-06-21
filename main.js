const BACKEND_URL = "https://z-mini-tools.onrender.com";

// === QR Code Generation ===
async function generateQRCode(data, userId) {
  const response = await fetch(`${BACKEND_URL}/generate_qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: data, user_id: userId }),
  });

  if (!response.ok) throw new Error("Failed to generate QR code.");
  const result = await response.blob();
  return URL.createObjectURL(result);
}

// === Background Removal ===
async function removeBackground(imageFile, userId) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('user_id', userId);

  const response = await fetch(`${BACKEND_URL}/remove_bg`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to remove background.");
  return await response.blob();
}

// === Watch Ad for Credits ===
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  const text = await response.text();
  try {
    const json = JSON.parse(text);
    if (!response.ok) throw new Error(json.error || "Ad credit failed");
    return json;
  } catch (err) {
    throw new Error("Unexpected server response: " + text);
  }
}

// === DOM Event Binding ===
window.addEventListener('DOMContentLoaded', () => {
  console.log("Main JS loaded!");

  const qrBtn = document.getElementById('generateQRBtn');
  const qrInput = document.getElementById('qrInput');
  const qrImage = document.getElementById('qrImage');

  const bgBtn = document.getElementById('removeBgBtn');
  const bgInput = document.getElementById('bgInput');
  const bgOutput = document.getElementById('bgOutput');

  const watchAdBtn = document.getElementById('watchAdBtn');

  const userId = "demo_user"; // 🔐 Replace with real user logic

  // Generate QR Code
  qrBtn?.addEventListener('click', async () => {
    try {
      const data = qrInput.value;
      if (!data) return alert("Please enter text.");
      const qrUrl = await generateQRCode(data, userId);
      qrImage.src = qrUrl;
    } catch (err) {
      alert(err.message);
    }
  });

  // Remove Background
  bgBtn?.addEventListener('click', async () => {
    try {
      const file = bgInput.files[0];
      if (!file) return alert("Please upload an image.");
      const result = await removeBackground(file, userId);
      bgOutput.src = URL.createObjectURL(result);
    } catch (err) {
      alert(err.message);
    }
  });

  // Watch Ad to Earn Credits
  watchAdBtn?.addEventListener('click', async () => {
    try {
      const result = await watchAdAndGetCredits(userId);
      alert(result.message || "Credits updated!");
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  });
});
