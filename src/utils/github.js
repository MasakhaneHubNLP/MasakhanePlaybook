const OWNER = 'MasakhaneHubNLP';
const REPO = 'MasakhanePlaybook';
const BASE_BRANCH = 'main';
const API = 'https://api.github.com';
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BASE_BRANCH}`;

function encodeBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
  );
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

async function ghFetch(path, token, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`GitHub ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Open a GitHub OAuth popup and resolve with an access token.
 *
 * @param {string} clientId   - GitHub OAuth App client_id (safe to expose)
 * @param {string} proxyUrl   - Cloudflare Worker URL that exchanges code → token
 * @param {string} callbackUrl - Full URL to /oauth-callback on the same origin
 */
/**
 * GitHub Device Flow — no client_secret required.
 * The proxy only needs to forward requests and add CORS headers.
 *
 * Step 1: call startDeviceFlow → get user_code to show in UI
 * Step 2: call pollDeviceFlow → resolves with access_token when user authorises
 */
export async function startDeviceFlow(clientId, proxyUrl) {
  const resp = await fetch(`${proxyUrl}/device-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, scope: 'public_repo' }),
  });
  if (!resp.ok) throw new Error(`Device flow init failed: ${resp.status}`);
  return resp.json();
  // → { device_code, user_code, verification_uri, expires_in, interval }
}

export async function pollDeviceFlow(clientId, deviceCode, proxyUrl, intervalSecs, signal) {
  let wait = intervalSecs;
  while (true) {
    await new Promise(r => setTimeout(r, wait * 1000));
    if (signal?.aborted) throw new Error('cancelled');

    const resp = await fetch(`${proxyUrl}/device-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    });
    const data = await resp.json();
    if (data.access_token) return data.access_token;
    if (data.error === 'authorization_pending') continue;
    if (data.error === 'slow_down') { wait += 5; continue; }
    if (data.error === 'expired_token') throw new Error('Code expired — please try again.');
    if (data.error === 'access_denied') throw new Error('Access denied on GitHub.');
    throw new Error(data.error_description || data.error || 'Device flow failed.');
  }
}

export async function loginWithGitHub(clientId, proxyUrl, callbackUrl) {
  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=public_repo` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}`;

  const popup = window.open(authUrl, 'github-oauth', 'width=620,height=720,left=200,top=100');
  if (!popup) throw new Error('Popup was blocked. Please allow popups for this site.');

  // Wait for the callback page to post the code back
  const code = await new Promise((resolve, reject) => {
    function onMessage(e) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'github-oauth-callback') return;
      window.removeEventListener('message', onMessage);
      clearInterval(closedCheck);
      if (e.data.error) reject(new Error(e.data.errorDesc || e.data.error));
      else resolve(e.data.code);
    }
    window.addEventListener('message', onMessage);

    // Detect if user closed the popup without completing
    const closedCheck = setInterval(() => {
      if (popup.closed) {
        clearInterval(closedCheck);
        window.removeEventListener('message', onMessage);
        reject(new Error('cancelled'));
      }
    }, 500);
  });

  // Exchange code for token via the proxy (client_secret stays on the proxy)
  const resp = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error_description || err.error || `Exchange failed: ${resp.status}`);
  }

  const { access_token } = await resp.json();
  if (!access_token) throw new Error('No access token returned from proxy.');
  return access_token;
}

export async function verifyGitHubToken(token) {
  const user = await ghFetch('/user', token);
  return { username: user.login, avatarUrl: user.avatar_url, name: user.name || user.login };
}

export async function fetchRawFile(filePath) {
  const res = await fetch(`${RAW}/${filePath}`);
  if (!res.ok) throw new Error(`Cannot fetch ${filePath}: ${res.status}`);
  return res.text();
}

async function ghFetchPublic(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
}

