const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JSONBLOB_URL = 'http://jsonblob.com/api/jsonBlob/1400708501327765504';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Fetch all shared codes
const fetchCodes = async () => {
  try {
    const res = await axios.get(JSONBLOB_URL);
    return res.data || {};
  } catch (err) {
    console.error('Failed to fetch data:', err.message);
    return {};
  }
};

// Update blob with new data
const updateCodes = async (data) => {
  try {
    await axios.put(JSONBLOB_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Failed to update blob:', err.message);
  }
};

// Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Create code
app.post('/api/create', async (req, res) => {
  const { title, content, language } = req.body;
  if (!content) return res.status(400).json({ error: 'Code content required!' });

  const id = uuidv4().slice(0, 6);
  const existing = await fetchCodes();

  existing[id] = {
    id,
    title: title || 'Untitled',
    content,
    language: language || 'plaintext',
    createdAt: new Date().toISOString()
  };

  await updateCodes(existing);

  res.json({ id });
});

// View code
app.get('/:id', async (req, res) => {
  res.sendFile(__dirname + '/public/id.html');
});

// Get code data for front-end
app.get('/api/code/:id', async (req, res) => {
  const data = await fetchCodes();
  const code = data[req.params.id];
  if (!code) return res.status(404).json({ error: 'Code not found' });
  res.json(code);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
