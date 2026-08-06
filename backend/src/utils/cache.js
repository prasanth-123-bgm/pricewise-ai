const ttlMs = Number(process.env.CACHE_TTL_MS || 300000);
const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

function setCache(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

module.exports = {
  getCache,
  setCache,
};