function titleCase(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function buildDocsTree(files, cats, basePath = 'docs') {
  const prefix = basePath + '/';
  const directFiles = files.filter(f => {
    const rel = f.path.slice(prefix.length);
    return f.path.startsWith(prefix) && rel && !rel.includes('/');
  });
  const subdirs = [...new Set(
    files
      .filter(f => f.path.startsWith(prefix) && f.path.slice(prefix.length).includes('/'))
      .map(f => f.path.slice(prefix.length).split('/')[0])
      .filter(Boolean),
  )];

  const nodes = [];

  for (const f of directFiles) {
    if (!f.path.endsWith('.md')) continue;
    const slug = f.path.replace(/^.*\//, '').replace('.md', '');
    if (slug === 'index') continue;
    nodes.push({ type: 'page', slug, path: f.path, label: titleCase(slug), sha: f.sha, position: Infinity, children: [] });
  }

  for (const dir of subdirs) {
    const catPath = `${basePath}/${dir}/_category_.json`;
    const cat = cats[catPath];
    if (!cat) continue;
    const children = buildDocsTree(files, cats, `${basePath}/${dir}`);
    nodes.push({
      type: 'section',
      slug: dir,
      path: `${basePath}/${dir}`,
      label: cat.label || titleCase(dir),
      position: cat.position != null ? cat.position : Infinity,
      categoryData: cat,
      children,
    });
  }

  nodes.sort((a, b) => {
    const pa = isFinite(a.position) ? a.position : Infinity;
    const pb = isFinite(b.position) ? b.position : Infinity;
    if (pa !== pb) return pa - pb;
    return a.slug.localeCompare(b.slug);
  });

  return nodes;
}

export function computeDocsTree(gitFiles, catData, changes) {
  let files = [...gitFiles];
  const cats = { ...catData };

  for (const [path, change] of Object.entries(changes)) {
    if (change.op === 'delete') {
      files = files.filter(f => f.path !== path);
      if (path.endsWith('_category_.json')) delete cats[path];
    } else {
      if (!files.find(f => f.path === path)) files.push({ path, sha: null });
      if (path.endsWith('_category_.json')) {
        try { cats[path] = JSON.parse(change.content); } catch {}
      }
    }
  }

  return buildDocsTree(files, cats);
}

export async function fetchDocsTree(token) {
  const fetcher = token ? (p) => ghFetch(p, token) : ghFetchPublic;

  const ref = await fetcher(`/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`);
  const commit = await fetcher(`/repos/${OWNER}/${REPO}/git/commits/${ref.object.sha}`);
  const treeData = await fetcher(`/repos/${OWNER}/${REPO}/git/trees/${commit.tree.sha}?recursive=1`);

  const files = treeData.tree.filter(f => f.path.startsWith('docs/') && f.type === 'blob');
  const catPaths = files.filter(f => f.path.endsWith('_category_.json'));

  const cats = {};
  await Promise.all(
    catPaths.map(async f => {
      try {
        const text = await fetch(`${RAW}/${f.path}`).then(r => r.text());
        cats[f.path] = JSON.parse(text);
      } catch {}
    }),
  );

  return { files, cats };
}

export async function createStructurePR({ token, changes, prTitle, prBody }) {
  const ref = await ghFetch(`/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`, token);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await ghFetch(`/repos/${OWNER}/${REPO}/git/commits/${baseCommitSha}`, token);

  const treeEntries = changes.map(c =>
    c.op === 'delete'
      ? { path: c.path, mode: '100644', type: 'blob', sha: null }
      : { path: c.path, mode: '100644', type: 'blob', content: c.content },
  );

  const newTree = await ghFetch(`/repos/${OWNER}/${REPO}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }),
  });

  const newCommit = await ghFetch(`/repos/${OWNER}/${REPO}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({ message: prTitle, tree: newTree.sha, parents: [baseCommitSha] }),
  });

  const branch = `structure/edit-${Date.now().toString(36)}`;
  await ghFetch(`/repos/${OWNER}/${REPO}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: newCommit.sha }),
  });

  const pr = await ghFetch(`/repos/${OWNER}/${REPO}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify({ title: prTitle, head: branch, base: BASE_BRANCH, body: prBody }),
  });

  return { number: pr.number, url: pr.html_url, branch };
}

export async function createEditPR({ token, filePath, newContent, prTitle, prBody }) {
  const branch = `edit/${slugify(filePath.replace(/[/.]/g, '-'))}-${Date.now().toString(36)}`;

  const ref = await ghFetch(
    `/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`,
    token
  );
  const file = await ghFetch(
    `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BASE_BRANCH}`,
    token
  );

  await ghFetch(`/repos/${OWNER}/${REPO}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }),
  });

  await ghFetch(`/repos/${OWNER}/${REPO}/contents/${filePath}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: `edit: ${filePath}`,
      content: encodeBase64(newContent),
      sha: file.sha,
      branch,
    }),
  });

  const pr = await ghFetch(`/repos/${OWNER}/${REPO}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify({
      title: prTitle,
      head: branch,
      base: BASE_BRANCH,
      body: prBody,
    }),
  });

  return { number: pr.number, url: pr.html_url, branch };
}
