document.getElementById('download-btn').addEventListener('click', function() {
    const url = document.getElementById('url-input').value.trim();
    
    if(!url) {
        alert('Please paste Instagram URL');
        return;
    }
    
    if(!url.includes('instagram.com')) {
        alert('Please enter a valid Instagram URL');
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('download-btn');
    btn.innerHTML = 'Processing...';
    btn.disabled = true;
    
    // You would replace this with your actual backend API call
    simulateDownload(url)
        .then(() => {
            alert('Download ready! Implement your backend to handle actual downloads');
        })
        .catch(() => {
            alert('Error downloading. Please try again.');
        })
        .finally(() => {
            btn.innerHTML = 'Download';
            btn.disabled = false;
        });
});

function simulateDownload(url) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            console.log('Would normally download:', url);
            resolve();
        }, 1500);
    });
}
