const BACKEND_URL = "https://z-mini-tools.onrender.com";

// ✅ Generate QR Code
async function generateQRCode(data) {
  const response = await fetch(`${BACKEND_URL}/api/qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate QR code.");
  }

  const result = await response.blob();
  return URL.createObjectURL(result);
}

// ✅ Remove Background
async function removeBackground(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${BACKEND_URL}/api/remove-bg`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to remove background.");
  }

  return await response.blob();
}

// ✅ Watch Ad to Earn Credits
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update credits after ad watch.");
  }

  return await response.json();
}

// 🔄 You can similarly add functions for:
// - image-to-image generation
// - generate PDF
// - check credit balance
// - bulk QR generation
