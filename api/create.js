export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Missing name or code' });
  }

  try {
    const blob = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: name, code })
    });

    const location = blob.headers.get('Location');
    const id = location.split('/').pop();

    res.status(200).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create JSONBlob' });
  }
}
