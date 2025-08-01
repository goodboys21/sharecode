export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, lang, code } = req.body;
    if (!name || !lang || !code) return res.status(400).json({ error: 'Invalid data' });

    // Ambil isi blob saat ini
    const blobUrl = 'http://jsonblob.com/api/jsonBlob/1400708501327765504';
    const getData = await fetch(blobUrl);
    const jsonData = await getData.json();

    // Buat ID acak
    const id = Math.random().toString(36).substr(2, 8);

    // Tambahkan ke data blob
    jsonData[id] = { name, lang, code, time: Date.now() };

    // Update blob
    await fetch(blobUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    });

    return res.status(200).json({ success: true, id });
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error', detail: e.message });
  }
}
