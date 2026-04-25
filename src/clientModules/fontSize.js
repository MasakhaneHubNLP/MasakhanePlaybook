/**
 * Wires up the navbar font-size buttons (data-font-scale-action="dec|reset|inc").
 * Persists the selected level in localStorage so it survives reloads.
 */
const STORAGE_KEY = 'mp-font-scale';
const MIN = 0;
const MAX = 5;
const DEFAULT = 2;

function clamp(n) {
  return Math.max(MIN, Math.min(MAX, n));
}

function readStored() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === null) return DEFAULT;
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return DEFAULT;
    return clamp(n);
  } catch {
    return DEFAULT;
  }
}

function applyLevel(level) {
  const root = document.documentElement;
  root.setAttribute('data-font-scale', String(level));
  try {
    window.localStorage.setItem(STORAGE_KEY, String(level));
  } catch {
    /* ignore */
  }
  document
    .querySelectorAll('[data-font-scale-action="dec"]')
    .forEach((b) => {
      b.disabled = level <= MIN;
    });
  document
    .querySelectorAll('[data-font-scale-action="inc"]')
    .forEach((b) => {
      b.disabled = level >= MAX;
    });
}

let initialized = false;

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;

  const level = readStored();
  applyLevel(level);

  if (initialized) return;
  initialized = true;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-font-scale-action]');
    if (!btn) return;
    e.preventDefault();
    const action = btn.getAttribute('data-font-scale-action');
    let next = readStored();
    if (action === 'inc') next = clamp(next + 1);
    else if (action === 'dec') next = clamp(next - 1);
    else if (action === 'reset') next = DEFAULT;
    applyLevel(next);
  });
}
