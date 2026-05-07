const { cargoes } = require('./_data');
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = cargoes.map(({ id, lat, lng, name, status, speed }) => ({ id, lat, lng, name, status, speed }));
  res.json(data);
};
