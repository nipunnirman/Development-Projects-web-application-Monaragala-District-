class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 300000) { // Default 5 minutes (300,000 ms)
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  clear() {
    this.cache.clear();
    console.log('🧹 Backend Cache cleared.');
  }
}

const dbCache = new SimpleCache();
export default dbCache;
