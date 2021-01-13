const axios = require('axios');

const resourceUrl = 'https://9takgwjuxl-dsn.algolia.net/1/indexes/WINES_prod/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%20(lite)&x-algolia-application-id=9TAKGWJUXL&x-algolia-api-key=60c11b2f1068885161d95ca068d3a6ae';

let wineRatingCache = new Map();

initCacheCleanDispatcher(12 * 3600 * 1000);

const exportWineRating = (wineQueryResult) => {
  const wines = [];
  wineQueryResult.hits.forEach(vivino => {
    const name = vivino.vintages.length > 0 ? vivino.vintages[0].name : undefined;
    const score = vivino.statistics.ratings_average;
    const reviewsCount = vivino.statistics.ratings_count;
    const link = vivino.vintages.length > 0 ? `https://www.vivino.com/wines/${vivino.vintages[0].id}?cart_item_source=text-search` : this.resourceUrl;
    if (!score) {
      return;
    }
    wines.push({
      name,
      score,
      reviewsCount,
      link
    });
  });
  return wines.length > 0 ? wines[0] : undefined;
};

function initCacheCleanDispatcher(interval) {
  setInterval(() => {
    wineRatingCache.clear();
  }, interval);
}

exports.getWineRating = async (wine) => {
  try {
    if (!wineRatingCache.has(wine)) {
      const wineQueryResult = await axios.post(resourceUrl, {
        params: `query=${encodeURIComponent(wine)}&hitsPerPage=6`
      });
      const wineRating = exportWineRating(wineQueryResult.data);
      wineRatingCache.set(wine, wineRating);
    }
    return wineRatingCache.get(wine);
  } catch (error) {
    return undefined;
  }
};
