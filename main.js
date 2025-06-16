const BACKEND_URL = "https://z-mini-tools.onrender.com";

// === QR Code Generation ===
async function generateQRCode(data) {
  const response = await fetch(`${BACKEND_URL}/api/qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) throw new Error("Failed to generate QR code.");
  const result = await response.blob();
  return URL.createObjectURL(result);
}

// === Background Removal ===
async function removeBackground(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${BACKEND_URL}/api/remove-bg`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to remove background.");
  return await response.blob();
}

// === Watch Ad ===
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) throw new Error("Failed to update credits after ad watch.");
  return await response.json();
}

// === DOM Event Bindings ===
window.addEventListener('DOMContentLoaded', () => {
  const qrBtn = document.getElementById('generateQRBtn');
  const qrInput = document.getElementById('qrInput');
  const qrImage = document.getElementById('qrImage');

  qrBtn.addEventListener('click', async () => {
    const text = qrInput.value.trim();
    if (!text) return alert("Please enter text to generate QR.");
    try {
      const qrUrl = await generateQRCode(text);
      qrImage.src = qrUrl;
    } catch (err) {
      alert(err.message);
    }
  });

  const removeBtn = document.getElementById('removeBgBtn');
  const bgInput = document.getElementById('bgInput');
  const bgOutput = document.getElementById('bgOutput');

  removeBtn.addEventListener('click', async () => {
    const file = bgInput.files[0];
    if (!file) return alert("Please select an image file.");
    try {
      const result = await removeBackground(file);
      bgOutput.src = URL.createObjectURL(result);
    } catch (err) {
      alert(err.message);
    }
  });

  const watchAdBtn = document.getElementById('watchAdBtn');
  watchAdBtn.addEventListener('click', async () => {
    const userId = 123; // Replace with Telegram WebApp user ID if available
    try {
      const result = await watchAdAndGetCredits(userId);
      alert("Credits updated! New credit balance: " + result.credits);
    } catch (err) {
      alert(err.message);
    }
  });
});
