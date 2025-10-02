const gplay = require('google-play-scraper');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { term, country = 'us', limit = '18' } = req.query;

    if (!term) {
      return res.status(400).json({ error: 'term parameter is required' });
    }

    const results = await gplay.search({
      term: term,
      num: parseInt(limit, 10),
      lang: country === 'cn' ? 'zh_CN' : 'en',
      country: country.toUpperCase(),
    });

    // Transform Google Play results to match iTunes API structure
    const transformedResults = {
      results: results.map(app => ({
        trackId: app.appId,
        trackName: app.title,
        artistName: app.developer,
        artworkUrl512: app.icon,
        kind: 'googlePlaySoftware',
        trackViewUrl: app.url,
        bundleId: app.appId,
      }))
    };

    res.status(200).json(transformedResults);
  } catch (error) {
    console.error('Google Play search error:', error);
    res.status(500).json({ error: 'Failed to search Google Play', results: [] });
  }
};
