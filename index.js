const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'BIST Dashboard Backend is running!' });
});

app.get('/bist', async (req, res) => {
  try {
    const response = await fetch('https://evo.fintables.com/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'veri_sorgula',
        input: {
          sql: "SELECT hisse_senedi_kodu, kapanis FROM mumlar_gunluk_gh WHERE 'XU050' = ANY(endeksler) ORDER BY tarih DESC LIMIT 50"
        }
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});