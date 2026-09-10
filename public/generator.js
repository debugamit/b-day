document.getElementById('generator-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const soloPhotosInput = document.getElementById('soloPhotos');
    if (soloPhotosInput.files.length !== 4) {
        document.getElementById('solo-warning').style.display = 'block';
        return;
    } else {
        document.getElementById('solo-warning').style.display = 'none';
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = 'Generating... Please wait ⏳';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    try {
        const response = await fetch('/api/create', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            const fullUrl = window.location.origin + result.url;
            document.getElementById('generated-link').value = fullUrl;
            document.getElementById('visit-link').href = fullUrl;
            
            document.getElementById('generator-form').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
        } else {
            alert('Failed to generate surprise: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading. Please try again.');
    } finally {
        submitBtn.innerText = 'Generate Surprise Link 🪄';
        submitBtn.disabled = false;
    }
});
