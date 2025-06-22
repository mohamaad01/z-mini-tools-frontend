const BACKEND_URL = "https://z-mini-tools.onrender.com";
        const userId = "demo_user"; // Replace with Telegram user ID

        // Initialize Telegram WebApp
        let tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.MainButton.hide();
        }

        // Utility functions
        function showLoading(elementId) {
            document.getElementById(elementId).style.display = 'block';
        }

        function hideLoading(elementId) {
            document.getElementById(elementId).style.display = 'none';
        }

        function showError(message, parentElement) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            parentElement.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }

        function showSuccess(message, parentElement) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = message;
            parentElement.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        }

        // Load user credits
        async function loadCredits() {
            try {
                const response = await fetch(`${BACKEND_URL}/credits/${userId}`);
                const data = await response.json();
                document.getElementById('creditsDisplay').textContent = `💎 Credits: ${data.credits}`;
            } catch (error) {
                document.getElementById('creditsDisplay').textContent = '💎 Credits: Error';
            }
        }

        // QR Code Generation
        async function generateQRCode() {
            const input = document.getElementById('qrInput');
            const btn = document.getElementById('generateQRBtn');
            const img = document.getElementById('qrImage');
            
            if (!input.value.trim()) {
                showError('Please enter text or URL', input.parentElement);
                return;
            }

            btn.disabled = true;
            showLoading('qrLoading');

            try {
                const response = await fetch(`${BACKEND_URL}/generate_qr`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: input.value, user_id: userId })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to generate QR code');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.style.display = 'block';
                
                showSuccess('QR code generated successfully!', input.parentElement);
                await loadCredits();
            } catch (error) {
                showError(error.message, input.parentElement);
            } finally {
                btn.disabled = false;
                hideLoading('qrLoading');
            }
        }

        // Background Removal
        async function removeBackground() {
            const input = document.getElementById('bgInput');
            const btn = document.getElementById('removeBgBtn');
            const img = document.getElementById('bgOutput');
            
            if (!input.files[0]) {
                showError('Please select an image', input.parentElement);
                return;
            }

            btn.disabled = true;
            showLoading('bgLoading');

            try {
                const formData = new FormData();
                formData.append('image', input.files[0]);
                formData.append('user_id', userId);

                const response = await fetch(`${BACKEND_URL}/remove_bg`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to remove background');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.style.display = 'block';
                
                showSuccess('Background removed successfully!', input.parentElement);
                await loadCredits();
            } catch (error) {
                showError(error.message, input.parentElement);
            } finally {
                btn.disabled = false;
                hideLoading('bgLoading');
            }
        }

        // Image to PDF
        async function convertToPDF() {
            const input = document.getElementById('pdfInput');
            const btn = document.getElementById('convertPdfBtn');
            const result = document.getElementById('pdfResult');
            
            if (!input.files[0]) {
                showError('Please select an image', input.parentElement);
                return;
            }

            btn.disabled = true;
            showLoading('pdfLoading');

            try {
                const formData = new FormData();
                formData.append('image', input.files[0]);
                formData.append('user_id', userId);

                const response = await fetch(`${BACKEND_URL}/image_to_pdf`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to convert to PDF');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'converted.pdf';
                downloadLink.className = 'btn';
                downloadLink.textContent = '📥 Download PDF';
                downloadLink.style.display = 'inline-block';
                downloadLink.style.marginTop = '10px';
                
                result.innerHTML = '';
                result.appendChild(downloadLink);
                
                showSuccess('PDF created successfully!', input.parentElement);
                await loadCredits();
            } catch (error) {
                showError(error.message, input.parentElement);
            } finally {
                btn.disabled = false;
                hideLoading('pdfLoading');
            }
        }

        // AI Image Transform
        async function transformImage() {
            const input = document.getElementById('aiInput');
            const btn = document.getElementById('transformBtn');
            const img = document.getElementById('aiOutput');
            
            if (!input.files[0]) {
                showError('Please select an image', input.parentElement);
                return;
            }

            btn.disabled = true;
            showLoading('aiLoading');

            try {
                const formData = new FormData();
                formData.append('image', input.files[0]);
                formData.append('user_id', userId);

                const response = await fetch(`${BACKEND_URL}/image_to_image`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to transform image');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.style.display = 'block';
                
                showSuccess('Image transformed successfully!', input.parentElement);
                await loadCredits();
            } catch (error) {
                showError(error.message, input.parentElement);
            } finally {
                btn.disabled = false;
                hideLoading('aiLoading');
            }
        }

        // Watch Ad
        async function watchAd() {
            const btn = document.getElementById('watchAdBtn');
            btn.disabled = true;
            btn.textContent = 'Processing...';

            try {
                const response = await fetch(`${BACKEND_URL}/api/watch-ad`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to process ad');
                }

                showSuccess(data.message || '3 credits added!', btn.parentElement);
                await loadCredits();
            } catch (error) {
                showError(error.message, btn.parentElement);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Watch Ad (+3 Credits)';
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            loadCredits();
            
            document.getElementById('generateQRBtn').addEventListener('click', generateQRCode);
            document.getElementById('removeBgBtn').addEventListener('click', removeBackground);
            document.getElementById('convertPdfBtn').addEventListener('click', convertToPDF);
            document.getElementById('transformBtn').addEventListener('click', transformImage);
            document.getElementById('watchAdBtn').addEventListener('click', watchAd);
        });
