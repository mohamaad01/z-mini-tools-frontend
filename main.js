const BACKEND_URL = "https://z-mini-tools.onrender.com";

// === QR Code Generation ===
async function generateQRCode(data) {
  const response = await fetch(`${BACKEND_URL}/generate_qr`, {
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

// === Watch Ad and Get Credits ===
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
console.log("DOM fully loaded!");
  
  const qrBtn = document.getElementById('generateQRBtn');
  const qrInput = document.getElementById('qrInput');
  const qrImage = document.getElementById('qrImage');

  const bgBtn = document.getElementById('removeBgBtn');
  const bgInput = document.getElementById('bgInput');
  const bgOutput = document.getElementById('bgOutput');

  const adBtn = document.getElementById('watchAdBtn');

  // QR Code Click
  qrBtn.addEventListener('click', async () => {
    const data = qrInput.value.trim();
    if (!data) return alert("Enter some text to generate QR!");
    try {
      const imageURL = await generateQRCode(data);
      qrImage.src = imageURL;
    } catch (err) {
      alert(err.message);
    }
  });

  // Background Removal Click
  bgBtn.addEventListener('click', async () => {
    const file = bgInput.files[0];
    if (!file) return alert("Please upload an image first.");
    try {
      const output = await removeBackground(file);
      bgOutput.src = URL.createObjectURL(output);
    } catch (err) {
      alert(err.message);
    }
  });

  // Watch Ad Click
  adBtn.addEventListener('click', async () => {
    try {
      const userId = "demo_user"; // Replace with real user ID in future
      const data = await watchAdAndGetCredits(userId);
      alert("Ad watched! New credits: " + data.credits);
    } catch (err) {
      alert(err.message);
    }
  });
});
