const OWNER = 'MasakhaneHubNLP';
const REPO = 'MasakhanePlaybook';
const BASE_BRANCH = 'main';
const API = 'https://api.github.com';

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

export async function fetchRawFile(filePath) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BASE_BRANCH}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cannot fetch ${filePath}: ${res.status}`);
  return res.text();
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
