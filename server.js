const express = require('express');
const axios = require('axios');
const { nanoid } = require('nanoid'); // opsional kalau mau generate ID sendiri

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

// ✅ CREATE paste
app.post('/api/create', async (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Name and code required' });

  try {
    const response = await axios.post('https://jsonblob.com/api/jsonBlob', { name, code }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const location = response.headers.location; // e.g. https://jsonblob.com/api/jsonBlob/xxxxxxxx
    const id = location.split('/').pop();

    res.json({ id }); // You can change to { url: `/view/${id}` } if you prefer
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create JSONBlob' });
  }
});

// ✅ VIEW paste
app.get('/view/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const jsonUrl = `https://jsonblob.com/api/jsonBlob/${id}`;
    const response = await axios.get(jsonUrl);
    const { name, code } = response.data;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${name} - ShareCode</title>
        <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet"/>
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
          pre { background: #272822; color: #f8f8f2; padding: 15px; border-radius: 8px; overflow: auto; }
        </style>
      </head>
      <body>
        <h1>${name}</h1>
        <pre><code class="language-javascript">${escapeHTML(code)}</code></pre>
        <p><a href="/">← Back to ShareCode</a></p>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(404).send('<h1>404 Not Found</h1><p>Code not found or cannot be loaded.</p>');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
