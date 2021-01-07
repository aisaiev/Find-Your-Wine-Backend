const vivinoService = require('./vivino.service');
const express = require('express');
const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/get-wine-rating', async (req, res) => {
  const wine = req.query.wine;
  if (!wine) {
    return res.status(400).json({
      message: 'No wine provided'
    });
  }
  const wineRating = await vivinoService.getWineRating(wine);
  res.json(wineRating);
});

app.listen(PORT);