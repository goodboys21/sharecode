const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

const BLOB_URL = 'http://jsonblob.com/api/jsonBlob/1400708501327765504'

app.post('/api/create', async (req, res) => {
  const { title, language, code } = req.body
  if (!title || !language || !code) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const id = Math.random().toString(36).slice(2, 10)
  const data = {
    id,
    title,
    language,
    code,
    created_at: new Date().toISOString()
  }

  try {
    const response = await axios.get(BLOB_URL)
    const allData = response.data
    allData[id] = data

    await axios.put(BLOB_URL, allData)

    return res.json({ success: true, id, url: `/${id}` })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save', error: err.message })
  }
})

// optional view endpoint
app.get('/api/view/:id', async (req, res) => {
  const id = req.params.id
  try {
    const response = await axios.get(BLOB_URL)
    const data = response.data[id]
    if (!data) return res.status(404).json({ message: 'Not found' })

    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch', error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
