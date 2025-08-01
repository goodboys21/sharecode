// /api/create.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { name, language, content } = req.body;

  try {
    const jsonBlobRes = await axios.post('https://jsonblob.com/api/jsonBlob', {
      name,
      language,
      content
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const location = jsonBlobRes.headers['location'];
    const id = location.split('/').pop();

    return res.status(200).json({ id });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
