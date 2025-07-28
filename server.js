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

// Download endpoint
app.post('/download', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url || !url.includes('instagram.com/reel/')) {
            return res.status(400).json({ error: 'Please provide a valid Instagram Reel URL' });
        }
        
        // Fetch the Instagram page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Extract video URL from meta tags
        const videoUrl = $('meta[property="og:video"]').attr('content') || 
                         $('meta[property="og:video:url"]').attr('content');
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Could not extract video URL from the provided link' });
        }
        
        res.json({ videoUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to download the reel. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
