// server.js const express = require('express') const axios = require('axios') const path = require('path') const { v4: uuidv4 } = require('uuid') const app = express()

app.use(express.json()) app.use(express.urlencoded({ extended: true })) app.use(express.static('public'))

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/1391431496337907712'

async function loadPastes() { try { const res = await axios.get(BLOB_URL) return res.data || {} } catch (e) { return {} } }

async function savePaste(id, data) { const pastes = await loadPastes() pastes[id] = data await axios.put(BLOB_URL, pastes) }

app.post('/api/create', async (req, res) => { const { name, code } = req.body const id = uuidv4() await savePaste(id, { name, code, language: 'javascript' }) res.json({ id }) })

app.get('/:id', async (req, res) => { const pastes = await loadPastes() const paste = pastes[req.params.id] if (!paste) return res.status(404).send('Not Found')

res.send( <!DOCTYPE html> <html> <head> <title>${paste.name}</title> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"> <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script> <script>hljs.highlightAll();</script> <style> body { font-family: sans-serif; padding: 20px; background-color: #f9f9f9; } pre { background: #f0f0f0; padding: 16px; border-radius: 8px; overflow-x: auto; } h1 { margin-bottom: 16px; } button { margin-top: 20px; background-color: #3b82f6; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; } </style> </head> <body> <h1>${paste.name}</h1> <pre><code class="language-${paste.language}">${paste.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre> <button onclick="navigator.clipboard.writeText(\${paste.code.replace(//g, '\')}`)">Copy</button> </body> </html> `) })

const PORT = process.env.PORT || 3000 app.listen(PORT, () => console.log('Server run on http://localhost:' + PORT))

