const { mockOffers } = require('./_data');
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'GET') {
    res.json(mockOffers);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newOffer = { id: mockOffers.length + 1, ...JSON.parse(body), status: 'pending' };
      mockOffers.push(newOffer);
      res.status(201).json(newOffer);
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
