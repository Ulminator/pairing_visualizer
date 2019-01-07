const mcache = require('memory-cache');

exports.cache = duration => (req, res, next) => {
  const { cache_enabled: cacheEnabled } = req.query;

  if (cacheEnabled === 'true') {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = mcache.get(key);

    if (cachedBody) return res.status(200).send(JSON.parse(cachedBody));

    res.sendResponse = res.send;
    res.send = (body) => {
      if (res.statusCode !== 500) {
        mcache.put(key, body, duration * 1000);
      }

      return res.status(res.statusCode).sendResponse(body);
    };
  }

  return next();
};
