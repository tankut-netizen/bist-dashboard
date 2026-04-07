const express = require('express');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
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
    const symbols = ['THYAO.IS', 'GARAN.IS', 'AKBNK.IS', 'EREGL.IS', 'BIMAS.IS'];
    const results = await Promise.all(
      symbols.map(symbol => yahooFinance.quote(symbol))
    );
    res.json(results.map(stock => ({
      symbol: stock.symbol,
      name: stock.shortName,
      price: stock.regularMarketPrice,
      change: stock.regularMarketChangePercent
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});