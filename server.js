const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Updated Download endpoint
app.post('/download', async (req, res) => {
    try {
        const { url } = req.body;
        
        // Improved URL validation
        if (!url || !(url.includes('instagram.com/reel/') || url.includes('instagram.com/p/'))) {
            return res.status(400).json({ error: 'Please provide a valid Instagram Reel or Post URL' });
        }
        
        // Clean URL - remove query parameters if any
        const cleanUrl = url.split('?')[0];
        
        // Fetch the Instagram page with updated headers
        const response = await axios.get(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Updated method to extract video URL
        let videoUrl = $('meta[property="og:video"]').attr('content') || 
                      $('meta[property="og:video:url"]').attr('content') ||
                      $('meta[property="og:video:secure_url"]').attr('content');
        
        // Alternative method if above fails
        if (!videoUrl) {
            const scriptTags = $('script[type="application/ld+json"]').html();
            if (scriptTags) {
                try {
                    const jsonData = JSON.parse(scriptTags);
                    videoUrl = jsonData?.video?.contentUrl || jsonData?.video?.url;
                } catch (e) {
                    console.log('JSON parse error:', e);
                }
            }
        }
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Could not extract video URL. Instagram may have changed their structure.' });
        }
        
        res.json({ videoUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to download the reel. Please try again or use a different URL.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
