document.getElementById('download-btn').addEventListener('click', async function() {
    const url = document.getElementById('url-input').value.trim();
    
    if (!url.includes('instagram.com')) {
        alert('Invalid Instagram URL!');
        return;
    }

    const btn = document.getElementById('download-btn');
    btn.innerHTML = 'Fetching...';
    
    try {
        const response = await fetch('https://t2insta.pythonanywhere.com/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.open(data.download_url, '_blank'); // Open download link
        } else {
            alert('Error: ' + (data.error || 'Failed to download'));
        }
    } catch (error) {
        alert('Server error. Try again later.');
    } finally {
        btn.innerHTML = 'Download';
    }
});
