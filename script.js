const BACKEND_URL = "https://z-mini-tools.onrender.com";

// Generate QR Code
async function generateQRCode(data) {
  const response = await fetch(`${BACKEND_URL}/api/qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  const result = await response.blob();
  return URL.createObjectURL(result);
}

// Remove Background
async function removeBackground(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`${BACKEND_URL}/api/remove-bg`, {
    method: 'POST',
    body: formData,
  });
  return await response.blob();
}

// Example for watching ad (credit)
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return await response.json();
}
async function generateQRCode(data) {
  console.log("→ Sending QR request"); // 🔥 Logging start
  try {
    const resp = await fetch(`${BACKEND_URL}/generate_qr`, { ... });
    console.log("↩️ Response status:", resp.status);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const blob = await resp.blob();
    console.log("✅ Blob received", blob);
    return blob;
  } catch (err) {
    console.error("❌ Error in generateQRCode:", err);
    alert("Error: " + err.message);
  }
}
