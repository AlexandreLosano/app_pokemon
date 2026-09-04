'use strict';

const cache = new Map();

async function apiFetch(url) {
  const key = url.startsWith('http') ? url : `${API}${url}`;
  if (cache.has(key)) return cache.get(key);
  const r = await fetch(key);
  if (!r.ok) throw new Error(`HTTP ${r.status} — ${key}`);
  const d = await r.json();
  cache.set(key, d);
  return d;
}
