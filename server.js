// server.js const express = require('express'); const bodyParser = require('body-parser'); const axios = require('axios'); const app = express(); const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); app.use(express.static('public'));

const JSONBLOB_BASE = 'https://jsonblob.com/api/jsonBlob';

function generateRandomID(length = 8) { const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let result = ''; for (let i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); } return result; }

app.post('/api/create', async (req, res) => { const { name, code } = req.body; if (!name || !code) return res.status(400).json({ error: 'Missing name or code' });

const id = generateRandomID(); const data = { name, code, createdAt: new Date().toISOString() };

try { const blobRes = await axios.post(JSONBLOB_BASE, data, { headers: { 'Content-Type': 'application/json' } });

res.json({ id, blobUrl: blobRes.headers.location });

} catch (err) { res.status(500).json({ error: 'Failed to save to JSONBlob', details: err.message }); } });

app.get('/view/:id', async (req, res) => { const id = req.params.id; const blobUrl = ${JSONBLOB_BASE}/${id};

try { const blobRes = await axios.get(blobUrl); const paste = blobRes.data;

res.send(`
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${paste.name}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/github-dark.css">
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/lib/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    <style>body{background:#0f172a;color:white;padding:2em;font-family:monospace}</style>
  </head>
  <body>
    <h1>${paste.name}</h1>
    <pre><code>${paste.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </body>
</html>`);

} catch (err) { res.status(404).send('Code not found or failed to fetch from JSONBlob.'); } });

app.listen(PORT, () => console.log(Server running on http://localhost:${PORT}));

