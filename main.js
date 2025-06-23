const BACKEND_URL = "https://z-mini-tools.onrender.com";
let userId = "demo_user"; // fallback for local testing

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user && window.Telegram.WebApp.initDataUnsafe.user.id) {
    userId = window.Telegram.WebApp.initDataUnsafe.user.id;

// === Utility Functions ===
const showAlert = (message) => alert(message);
const showLoading = (element, show = true) => {
    if (element) {
        element.style.opacity = show ? '0.5' : '1';
        element.style.pointerEvents = show ? 'none' : 'auto';
    }
};

// === API Communication ===

async function fetchUserStatus(userId) {
    const response = await fetch(`${BACKEND_URL}/credits/${userId}`);
    if (!response.ok) throw new Error("Could not fetch user status.");
    return await response.json();
}

/**
 * Generates a QR code from the given text data.
 */
async function generateQRCode(data, userId) {
  const response = await fetch(`${BACKEND_URL}/generate_qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: data, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate QR code.");
  }
  return URL.createObjectURL(await response.blob());
}

/**
 * Removes the background from an uploaded image.
 */
async function removeBackground(imageFile, userId) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('user_id', userId);

  const response = await fetch(`${BACKEND_URL}/remove_bg`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove background.");
   }
  return await response.blob();
}

/**
 * Creates a new image based on an input image and a style.
 */
async function createImageFromImage(imageFile, style, customStyle, userId) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('style', style === 'custom' ? customStyle : style);
    formData.append('user_id', userId);

    const response = await fetch(`${BACKEND_URL}/image_to_image`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create image.");
    }
    return await response.blob();
}

/**
 * Converts an uploaded image to a PDF document.
 */
async function generatePdf(imageFile, userId) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId);

    const response = await fetch(`${BACKEND_URL}/image_to_pdf`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate PDF.");
    }
    return await response.blob();
}

/**
 * Generates a ZIP file of QR codes from a CSV file.
 */
async function generateBulkQr(csvFile, userId) {
    const formData = new FormData();
    formData.append('csv_file', csvFile);
    formData.append('user_id', userId);

    const response = await fetch(`${BACKEND_URL}/bulk_generate_qr`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate bulk QR codes.");
    }
    return await response.blob();
}


/**
 * Requests credits from watching an ad.
 */
async function watchAdAndGetCredits(userId) {
  const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
      throw new Error("Ad credit failed");
  }
  return await response.json();
}

// === DOM Event Logic ===
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Initializing...");

    // --- Element Selectors ---
    const creditCountEl = document.getElementById('creditCount');
    const img2imgCountEl = document.getElementById('img2imgCount');
    
    const qrInput = document.getElementById('qrInput');
    const generateQRBtn = document.getElementById('generateQRBtn');
    const qrImage = document.getElementById('qrImage');

    const bgInput = document.getElementById('bgInput');
    const bgOutput = document.getElementById('bgOutput');

    const imageToImageInput = document.getElementById('imageToImageInput');
    const styleSelect = document.getElementById('styleSelect');
    const customStyleInput = document.getElementById('customStyleInput');
    const imageToImageOutput = document.getElementById('imageToImageOutput');

    const pdfInput = document.getElementById('pdfInput');
    const pdfOutputLink = document.getElementById('pdfOutputLink');
    
    const bulkQrInput = document.getElementById('bulkQrCsv');
    const bulkQrOutputLink = document.getElementById('bulkQrOutputLink');

    const watchAdBtn = document.getElementById('watchAdBtn');

    // --- Load Initial User Status ---
    const loadUserStatus = async () => {
        try {
            const status = await fetchUserStatus(userId);
            if (creditCountEl) creditCountEl.textContent = status.credits;
            if (img2imgCountEl) img2imgCountEl.textContent = status.img2img_count;
        } catch (err) {
            showAlert(err.message);
        }
    };

    // --- Event Listeners ---
    generateQRBtn?.addEventListener('click', async () => {
        const data = qrInput.value;
        if (!data) return showAlert("Please enter text to generate a QR code.");
        showLoading(generateQRBtn);
        try {
            const qrUrl = await generateQRCode(data, userId);
            qrImage.src = qrUrl;
            qrImage.style.display = 'block';
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(generateQRBtn, false);
        }
    });

    bgInput?.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const label = document.querySelector('label[for="bgInput"]');
        showLoading(label);
        try {
            const resultBlob = await removeBackground(file, userId);
            bgOutput.src = URL.createObjectURL(resultBlob);
            bgOutput.style.display = 'block';
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(label, false);
        }
    });

    imageToImageInput?.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const style = styleSelect.value;
        const customStyle = customStyleInput.value;
        if (style === 'custom' && !customStyle) return showAlert("Please enter a custom style prompt.");
        const label = document.querySelector('label[for="imageToImageInput"]');
        showLoading(label);
        try {
            const resultBlob = await createImageFromImage(file, style, customStyle, userId);
            imageToImageOutput.src = URL.createObjectURL(resultBlob);
            imageToImageOutput.style.display = 'block';
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(label, false);
        }
    });

    pdfInput?.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const label = document.querySelector('label[for="pdfInput"]');
        showLoading(label);
        try {
            const pdfBlob = await generatePdf(file, userId);
            const pdfUrl = URL.createObjectURL(pdfBlob);
            pdfOutputLink.href = pdfUrl;
            pdfOutputLink.textContent = "Download PDF";
            pdfOutputLink.download = `z-mini-tool-${Date.now()}.pdf`;
            pdfOutputLink.style.display = 'block';
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(label, false);
        }
    });
    
    bulkQrInput?.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const label = document.querySelector('label[for="bulkQrCsv"]');
        showLoading(label);
        try {
            const zipBlob = await generateBulkQr(file, userId);
            const zipUrl = URL.createObjectURL(zipBlob);
            bulkQrOutputLink.href = zipUrl;
            bulkQrOutputLink.textContent = "Download Bulk QR ZIP";
            bulkQrOutputLink.download = `z-mini-bulk-qr-${Date.now()}.zip`;
            bulkQrOutputLink.style.display = 'block';
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(label, false);
        }
    });

    watchAdBtn?.addEventListener('click', async () => {
        showLoading(watchAdBtn);
        try {
            const result = await watchAdAndGetCredits(userId);
            showAlert(result.message || "Credits updated!");
            await loadUserStatus();
        } catch (err) {
            showAlert(err.message);
        } finally {
            showLoading(watchAdBtn, false);
        }
    });

    // --- Initial Load ---
    loadUserStatus();
});
