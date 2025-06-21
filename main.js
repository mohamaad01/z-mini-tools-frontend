const BACKEND_URL = "https://z-mini-tools.onrender.com";

// === QR Code Generation ===
async function generateQRCode(data, userId) {
  const response = await fetch(`${BACKEND_URL}/generate_qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: data, user_id: userId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to generate QR code.");
  }

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

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to remove background.");
  }

  return await response.blob();
}

// === Watch Ad for Credits ===
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to update credits.");
  }

  return await response.json();
}

const video = document.getElementById("adVideo");
video.onended = async function () {
  alert("Thanks for watching!");
  const result = await watchAdAndGetCredits(userId);
  alert("3 Credits added!");
};

// === Get Credits (Optional) ===
async function getUserCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/credits/${userId}`);
  if (!response.ok) return 0;
  const data = await response.json();
  return data.credits;
}

// === DOM Event Binding ===
window.addEventListener('DOMContentLoaded', async () => {
  console.log("Main JS loaded!");

  const userId = "demo_user"; // 🔐 Replace with actual user logic later

  const qrBtn = document.getElementById('generateQRBtn');
  const qrInput = document.getElementById('qrInput');
  const qrImage = document.getElementById('qrImage');

  const bgBtn = document.getElementById('removeBgBtn');
  const bgInput = document.getElementById('bgInput');
  const bgOutput = document.getElementById('bgOutput');

  const watchAdBtn = document.getElementById('watchAdBtn');
  const creditDisplay = document.querySelector('.credits');

  // Update credits on load
  try {
    const credits = await getUserCredits(userId);
    if (creditDisplay) creditDisplay.innerHTML = `🌐 Credits: ${credits} &nbsp; | &nbsp; ⏰ Reset in 12h`;
  } catch {}

  // QR Generation
  qrBtn?.addEventListener('click', async () => {
    try {
      const text = qrInput.value.trim();
      if (!text) return alert("Please enter text to generate QR.");
      const qrUrl = await generateQRCode(text, userId);
      qrImage.src = qrUrl;
    } catch (err) {
      alert(err.message);
    }
  });

  // Background Removal
  bgBtn?.addEventListener('click', async () => {
    try {
      const file = bgInput.files[0];
      if (!file) return alert("Please select an image.");
      const result = await removeBackground(file, userId);
      bgOutput.src = URL.createObjectURL(result);
    } catch (err) {
      alert(err.message);
    }
  });

  // Watch Ad to Get Credits
  watchAdBtn?.addEventListener('click', async () => {
    try {
      const res = await watchAdAndGetCredits(userId);
      alert("🎉 Credits updated! Reloading...");
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  });
});
