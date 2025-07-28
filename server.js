const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/download', async (req, res) => {
  const reelUrl = req.query.url;
  if (!reelUrl) return res.status(400).json({ error: 'URL missing' });

  try {
    const api = `https://api.sssinstagram.com/api/instagram?url=${encodeURIComponent(reelUrl)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (data && data.url) {
      res.json({ video: data.url });
    } else {
      res.status(500).json({ error: 'Failed to fetch video' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
