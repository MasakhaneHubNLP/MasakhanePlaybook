/**
 * Fetches the star count for the GitHub repo and updates any element
 * matching [data-gh-stars]. Caches the result for 6 hours in
 * localStorage to avoid hitting the GitHub API rate limit.
 */
const REPO = 'MasakhaneHubNLP/MasakhanePlaybook';
const CACHE_KEY = 'mp-gh-stars';
const TTL_MS = 6 * 60 * 60 * 1000;

function formatCount(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function applyCount(n) {
  const formatted = formatCount(n);
  document.querySelectorAll('[data-gh-stars]').forEach((el) => {
    if (formatted) {
      el.textContent = formatted;
      el.removeAttribute('aria-busy');
    }
  });
}

async function fetchStars() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {Accept: 'application/vnd.github+json'},
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.stargazers_count !== 'number') return null;
    return data.stargazers_count;
  } catch {
    return null;
  }
}

async function loadStars() {
  if (typeof window === 'undefined') return;
  let cached = null;
  try {
    cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    /* ignore */
  }
  if (cached && typeof cached.n === 'number' && Date.now() - cached.t < TTL_MS) {
    applyCount(cached.n);
    return;
  }
  const n = await fetchStars();
  if (n !== null) {
    applyCount(n);
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({n, t: Date.now()}));
    } catch {
      /* ignore */
    }
  }
}

export function onRouteDidUpdate() {
  // Apply cached count on every route change so the navbar always shows it,
  // but only re-fetch from the network on the very first load.
  if (typeof window === 'undefined') return;
  if (window.__mpGhStarsLoaded) {
    let cached = null;
    try {
      cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) || 'null');
    } catch {
      /* ignore */
    }
    if (cached && typeof cached.n === 'number') applyCount(cached.n);
    return;
  }
  window.__mpGhStarsLoaded = true;
  loadStars();
}
