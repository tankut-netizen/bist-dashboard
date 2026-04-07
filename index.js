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
    const input = req.query.symbols;
    const symbols = input ? input.split(',') : ['THYAO.IS', 'GARAN.IS', 'AKBNK.IS', 'EREGL.IS', 'BIMAS.IS'];
    const results = [];
    for (const symbol of symbols) {
      const quote = await yahooFinance.quote(symbol);
      results.push(quote);
      await new Promise(r => setTimeout(r, 300));
    }
    const usdRate = await yahooFinance.quote('USDTRY=X');
    const tryPerUsd = usdRate.regularMarketPrice;

    res.json(results.map(stock => ({
      symbol: stock.symbol,
      name: stock.shortName,
      price: stock.regularMarketPrice,
      change: stock.regularMarketChangePercent,
      marketCapUSD: stock.marketCap ? parseFloat((stock.marketCap / tryPerUsd / 1_000_000).toFixed(2)) : null
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});