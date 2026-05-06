import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  fetchDocsTree,
  computeDocsTree,
  createStructurePR,
  fetchRawFile,
  verifyGitHubToken,
  loginWithGitHub,
  startDeviceFlow,
  pollDeviceFlow,
} from '@site/src/utils/github';
import mammoth from 'mammoth';
import { WysiwygEditor, mdToHtml, htmlToMd } from '@site/src/components/EditModal';
import styles from './index.module.css';

const AUTH_KEY = 'masakhane_pb_auth';
const CHANGES_KEY = 'masakhane_pb_changes';

// All languages supported by the translation proxy
// European/Arabic/Swahili → Helsinki-NLP via HF; African languages → MyMemory
const SUPPORTED_AUTO_TRANSLATE = new Set(['fr', 'ar', 'sw', 'de', 'es', 'pt', 'ha', 'yo', 'am', 'ig', 'zu', 'om', 'so', 'rw']);

async function autoTranslateChunk(text, tgtLang, proxyUrl) {
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tgt_lang: tgtLang }),
  });
  const contentType = res.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Worker returned unexpected response (HTTP ${res.status}) — check TRANSLATION_PROXY_URL`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data[0]?.translation_text || text;
}

async function translateHtmlContent(html, tgtLang, proxyUrl) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const blocks = Array.from(div.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th'));
  for (const block of blocks) {
    const text = block.textContent.trim();
    if (text.length < 3) continue;
    block.textContent = await autoTranslateChunk(text, tgtLang, proxyUrl);
  }
  return div.innerHTML;
}

function splitFrontmatter(md) {
  const m = String(md).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { frontmatter: `---\n${m[1]}\n---\n`, content: m[2] } : { frontmatter: '', content: md };
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

function setFrontmatterField(content, key, value) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    const raw = m[1];
    const body = m[2];
    const newRaw = raw.match(new RegExp(`^${key}:`, 'm'))
      ? raw.replace(new RegExp(`^${key}:.*`, 'm'), `${key}: ${value}`)
      : `${raw}\n${key}: ${value}`;
    return `---\n${newRaw}\n---\n${body}`;
  }
  return `---\n${key}: ${value}\n---\n\n${content}`;
}

function starterPage(title, position) {
  return `---\nsidebar_position: ${position}\n---\n\n# ${title}\n\nAdd content here.\n`;
}

function starterCategory(label, position, description = '') {
  return JSON.stringify(
    { label, position, link: { type: 'generated-index', description } },
    null,
    2,
  );
}

/* ── Inline add / rename form ────────────────────────────────────────── */

function InlineForm({ placeholder, initialValue = '', onConfirm, onCancel }) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (value.trim()) onConfirm(value.trim()); }
    if (e.key === 'Escape') onCancel();
  }

  return (
    <div className={styles.inlineForm}>
      <input
        ref={inputRef}
        className={styles.inlineInput}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
      />
      <button
        className={styles.inlineConfirm}
        onClick={() => value.trim() && onConfirm(value.trim())}
        type="button"
        disabled={!value.trim()}
      >
        Add
      </button>
      <button className={styles.inlineCancel} onClick={onCancel} type="button">✕</button>
    </div>
  );
}

/* ── GitHub auth panel ───────────────────────────────────────────────── */

const GH_MARK = (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

function AuthPanel({ auth, clientId, proxyUrl, callbackUrl, onConnect, onDisconnect }) {
  // phases: 'idle' | 'loading' | 'device-pending' | 'waiting'
  const [phase, setPhase] = useState('idle');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const abortRef = useRef(null);

  // What's available depends on which env vars are set
  const canPopup  = !!(clientId && proxyUrl && callbackUrl);
  const canDevice = !!(clientId && proxyUrl);

  // ── Popup OAuth (best UX — requires Cloudflare Worker + callbackUrl) ──
  async function handlePopupOAuth() {
    setPhase('loading');
    setError('');
    try {
      const token = await loginWithGitHub(clientId, proxyUrl, callbackUrl);
      await onConnect(token);
    } catch (e) {
      if (e.message === 'cancelled') { setPhase('idle'); return; }
      // Popup was blocked → fall back to device flow silently
      if (e.message?.includes('Popup')) {
        setError('Popup blocked — switching to device flow.');
        await handleDeviceFlow();
        return;
      }
      setError(e.message || 'GitHub login failed.');
      setPhase('idle');
    }
  }

  // ── Device Flow (requires Cloudflare Worker, no client_secret) ────────
  async function handleDeviceFlow() {
    setPhase('loading');
    setError('');
    try {
      const info = await startDeviceFlow(clientId, proxyUrl);
      setDeviceInfo(info);
      window.open(info.verification_uri, '_blank', 'noopener,noreferrer');
      setPhase('device-pending');
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const token = await pollDeviceFlow(clientId, info.device_code, proxyUrl, info.interval || 5, ctrl.signal);
      await onConnect(token);
    } catch (e) {
      if (e.message === 'cancelled') { setPhase('idle'); return; }
      setError(e.message || 'GitHub login failed.');
      setPhase('idle');
    }
  }

  function cancelDevice() {
    abortRef.current?.abort();
    setPhase('idle');
    setDeviceInfo(null);
    setError('');
  }

  // ── Main sign-in handler: picks best available method ─────────────────
  function handleSignIn() {
    if (canPopup)  return handlePopupOAuth();
    if (canDevice) return handleDeviceFlow();
  }

  async function handlePaste() {
    if (!draft.trim()) return;
    setPhase('loading');
    setError('');
    try {
      await onConnect(draft.trim());
    } catch (e) {
      setError(e.message || 'Invalid token or missing public_repo permission.');
      setPhase('idle');
    }
  }

  // ── Connected ─────────────────────────────────────────────────────────
  if (auth) {
    return (
      <div className={styles.authConnected}>
        <img src={auth.avatarUrl} alt={auth.username} className={styles.authAvatar} />
        <span className={styles.authUsername}>@{auth.username}</span>
        <button className={styles.authSignOutBtn} onClick={onDisconnect} type="button">Sign out</button>
      </div>
    );
  }

  // ── Device flow pending ───────────────────────────────────────────────
  if (phase === 'device-pending' && deviceInfo) {
    return (
      <div className={styles.authDeviceBox}>
        <p className={styles.authDevicePrompt}>Enter this code on the GitHub tab that just opened:</p>
        <div className={styles.authDeviceCode}>{deviceInfo.user_code}</div>
        <p className={styles.authDeviceHint}>Waiting for authorisation…</p>
        <button className={styles.authCancelSmall} onClick={cancelDevice} type="button">Cancel</button>
      </div>
    );
  }

  // ── Default: GitHub button + token input always visible ──────────────
  return (
    <div className={styles.authBlock}>
      <button
        className={styles.authGitHubBtn}
        onClick={handleSignIn}
        disabled={phase === 'loading' || !canDevice}
        title={!canDevice ? 'OAuth not configured — use a personal access token below' : undefined}
        type="button"
      >
        {GH_MARK}
        {phase === 'loading' ? 'Connecting…' : 'Sign in with GitHub'}
      </button>
      <p className={styles.authOrDivider}>or use a personal access token</p>
      <div className={styles.authPatRow}>
        <input
          type="password"
          className={styles.authTokenInput}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePaste()}
          placeholder="ghp_xxxxxxxxxxxx"
          autoComplete="off"
        />
        <button
          className={styles.authConnectBtn}
          onClick={handlePaste}
          disabled={!draft.trim() || phase === 'loading'}
          type="button"
        >
          {phase === 'loading' ? '…' : 'Connect'}
        </button>
      </div>
      <a
        href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook"
        target="_blank" rel="noreferrer noopener"
        className={styles.authTokenLink}
      >
        Generate a token on GitHub ↗
      </a>
      {error && <p className={styles.authError}>{error}</p>}
    </div>
  );
}

/* ── Single tree row ─────────────────────────────────────────────────── */

function TreeRow({
  node,
  depth,
  siblings,
  expanded,
  onToggle,
  activeForm,
  onSetActiveForm,
  onAddPage,
  onAddSection,
  onAddSubPage,
  onRename,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEditPage,
  onEditSection,
  editingPath,
  loadingPaths,
  locked,
}) {
  const idx = siblings.indexOf(node);
  const canUp = idx > 0;
  const canDown = idx < siblings.length - 1;
  const isExpanded = expanded.has(node.path);
  const isLoading = loadingPaths.has(node.path);
  const formKey = `${node.path}:`;
  const isEditing = editingPath === node.path;
  const lockTitle = 'Sign in with GitHub to make changes';

  const indent = depth * 20;

  return (
    <>
      <div
        className={`${styles.treeRow} ${isEditing ? styles.treeRowActive : ''}`}
        style={{ paddingLeft: indent + 8 }}
      >
        {node.type === 'section' ? (
          <button className={styles.expandBtn} onClick={() => onToggle(node.path)} type="button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className={styles.expandSpacer} />
        )}

        <span className={styles.nodeIcon}>{node.type === 'section' ? '📁' : '📄'}</span>
        <span
          className={`${styles.nodeLabel} ${styles.nodeLabelClickable}`}
          title={node.path}
          onClick={() => node.type === 'page' ? onEditPage(node) : onEditSection(node)}
        >
          {node.label}
        </span>

        {isLoading && <span className={styles.loadingDot} title="Loading…">⋯</span>}

        <div className={styles.nodeActions}>
          {node.type === 'page' && (
            <button
              className={`${styles.actionBtn} ${styles.editPageBtn}`}
              title={locked ? lockTitle : 'Edit page content'}
              onClick={locked ? undefined : () => onEditPage(node)}
              disabled={locked}
              type="button"
            >
              ✎
            </button>
          )}
          {node.type === 'section' && (
            <button
              className={`${styles.actionBtn} ${styles.editPageBtn}`}
              title={locked ? lockTitle : 'Edit section intro page'}
              onClick={locked ? undefined : () => onEditSection(node)}
              disabled={locked}
              type="button"
            >
              ✎
            </button>
          )}
          {node.type === 'section' && (
            <button
              className={styles.actionBtn}
              title={locked ? lockTitle : 'Add page inside this section'}
              onClick={locked ? undefined : () => onSetActiveForm(`${formKey}add-page`)}
              disabled={locked}
              type="button"
            >
              + Page
            </button>
          )}
          {node.type === 'page' && (
            <button
              className={styles.actionBtn}
              title={locked ? lockTitle : 'Add a sub-page'}
              onClick={locked ? undefined : () => onSetActiveForm(`${formKey}add-subpage`)}
              disabled={locked}
              type="button"
            >
              + Sub
            </button>
          )}
          <button
            className={styles.actionBtn}
            title={locked ? lockTitle : 'Rename'}
            onClick={locked ? undefined : () => onSetActiveForm(`${formKey}rename`)}
            disabled={locked}
            type="button"
          >
            ✏
          </button>
          <button className={`${styles.actionBtn} ${styles.arrowBtn}`} title={locked ? lockTitle : 'Move up'} onClick={locked ? undefined : () => onMoveUp(node)} disabled={locked || !canUp} type="button">↑</button>
          <button className={`${styles.actionBtn} ${styles.arrowBtn}`} title={locked ? lockTitle : 'Move down'} onClick={locked ? undefined : () => onMoveDown(node)} disabled={locked || !canDown} type="button">↓</button>
          {node.type === 'page' && (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              title={locked ? lockTitle : 'Delete page'}
              onClick={locked ? undefined : () => onDelete(node)}
              disabled={locked}
              type="button"
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {activeForm === `${formKey}add-page` && (
        <div style={{ paddingLeft: indent + 36 }}>
          <InlineForm
            placeholder="New page title…"
            onConfirm={label => { onAddPage(node, label); onSetActiveForm(null); }}
            onCancel={() => onSetActiveForm(null)}
          />
        </div>
      )}
      {activeForm === `${formKey}add-subpage` && (
        <div style={{ paddingLeft: indent + 36 }}>
          <InlineForm
            placeholder="New sub-page title…"
            onConfirm={label => { onAddSubPage(node, label); onSetActiveForm(null); }}
            onCancel={() => onSetActiveForm(null)}
          />
        </div>
      )}
      {activeForm === `${formKey}rename` && (
        <div style={{ paddingLeft: indent + 36 }}>
          <InlineForm
            placeholder="New label…"
            initialValue={node.label}
            onConfirm={label => { onRename(node, label); onSetActiveForm(null); }}
            onCancel={() => onSetActiveForm(null)}
          />
        </div>
      )}

      {node.type === 'section' && isExpanded && node.children.map(child => (
        <TreeRow
          key={child.path}
          node={child}
          depth={depth + 1}
          siblings={node.children}
          expanded={expanded}
          onToggle={onToggle}
          activeForm={activeForm}
          onSetActiveForm={onSetActiveForm}
          onAddPage={onAddPage}
          onAddSection={onAddSection}
          onAddSubPage={onAddSubPage}
          onRename={onRename}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          onEditPage={onEditPage}
          onEditSection={onEditSection}
          editingPath={editingPath}
          loadingPaths={loadingPaths}
          locked={locked}
        />
      ))}
    </>
  );
}

/* ── Modal content ───────────────────────────────────────────────────── */

export function StructureEditorContent({ onClose }) {
  const { siteConfig } = useDocusaurusContext();
  const oauthClientId = siteConfig.customFields?.GITHUB_OAUTH_CLIENT_ID || '';
  const oauthProxyUrl    = siteConfig.customFields?.GITHUB_OAUTH_PROXY_URL || '';
  const translationProxy = siteConfig.customFields?.TRANSLATION_PROXY_URL || '';
  // On localhost the popup redirect_uri won't match GitHub's registered callback,
  // so we leave callbackUrl empty — canPopup becomes false and device flow is used instead.
  const oauthCallbackUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.origin}${siteConfig.baseUrl}oauth-callback`
    : '';

  // Auth: read synchronously from localStorage so the first tree fetch can use the token
  const [auth, setAuth] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  // Tree data
  const [gitFiles, setGitFiles] = useState([]);
  const [catData, setCatData] = useState({});
  const [pageCache, setPageCache] = useState({});

  // Changes: persisted in localStorage
  const [changes, setChanges] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingPaths, setLoadingPaths] = useState(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const [expanded, setExpanded] = useState(new Set());
  const [activeForm, setActiveForm] = useState(null);
  const [rightPanel, setRightPanel] = useState(null);

  // Resizable dialog, panel splitter, and fullscreen
  const [modalSize, setModalSize] = useState({ width: 1120, height: 780 });
  const [modalPos,  setModalPos]  = useState(null); // { x, y } | null = centered
  const [leftWidth, setLeftWidth] = useState(320);
  const [leftHidden, setLeftHidden] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [translateSplitWidth, setTranslateSplitWidth] = useState(null); // null = 50/50 until first drag

  // Translation tab
  const [rightPanelTab, setRightPanelTab] = useState('edit'); // 'edit' | 'translate'
  const [translationLang, setTranslationLang] = useState('fr');
  const [translationHtml, setTranslationHtml] = useState('');
  const [translateKey, setTranslateKey] = useState(0);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null); // { fileName, title, titleFromH1, markdown }
  const [uploadBatch, setUploadBatch] = useState(null);    // [{ fileName, title, titleFromH1, markdown }]
  const [uploadPlacement, setUploadPlacement] = useState('page'); // 'page' | 'section' | 'subsection'
  const [uploadTargetSection, setUploadTargetSection] = useState('');
  const [uploadSectionName, setUploadSectionName] = useState('');

  function handleSplitterMouseDown(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      const next = Math.max(180, Math.min(560, startWidth + ev.clientX - startX));
      setLeftWidth(next);
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function handleHeaderMouseDown(e) {
    if (fullscreen) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    const startLeft = modalPos ? modalPos.x : (window.innerWidth  - modalSize.width)  / 2;
    const startTop  = modalPos ? modalPos.y : (window.innerHeight - modalSize.height) / 2;
    const offsetX   = e.clientX - startLeft;
    const offsetY   = e.clientY - startTop;
    document.body.style.cursor     = 'move';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      setModalPos({
        x: Math.max(0, Math.min(window.innerWidth  - modalSize.width,  ev.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - modalSize.height, ev.clientY - offsetY)),
      });
    }
    function onUp() {
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }

  function handleDialogResizeMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = modalSize.width;
    const startH = modalSize.height;
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      const w = Math.max(600, Math.min(window.innerWidth - 32, startW + ev.clientX - startX));
      const h = Math.max(400, Math.min(window.innerHeight - 32, startH + ev.clientY - startY));
      setModalSize({ width: w, height: h });
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  const tree = useMemo(() => computeDocsTree(gitFiles, catData, changes), [gitFiles, catData, changes]);

  /* ── Bootstrap: load pending changes from localStorage ── */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHANGES_KEY);
      if (raw) setChanges(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist changes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(changes).length === 0) {
      localStorage.removeItem(CHANGES_KEY);
    } else {
      localStorage.setItem(CHANGES_KEY, JSON.stringify(changes));
    }
  }, [changes]);

  // Fetch tree — use auth token when available (5000 req/hr vs 60/hr unauthenticated)
  const loadTree = useCallback((token) => {
    setLoading(true);
    setError('');
    return fetchDocsTree(token || null)
      .then(({ files, cats }) => {
        setGitFiles(files);
        setCatData(cats);
        const topKeys = Object.keys(cats).filter(p => p.match(/^docs\/[^/]+\/_category_\.json$/));
        setExpanded(new Set(topKeys.map(p => p.replace('/_category_.json', ''))));
      })
      .catch(e => {
        const is403 = e.message?.includes('403');
        setError(is403
          ? 'GitHub rate limit reached. Sign in with GitHub below to load the tree.'
          : `Failed to load playbook tree: ${e.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadTree(auth?.token); }, []);  // initial load

  // Retry tree load when user signs in (clears a previous 403 rate-limit error)
  const prevAuthToken = useRef(null);
  const uploadInputRef = useRef(null);
  useEffect(() => {
    if (auth?.token && auth.token !== prevAuthToken.current && error?.includes('rate limit')) {
      prevAuthToken.current = auth.token;
      loadTree(auth.token);
    } else if (auth?.token) {
      prevAuthToken.current = auth.token;
    }
  }, [auth?.token, error, loadTree]);

  /* ── Auth ─────────────────────────────────────────────────────────────── */

  async function handleConnect(token) {
    const info = await verifyGitHubToken(token);
    const authData = { token, ...info };
    setAuth(authData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  }

  function handleDisconnect() {
    setAuth(null);
    localStorage.removeItem(AUTH_KEY);
  }

  /* ── Document upload ──────────────────────────────────────────────────── */

  async function extractPageImages(page, pdfjsLib) {
    const MIN_PX = 20;
    const images = [];
    const seen = new Set();

    let ops;
    try { ops = await page.getOperatorList(); } catch { return images; }

    async function fetchObj(name) {
      return new Promise(resolve => {
        try { page.objs.get(name, resolve); }
        catch { try { page.commonObjs.get(name, resolve); } catch { resolve(null); } }
      });
    }

    function renderToDataUrl(imgData) {
      if (!imgData?.data || imgData.width < MIN_PX || imgData.height < MIN_PX) return null;
      const canvas = document.createElement('canvas');
      canvas.width = imgData.width;
      canvas.height = imgData.height;
      const ctx = canvas.getContext('2d');
      const id = ctx.createImageData(imgData.width, imgData.height);
      id.data.set(imgData.data);
      ctx.putImageData(id, 0, 0);
      return canvas.toDataURL('image/png');
    }

    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
        const name = ops.argsArray[i][0];
        if (seen.has(name)) continue;
        seen.add(name);
        const imgData = await fetchObj(name);
        const dataUrl = renderToDataUrl(imgData);
        if (dataUrl) images.push(dataUrl);

      } else if (ops.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject) {
        const imgData = ops.argsArray[i][0];
        const dataUrl = renderToDataUrl(imgData);
        if (dataUrl) images.push(dataUrl);
      }
    }
    return images;
  }

  async function pdfToMarkdown(pdf, pdfjsLib) {
    const pages = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const [content, images] = await Promise.all([
        page.getTextContent(),
        extractPageImages(page, pdfjsLib),
      ]);
      pages.push({ items: content.items, images });
    }

    const allItems = pages.flatMap(p => p.items).filter(item => item.str?.trim());
    const heights = allItems
      .map(item => Math.abs(item.transform?.[3] || 0))
      .filter(h => h > 2)
      .sort((a, b) => a - b);
    const bodySize = heights[Math.floor(heights.length * 0.4)] || 12;

    const mdParts = [];
    let paraBuffer = [];

    function flushPara() {
      if (paraBuffer.length) {
        mdParts.push(paraBuffer.join(' '));
        paraBuffer = [];
      }
    }

    for (const { items, images } of pages) {
      const sorted = [...items]
        .filter(item => item.str?.trim())
        .sort((a, b) => {
          const ay = a.transform?.[5] ?? 0;
          const by = b.transform?.[5] ?? 0;
          return by - ay || (a.transform?.[4] ?? 0) - (b.transform?.[4] ?? 0);
        });

      let lineY = null;
      let lineItems = [];
      let lineMaxH = 0;

      function flushLine() {
        if (!lineItems.length) return;
        const text = lineItems.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
        if (!text) return;
        const ratio = lineMaxH / bodySize;
        if (ratio >= 1.8) { flushPara(); mdParts.push(`# ${text}`); }
        else if (ratio >= 1.4) { flushPara(); mdParts.push(`## ${text}`); }
        else if (ratio >= 1.15) { flushPara(); mdParts.push(`### ${text}`); }
        else paraBuffer.push(text);
        lineItems = [];
        lineMaxH = 0;
      }

      for (const item of sorted) {
        const y = item.transform?.[5] ?? 0;
        const h = Math.abs(item.transform?.[3] ?? bodySize);
        if (lineY === null || Math.abs(y - lineY) > bodySize * 0.5) {
          flushLine();
          lineY = y;
        }
        lineItems.push(item);
        lineMaxH = Math.max(lineMaxH, h);
      }
      flushLine();
      flushPara();

      // Append extracted images after each page's text
      for (const dataUrl of images) {
        mdParts.push(`![](${dataUrl})`);
      }
    }

    return mdParts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  async function parseUploadFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    let markdown = '';
    try {
      if (ext === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        markdown = await pdfToMarkdown(pdf, pdfjsLib);
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer }, {
          convertImage: mammoth.images.imgElement(image =>
            image.read('base64').then(b64 => ({
              src: `data:${image.contentType};base64,${b64}`,
            }))
          ),
        });
        markdown = htmlToMd(result.value);
      } else {
        const text = await file.text();
        if (ext === 'md' || ext === 'mdx') markdown = text;
        else if (ext === 'txt') markdown = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map(p => p.replace(/\n/g, ' ')).join('\n\n');
        else if (ext === 'html' || ext === 'htm') markdown = htmlToMd(text);
        else return null;
      }
    } catch (err) {
      console.error('[upload] parse error:', file.name, err);
      return null;
    }
    const h1 = markdown.match(/^#\s+(.+)$/m);
    const titleFromH1 = !!h1;
    const title = h1 ? h1[1].trim() : file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    return { fileName: file.name, title, titleFromH1, markdown };
  }

  async function handleUploadFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = '';

    const defaultSection = tree.find(n => n.type === 'section')?.path ?? '';

    if (files.length === 1) {
      const item = await parseUploadFile(files[0]);
      if (!item) return;
      setUploadPreview(item);
      setUploadPlacement('page');
      setUploadTargetSection(defaultSection);
      setUploadSectionName('');
    } else {
      const items = (await Promise.all(files.map(parseUploadFile))).filter(Boolean);
      if (!items.length) return;
      setUploadBatch(items);
      setUploadPlacement('section');
      setUploadTargetSection(defaultSection);
      setUploadSectionName('');
    }
  }

  function buildUploadContent(markdown, title, position) {
    const { frontmatter } = splitFrontmatter(markdown);
    if (!frontmatter) {
      return `---\nsidebar_position: ${position}\nsidebar_label: ${JSON.stringify(title)}\n---\n\n${markdown}`;
    }
    let c = setFrontmatterField(markdown, 'sidebar_position', position);
    c = setFrontmatterField(c, 'sidebar_label', JSON.stringify(title));
    return c;
  }

  function flatSections(nodes) {
    return nodes.flatMap(n =>
      n.type === 'section' ? [n, ...flatSections(n.children)] : []
    );
  }

  function handleConfirmUpload() {
    if (!uploadPreview) return;
    const { title, markdown } = uploadPreview;
    const pageSlug = slugify(title);

    if (uploadPlacement === 'page') {
      const sectionNode = flatSections(tree).find(n => n.path === uploadTargetSection);
      if (!sectionNode) return;
      const path = `${sectionNode.path}/${pageSlug}.md`;
      const position = sectionNode.children.length + 1;
      upsert(path, buildUploadContent(markdown, title, position));

    } else if (uploadPlacement === 'section') {
      const label = uploadSectionName.trim() || title;
      const slug = slugify(label);
      const position = tree.filter(n => n.type === 'section')
        .reduce((m, n) => Math.max(m, isFinite(n.position) ? n.position : 0), 0) + 1;
      upsert(`docs/${slug}/_category_.json`, starterCategory(label, position));
      upsert(`docs/${slug}/${pageSlug}.md`, buildUploadContent(markdown, title, 1));
      setExpanded(prev => new Set([...prev, `docs/${slug}`]));

    } else if (uploadPlacement === 'subsection') {
      const parentNode = flatSections(tree).find(n => n.path === uploadTargetSection);
      if (!parentNode) return;
      const label = uploadSectionName.trim() || title;
      const subSlug = slugify(label);
      const subPath = `${parentNode.path}/${subSlug}`;
      const subPos = parentNode.children.length + 1;
      upsert(`${subPath}/_category_.json`, starterCategory(label, subPos));
      upsert(`${subPath}/${pageSlug}.md`, buildUploadContent(markdown, title, 1));
      setExpanded(prev => new Set([...prev, parentNode.path, subPath]));
    }

    setUploadPreview(null);
    setUploadTargetSection('');
    setUploadSectionName('');
  }

  function handleConfirmBatch() {
    if (!uploadBatch?.length) return;

    if (uploadPlacement === 'page') {
      const sectionNode = flatSections(tree).find(n => n.path === uploadTargetSection);
      if (!sectionNode) return;
      uploadBatch.forEach((item, i) => {
        const path = `${sectionNode.path}/${slugify(item.title)}.md`;
        upsert(path, buildUploadContent(item.markdown, item.title, sectionNode.children.length + 1 + i));
      });

    } else if (uploadPlacement === 'section') {
      const label = uploadSectionName.trim() || uploadBatch[0].title;
      const slug = slugify(label);
      const position = tree.filter(n => n.type === 'section')
        .reduce((m, n) => Math.max(m, isFinite(n.position) ? n.position : 0), 0) + 1;
      upsert(`docs/${slug}/_category_.json`, starterCategory(label, position));
      uploadBatch.forEach((item, i) => {
        upsert(`docs/${slug}/${slugify(item.title)}.md`, buildUploadContent(item.markdown, item.title, i + 1));
      });
      setExpanded(prev => new Set([...prev, `docs/${slug}`]));

    } else if (uploadPlacement === 'subsection') {
      const parentNode = flatSections(tree).find(n => n.path === uploadTargetSection);
      if (!parentNode) return;
      const label = uploadSectionName.trim() || uploadBatch[0].title;
      const subSlug = slugify(label);
      const subPath = `${parentNode.path}/${subSlug}`;
      const subPos = parentNode.children.length + 1;
      upsert(`${subPath}/_category_.json`, starterCategory(label, subPos));
      uploadBatch.forEach((item, i) => {
        upsert(`${subPath}/${slugify(item.title)}.md`, buildUploadContent(item.markdown, item.title, i + 1));
      });
      setExpanded(prev => new Set([...prev, parentNode.path, subPath]));
    }

    setUploadBatch(null);
    setUploadTargetSection('');
    setUploadSectionName('');
  }

  /* ── Resize handlers ──────────────────────────────────────────────────── */

  function handleSplitterMouseDown(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      setLeftWidth(Math.max(180, Math.min(560, startWidth + ev.clientX - startX)));
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function handleTranslateSplitterMouseDown(e) {
    e.preventDefault();
    const container = e.currentTarget.parentElement;
    const startX = e.clientX;
    const startWidth = translateSplitWidth ?? container.offsetWidth / 2;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      const max = container.offsetWidth - 204;
      setTranslateSplitWidth(Math.max(200, Math.min(max, startWidth + ev.clientX - startX)));
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function handleDialogResizeMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = modalSize.width;
    const startH = modalSize.height;
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
    function onMove(ev) {
      setModalSize({
        width: Math.max(600, Math.min(window.innerWidth - 32, startW + ev.clientX - startX)),
        height: Math.max(400, Math.min(window.innerHeight - 32, startH + ev.clientY - startY)),
      });
    }
    function onUp() {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* ── Change helpers ─────────────────────────────────────────────────── */

  function upsert(path, content) {
    setChanges(prev => ({ ...prev, [path]: { op: 'upsert', content } }));
  }

  function del(path) {
    setChanges(prev => ({ ...prev, [path]: { op: 'delete' } }));
  }

  function undoChange(path) {
    setChanges(prev => { const n = { ...prev }; delete n[path]; return n; });
    if (rightPanel?.path === path) setRightPanel(null);
  }

  function clearAllChanges() {
    if (!window.confirm('Discard all pending changes?')) return;
    setChanges({});
    setRightPanel(null);
  }

  async function getPageContent(path) {
    if (changes[path]?.op === 'upsert') return changes[path].content;
    if (pageCache[path]) return pageCache[path];
    const content = await fetchRawFile(path);
    setPageCache(prev => ({ ...prev, [path]: content }));
    return content;
  }

  function setNodeLoading(path, on) {
    setLoadingPaths(prev => {
      const n = new Set(prev);
      on ? n.add(path) : n.delete(path);
      return n;
    });
  }

  /* ── Right panel ─────────────────────────────────────────────────────── */

  async function handleEditSection(node) {
    const indexPath = `${node.path}/index.md`;
    if (rightPanel?.path === indexPath && !rightPanel.fetching) return;
    setRightPanel({ path: indexPath, htmlContent: null, frontmatter: '', fetching: true, dirty: false });
    setRightPanelTab('edit');
    setTranslationHtml('');
    try {
      const md = await getPageContent(indexPath);
      const { frontmatter, content } = splitFrontmatter(md);
      setRightPanel({ path: indexPath, htmlContent: mdToHtml(content), frontmatter, fetching: false, dirty: false });
    } catch {
      // File doesn't exist yet — open a blank starter (saved to pendingChanges on save)
      const starter = `---\nsidebar_label: ${JSON.stringify(node.label)}\nsidebar_position: 0\n---\n\n# ${node.label}\n\n`;
      const { frontmatter, content } = splitFrontmatter(starter);
      setRightPanel({ path: indexPath, htmlContent: mdToHtml(content), frontmatter, fetching: false, dirty: true });
    }
  }

  async function handleEditPage(node) {
    if (rightPanel?.path === node.path && !rightPanel.fetching) return;
    setRightPanel({ path: node.path, htmlContent: null, frontmatter: '', fetching: true, dirty: false });
    setRightPanelTab('edit');
    setTranslationHtml('');
    try {
      const md = await getPageContent(node.path);
      const { frontmatter, content } = splitFrontmatter(md);
      setRightPanel({ path: node.path, htmlContent: mdToHtml(content), frontmatter, fetching: false, dirty: false });
    } catch (e) {
      setError(`Could not load page: ${e.message}`);
      setRightPanel(null);
    }
  }

  function saveRightPanel() {
    if (!rightPanel || rightPanel.fetching) return;
    const md = htmlToMd(rightPanel.htmlContent);
    upsert(rightPanel.path, (rightPanel.frontmatter || '') + md + '\n');
    setRightPanel(prev => ({ ...prev, dirty: false }));
  }

  function translationFilePath(docPath, lang) {
    return `i18n/${lang}/docusaurus-plugin-content-docs/current/${docPath.replace(/^docs\//, '')}`;
  }

  function saveTranslation() {
    if (!rightPanel || !translationHtml.trim()) return;
    const md = htmlToMd(translationHtml);
    upsert(translationFilePath(rightPanel.path, translationLang), (rightPanel.frontmatter || '') + md + '\n');
  }

  function openGoogleTranslate() {
    if (!rightPanel) return;
    const md = htmlToMd(rightPanel.htmlContent);
    const url = `https://translate.google.com/?sl=en&tl=${translationLang}&text=${encodeURIComponent(md.slice(0, 5000))}&op=translate`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function handleAutoTranslate() {
    if (!translationProxy || !rightPanel) return;
    setTranslating(true);
    setTranslateError('');
    setTranslationHtml('');
    try {
      const result = await translateHtmlContent(rightPanel.htmlContent, translationLang, translationProxy);
      setTranslationHtml(result);
      setTranslateKey(k => k + 1);
    } catch (e) {
      setTranslateError(e.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  }

  /* ── Operations ─────────────────────────────────────────────────────── */

  function findSiblings(targetPath) {
    function search(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].path === targetPath) return nodes;
        if (nodes[i].children?.length) {
          const r = search(nodes[i].children);
          if (r) return r;
        }
      }
      return null;
    }
    return search(tree) || [];
  }

  function addSection(label) {
    const slug = slugify(label);
    const position = tree.filter(n => n.type === 'section').reduce((m, n) => Math.max(m, isFinite(n.position) ? n.position : 0), 0) + 1;
    upsert(`docs/${slug}/_category_.json`, starterCategory(label, position));
    upsert(`docs/${slug}/intro.md`, starterPage('Introduction', 1));
    setExpanded(prev => new Set([...prev, `docs/${slug}`]));
  }

  function addPage(sectionNode, label) {
    const slug = slugify(label);
    const position = sectionNode.children.length + 1;
    const path = `${sectionNode.path}/${slug}.md`;
    upsert(path, starterPage(label, position));
    const md = starterPage(label, position);
    const { frontmatter, content } = splitFrontmatter(md);
    setRightPanel({ path, htmlContent: mdToHtml(content), frontmatter, fetching: false, dirty: false });
  }

  async function addSubPage(pageNode, label) {
    const parentDir = pageNode.path.replace(/\/[^/]+\.md$/, '');
    const pageSlug = pageNode.slug;
    const newDirPath = `${parentDir}/${pageSlug}`;

    setNodeLoading(pageNode.path, true);
    try {
      const origContent = await getPageContent(pageNode.path);
      const newSlug = slugify(label);

      upsert(`${newDirPath}/_category_.json`, starterCategory(pageNode.label, pageNode.position != null && isFinite(pageNode.position) ? pageNode.position : 99));
      upsert(`${newDirPath}/index.md`, origContent);
      upsert(`${newDirPath}/${newSlug}.md`, starterPage(label, 2));
      del(pageNode.path);
      if (rightPanel?.path === pageNode.path) setRightPanel(null);
      setExpanded(prev => new Set([...prev, newDirPath]));
    } catch (e) {
      setError(`Could not load page content: ${e.message}`);
    } finally {
      setNodeLoading(pageNode.path, false);
    }
  }

  function renameSection(node, newLabel) {
    const catPath = `${node.path}/_category_.json`;
    const existing = changes[catPath]?.op === 'upsert' ? JSON.parse(changes[catPath].content) : node.categoryData || {};
    upsert(catPath, JSON.stringify({ ...existing, label: newLabel }, null, 2));
  }

  async function renamePage(node, newLabel) {
    setNodeLoading(node.path, true);
    try {
      const content = await getPageContent(node.path);
      upsert(node.path, setFrontmatterField(content, 'sidebar_label', JSON.stringify(newLabel)));
    } catch (e) {
      setError(`Could not load page: ${e.message}`);
    } finally {
      setNodeLoading(node.path, false);
    }
  }

  function renameNode(node, newLabel) {
    if (node.type === 'section') renameSection(node, newLabel);
    else renamePage(node, newLabel);
  }

  async function moveSectionPosition(node, newPos) {
    const catPath = `${node.path}/_category_.json`;
    const existing = changes[catPath]?.op === 'upsert' ? JSON.parse(changes[catPath].content) : node.categoryData || {};
    upsert(catPath, JSON.stringify({ ...existing, position: newPos }, null, 2));
  }

  async function movePagePosition(node, newPos) {
    setNodeLoading(node.path, true);
    try {
      const content = await getPageContent(node.path);
      upsert(node.path, setFrontmatterField(content, 'sidebar_position', newPos));
    } catch (e) {
      setError(`Could not reorder page: ${e.message}`);
    } finally {
      setNodeLoading(node.path, false);
    }
  }

  async function moveNode(node, direction) {
    const siblings = findSiblings(node.path);
    const idx = siblings.findIndex(s => s.path === node.path);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const sibling = siblings[swapIdx];
    if (node.type === 'section') moveSectionPosition(node, swapIdx + 1);
    else await movePagePosition(node, swapIdx + 1);
    if (sibling.type === 'section') moveSectionPosition(sibling, idx + 1);
    else await movePagePosition(sibling, idx + 1);
  }

  function deleteNode(node) {
    if (!window.confirm(`Delete "${node.label}"? This cannot be undone until the PR is cancelled.`)) return;
    del(node.path);
    if (rightPanel?.path === node.path) setRightPanel(null);
  }

  /* ── Submit ─────────────────────────────────────────────────────────── */

  async function handleSubmit() {
    if (!auth?.token) { setSubmitError('Connect your GitHub account first.'); return; }
    const changeList = Object.entries(changes).map(([path, c]) => ({ path, ...c }));
    if (changeList.length === 0) { setSubmitError('No changes to submit.'); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const pr = await createStructurePR({
        token: auth.token,
        changes: changeList,
        prTitle: `Contribute: playbook edits (${changeList.length} file${changeList.length > 1 ? 's' : ''})`,
        prBody: [
          `Community-suggested playbook changes by @${auth.username}.`,
          '',
          '**Files changed:**',
          changeList.map(c => `- \`${c.op === 'delete' ? '–' : '+'} ${c.path}\``).join('\n'),
          '',
          '_Submitted via the Contribute editor._',
        ].join('\n'),
      });
      setSuccess(pr);
      // Clear persisted changes after successful PR
      setChanges({});
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const pendingList = Object.entries(changes).map(([path, c]) => ({ path, ...c }));

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <div
      className={styles.overlay}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`${styles.modal}${fullscreen ? ` ${styles.modalFullscreen}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Contribute to the Playbook"
        style={fullscreen ? undefined : {
          width: modalSize.width,
          height: modalSize.height,
          ...(modalPos ? { position: 'absolute', left: modalPos.x, top: modalPos.y } : {}),
        }}
      >
        {/* Header — drag to reposition */}
        <div className={styles.modalHeader} onMouseDown={handleHeaderMouseDown}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>✦</span>
            <h2 className={styles.modalTitle}>Contribute to the Playbook</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className={styles.modalBody} style={{ position: 'relative' }}>
          {success ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successText}>Pull request created!</p>
              <a href={success.url} target="_blank" rel="noreferrer noopener" className={styles.prLink}>
                View PR #{success.number} on GitHub →
              </a>
              <p className={styles.successNote}>A maintainer will review and merge your changes. Thank you!</p>
              <button className={styles.closeSuccessBtn} onClick={onClose}>Close</button>
            </div>
          ) : (
            <div
              className={styles.editorLayout}
              style={{ gridTemplateColumns: leftHidden ? `32px 0px 1fr` : `${leftWidth}px 4px 1fr` }}
            >

              {/* ── Left panel ── */}
              <div className={`${styles.leftPanel}${leftHidden ? ` ${styles.leftPanelHidden}` : ''}`}>
                {leftHidden ? (
                  <button
                    className={styles.panelExpandTab}
                    onClick={() => setLeftHidden(false)}
                    title="Show structure panel"
                    type="button"
                  >
                    <span>❯</span>
                    <span className={styles.panelExpandLabel}>Structure</span>
                  </button>
                ) : (
                <div className={styles.treePanelHeader}>
                  <span className={styles.treePanelTitle}>Playbook pages</span>
                  <div className={styles.treePanelHeaderActions}>
                    <button
                      className={styles.addSectionBtn}
                      onClick={() => setActiveForm('root:add-section')}
                      disabled={!auth}
                      title={!auth ? 'Sign in with GitHub to make changes' : undefined}
                      type="button"
                    >
                      + Section
                    </button>
                    <button
                      className={styles.uploadBtn}
                      disabled={!auth}
                      title={!auth ? 'Sign in with GitHub to upload a document' : 'Upload document'}
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                    >
                      📤
                    </button>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept=".md,.mdx,.txt,.html,.htm,.docx,.pdf"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleUploadFile}
                    />
                    <button
                      className={styles.hideStructureBtn}
                      onClick={() => setLeftHidden(true)}
                      title="Hide structure panel"
                      type="button"
                    >
                      ❮
                    </button>
                  </div>
                </div>
                )}

                {!leftHidden && loading ? (
                  <div className={styles.stateBox}>Loading tree from GitHub…</div>
                ) : error ? (
                  <div className={styles.errorBox}>
                    {error}
                    {error.includes('rate limit') && !auth && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.85 }}>
                        Sign in with GitHub below to load the tree using your authenticated quota.
                      </p>
                    )}
                    {error.includes('rate limit') && auth && (
                      <button
                        type="button"
                        style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
                        onClick={() => loadTree(auth.token)}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.treeScroll}>
                    {tree.map(node => (
                      <TreeRow
                        key={node.path}
                        node={node}
                        depth={0}
                        siblings={tree}
                        expanded={expanded}
                        onToggle={path => setExpanded(prev => {
                          const n = new Set(prev);
                          n.has(path) ? n.delete(path) : n.add(path);
                          return n;
                        })}
                        activeForm={activeForm}
                        onSetActiveForm={setActiveForm}
                        onAddPage={addPage}
                        onAddSection={addSection}
                        onAddSubPage={addSubPage}
                        onRename={renameNode}
                        onMoveUp={n => moveNode(n, 'up')}
                        onMoveDown={n => moveNode(n, 'down')}
                        onDelete={deleteNode}
                        onEditPage={handleEditPage}
                        onEditSection={handleEditSection}
                        editingPath={rightPanel?.path}
                        loadingPaths={loadingPaths}
                        locked={!auth}
                      />
                    ))}

                    {activeForm === 'root:add-section' && (
                      <div style={{ paddingLeft: 8, paddingTop: 4 }}>
                        <InlineForm
                          placeholder="Section title, e.g. Evaluation Methods"
                          onConfirm={label => { addSection(label); setActiveForm(null); }}
                          onCancel={() => setActiveForm(null)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Footer: pending + auth + submit — hidden when panel is collapsed */}
                {!leftHidden && <div className={styles.leftPanelFooter}>
                  {pendingList.length > 0 && (
                    <div className={styles.pendingSection}>
                      <div className={styles.pendingSectionTitle}>
                        <span>
                          Pending changes
                          <span className={styles.changeCount}>{pendingList.length}</span>
                        </span>
                        <button
                          className={styles.clearAllBtn}
                          onClick={clearAllChanges}
                          type="button"
                          title="Discard all changes"
                        >
                          Clear all
                        </button>
                      </div>
                      <ul className={styles.changeList}>
                        {pendingList.map(c => (
                          <li key={c.path} className={styles.changeItem}>
                            <span className={`${styles.changeOp} ${c.op === 'delete' ? styles.opDelete : styles.opUpsert}`}>
                              {c.op === 'delete' ? '–' : '+'}
                            </span>
                            <span className={styles.changePath} title={c.path}>
                              {c.path.replace('docs/', '')}
                            </span>
                            <button
                              className={styles.undoBtn}
                              onClick={() => undoChange(c.path)}
                              title="Undo"
                              type="button"
                            >
                              ↩
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <AuthPanel
                    auth={auth}
                    clientId={oauthClientId}
                    proxyUrl={oauthProxyUrl}
                    callbackUrl={oauthCallbackUrl}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />

                  {submitError && <div className={styles.errorBox}>{submitError}</div>}

                  <div className={styles.submitRow}>
                    <button className={styles.cancelBtn} onClick={onClose} type="button">Close</button>
                    <button
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                      disabled={submitting || pendingList.length === 0 || !auth}
                      title={!auth ? 'Connect GitHub first' : pendingList.length === 0 ? 'No changes to submit' : ''}
                      type="button"
                    >
                      {submitting ? 'Creating PR…' : `Submit${pendingList.length > 0 ? ` (${pendingList.length})` : ''} as PR`}
                    </button>
                  </div>
                </div>}
              </div>

              {/* ── Panel splitter ── */}
              <div
                className={styles.splitter}
                onMouseDown={handleSplitterMouseDown}
                title="Drag to resize panels"
              />

              {/* ── Right panel: content editor ── */}
              <div className={styles.rightPanel}>
                {rightPanel ? (
                  rightPanel.fetching ? (
                    <div className={styles.rightPanelPlaceholder}>
                      <span className={styles.rightPanelPlaceholderIcon}>⋯</span>
                      <p>Loading page content…</p>
                    </div>
                  ) : (
                    <>
                      {/* ── Tab bar ── */}
                      <div className={styles.rightPanelHeader}>
                        <div className={styles.rightPanelTabs}>
                          <button
                            className={`${styles.rightPanelTab} ${rightPanelTab === 'edit' ? styles.rightPanelTabActive : ''}`}
                            onClick={() => setRightPanelTab('edit')}
                            type="button"
                          >
                            ✎ Edit
                          </button>
                          <button
                            className={`${styles.rightPanelTab} ${rightPanelTab === 'translate' ? styles.rightPanelTabActive : ''}`}
                            onClick={() => setRightPanelTab('translate')}
                            disabled={!auth}
                            title={!auth ? 'Sign in with GitHub to contribute translations' : undefined}
                            type="button"
                          >
                            🌍 Translation
                          </button>
                        </div>
                        <div className={styles.rightPanelActions}>
                          {rightPanelTab === 'edit' ? (
                            <button
                              className={styles.rightPanelSaveBtn}
                              type="button"
                              onClick={saveRightPanel}
                              disabled={!auth}
                              title={!auth ? 'Sign in with GitHub to save changes' : undefined}
                            >
                              ✓ Save to changes
                            </button>
                          ) : (
                            <button
                              className={styles.rightPanelSaveBtn}
                              type="button"
                              onClick={saveTranslation}
                              disabled={!auth || !translationHtml.trim()}
                              title={!auth ? 'Sign in with GitHub to save' : !translationHtml.trim() ? 'Add a translation first' : undefined}
                            >
                              ✓ Save translation
                            </button>
                          )}
                          <button
                            className={styles.rightPanelCloseBtn}
                            type="button"
                            onClick={() => setRightPanel(null)}
                            title="Close editor"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* ── Edit tab ── */}
                      {rightPanelTab === 'edit' && (
                        <div className={styles.rightPanelBody} style={{ position: 'relative' }}>
                          <WysiwygEditor
                            key={rightPanel.path}
                            initialHtml={rightPanel.htmlContent}
                            onChange={html => setRightPanel(prev => ({ ...prev, htmlContent: html, dirty: true }))}
                          />
                          {!auth && (
                            <div className={styles.editorLockOverlay}>
                              <span className={styles.editorLockMsg}>
                                🔒 Sign in with GitHub to edit pages
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Translation tab — side-by-side ── */}
                      {rightPanelTab === 'translate' && (
                        <div className={styles.translatePanel}>
                          {/* Toolbar */}
                          <div className={styles.translateToolbar}>
                            <label className={styles.translateLangLabel}>Target language</label>
                            <select
                              className={styles.translateLangSelect}
                              value={translationLang}
                              onChange={e => { setTranslationLang(e.target.value); setTranslationHtml(''); setTranslateError(''); }}
                            >
                              <option value="fr">French</option>
                              <option value="ar">Arabic</option>
                              <option value="pt">Portuguese</option>
                              <option value="ha">Hausa</option>
                              <option value="sw">Swahili</option>
                              <option value="am">Amharic</option>
                              <option value="yo">Yoruba</option>
                              <option value="ig">Igbo</option>
                              <option value="zu">Zulu</option>
                              <option value="om">Oromo</option>
                              <option value="so">Somali</option>
                              <option value="rw">Kinyarwanda</option>
                            </select>
                            {translationProxy && (
                              <button
                                className={styles.translateAutoBtn}
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={translating || !SUPPORTED_AUTO_TRANSLATE.has(translationLang)}
                                title="Generate a draft translation (Helsinki-NLP for European languages, MyMemory for African languages)"
                              >
                                {translating ? '⏳ Translating…' : '✨ Auto-translate'}
                              </button>
                            )}
                            <button
                              className={styles.translateOpenBtn}
                              type="button"
                              onClick={openGoogleTranslate}
                              title="Opens the English content in Google Translate — copy the result and paste on the right"
                            >
                              Google Translate ↗
                            </button>
                          </div>
                          {translateError && (
                            <div className={styles.translateError}>
                              {translateError}
                            </div>
                          )}

                          {/* Side-by-side panes */}
                          <div
                            className={styles.translateSplitView}
                            style={{ gridTemplateColumns: translateSplitWidth ? `${translateSplitWidth}px 4px 1fr` : '1fr 4px 1fr' }}
                          >
                            {/* Left: original read-only */}
                            <div className={styles.translateSide}>
                              <div className={styles.translateSideHeader}>English (original)</div>
                              <div
                                className={styles.translateOriginalContent}
                                dangerouslySetInnerHTML={{ __html: rightPanel.htmlContent }}
                              />
                            </div>

                            <div
                              className={styles.splitter}
                              onMouseDown={handleTranslateSplitterMouseDown}
                              title="Drag to resize"
                            />

                            {/* Right: translation editor */}
                            <div className={styles.translateSide}>
                              <div className={styles.translateSideHeader}>
                                Translation
                              </div>
                              <div className={styles.translateEditorBody}>
                                <WysiwygEditor
                                  key={`${rightPanel.path}-${translationLang}-${translateKey}`}
                                  initialHtml={translationHtml}
                                  onChange={html => setTranslationHtml(html)}
                                />
                                {!auth && (
                                  <div className={styles.editorLockOverlay}>
                                    <span className={styles.editorLockMsg}>
                                      🔒 Sign in with GitHub to save translations
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className={styles.rightPanelPlaceholder}>
                    <span className={styles.rightPanelPlaceholderIcon}>📄</span>
                    <p>Click <strong>✎</strong> next to any page to edit its content here.</p>
                    <p className={styles.rightPanelPlaceholderHint}>
                      Changes are saved locally — close and reopen this dialog anytime without losing your work.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer bar */}
        <div className={styles.modalFooterBar}>
          <button
            type="button"
            className={styles.fullscreenBtn}
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {fullscreen ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
            )}
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        </div>

        {/* Upload preview overlay */}
        {uploadPreview && (
          <div className={styles.uploadOverlay}>
            <div className={styles.uploadPreviewPanel}>
              <div className={styles.uploadPreviewHeader}>
                <span className={styles.uploadPreviewFileName}>{uploadPreview.fileName}</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setUploadPreview(null)}
                  aria-label="Close preview"
                  type="button"
                >✕</button>
              </div>
              <div className={styles.uploadPreviewBody}>
                <div className={styles.uploadTitleRow}>
                  <label className={styles.uploadTitleLabel}>Page title</label>
                  <input
                    className={styles.uploadTitleInput}
                    value={uploadPreview.title}
                    onChange={e => {
                      const newTitle = e.target.value;
                      setUploadPreview(prev => ({
                        ...prev,
                        title: newTitle,
                        markdown: prev.titleFromH1
                          ? prev.markdown.replace(/^#\s+.+$/m, `# ${newTitle}`)
                          : prev.markdown,
                      }));
                    }}
                  />
                </div>
                <div
                  className={styles.uploadPreviewContent}
                  dangerouslySetInnerHTML={{ __html: mdToHtml(uploadPreview.markdown) }}
                />
              </div>
              <div className={styles.uploadPreviewFooter}>
                <div className={styles.uploadPlacement}>
                  <span className={styles.uploadTitleLabel}>Place as</span>
                  <div className={styles.uploadRadioGroup}>
                    {[
                      { value: 'page',       label: 'New page in section' },
                      { value: 'section',    label: 'New top-level section' },
                      { value: 'subsection', label: 'Sub-section under section' },
                    ].map(({ value, label }) => (
                      <label key={value} className={styles.uploadRadioLabel}>
                        <input
                          type="radio"
                          name="uploadPlacement"
                          value={value}
                          checked={uploadPlacement === value}
                          onChange={() => setUploadPlacement(value)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  {(uploadPlacement === 'page' || uploadPlacement === 'subsection') && (
                    <div className={styles.uploadSectionPicker}>
                      <label className={styles.uploadTitleLabel}>
                        {uploadPlacement === 'page' ? 'Section' : 'Parent section'}
                      </label>
                      <select
                        className={styles.uploadSectionSelect}
                        value={uploadTargetSection}
                        onChange={e => setUploadTargetSection(e.target.value)}
                      >
                        {flatSections(tree).map(n => (
                          <option key={n.path} value={n.path}>{n.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(uploadPlacement === 'section' || uploadPlacement === 'subsection') && (
                    <div className={styles.uploadSectionPicker}>
                      <label className={styles.uploadTitleLabel}>Section name</label>
                      <input
                        className={styles.uploadTitleInput}
                        placeholder={uploadPreview?.title}
                        value={uploadSectionName}
                        onChange={e => setUploadSectionName(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.uploadPreviewActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setUploadPreview(null)}
                    type="button"
                  >Cancel</button>
                  <button
                    className={styles.submitBtn}
                    onClick={handleConfirmUpload}
                    disabled={
                      (uploadPlacement === 'page' || uploadPlacement === 'subsection') && !uploadTargetSection
                    }
                    type="button"
                  >Add to Playbook →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch upload overlay */}
        {uploadBatch && (
          <div className={styles.uploadOverlay}>
            <div className={styles.uploadPreviewPanel}>
              <div className={styles.uploadPreviewHeader}>
                <span className={styles.uploadPreviewFileName}>
                  Upload {uploadBatch.length} documents
                </span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setUploadBatch(null)}
                  aria-label="Close"
                  type="button"
                >✕</button>
              </div>
              <div className={styles.uploadPreviewBody}>
                <div className={styles.batchList}>
                  {uploadBatch.map((item, idx) => (
                    <div key={idx} className={styles.batchItem}>
                      <span className={styles.batchItemName}>{item.fileName}</span>
                      <input
                        className={styles.uploadTitleInput}
                        value={item.title}
                        onChange={e => {
                          const newTitle = e.target.value;
                          setUploadBatch(prev => prev.map((it, i) => i !== idx ? it : {
                            ...it,
                            title: newTitle,
                            markdown: it.titleFromH1
                              ? it.markdown.replace(/^#\s+.+$/m, `# ${newTitle}`)
                              : it.markdown,
                          }));
                        }}
                      />
                      <button
                        className={styles.batchRemoveBtn}
                        type="button"
                        title="Remove from batch"
                        onClick={() => setUploadBatch(prev => prev.filter((_, i) => i !== idx))}
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.uploadPreviewFooter}>
                <div className={styles.uploadPlacement}>
                  <span className={styles.uploadTitleLabel}>Place as</span>
                  <div className={styles.uploadRadioGroup}>
                    {[
                      { value: 'page',       label: 'Pages in existing section' },
                      { value: 'section',    label: 'New top-level section' },
                      { value: 'subsection', label: 'Sub-section under section' },
                    ].map(({ value, label }) => (
                      <label key={value} className={styles.uploadRadioLabel}>
                        <input
                          type="radio"
                          name="batchPlacement"
                          value={value}
                          checked={uploadPlacement === value}
                          onChange={() => setUploadPlacement(value)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  {(uploadPlacement === 'page' || uploadPlacement === 'subsection') && (
                    <div className={styles.uploadSectionPicker}>
                      <label className={styles.uploadTitleLabel}>
                        {uploadPlacement === 'page' ? 'Section' : 'Parent section'}
                      </label>
                      <select
                        className={styles.uploadSectionSelect}
                        value={uploadTargetSection}
                        onChange={e => setUploadTargetSection(e.target.value)}
                      >
                        {flatSections(tree).map(n => (
                          <option key={n.path} value={n.path}>{n.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {(uploadPlacement === 'section' || uploadPlacement === 'subsection') && (
                    <div className={styles.uploadSectionPicker}>
                      <label className={styles.uploadTitleLabel}>Section name</label>
                      <input
                        className={styles.uploadTitleInput}
                        placeholder={uploadBatch[0]?.title}
                        value={uploadSectionName}
                        onChange={e => setUploadSectionName(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.uploadPreviewActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setUploadBatch(null)}
                    type="button"
                  >Cancel</button>
                  <button
                    className={styles.submitBtn}
                    onClick={handleConfirmBatch}
                    disabled={
                      uploadBatch.length === 0 ||
                      ((uploadPlacement === 'page' || uploadPlacement === 'subsection') && !uploadTargetSection)
                    }
                    type="button"
                  >Add {uploadBatch.length} pages →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resize handle — hidden in fullscreen */}
        {!fullscreen && (
          <div
            className={styles.resizeHandle}
            onMouseDown={handleDialogResizeMouseDown}
            title="Drag to resize"
          />
        )}
      </div>
    </div>
  );
}

export default function StructureEditor({ className, label }) {
  const [open, setOpen] = useState(false);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <button
        type="button"
        className={className || styles.openBtn}
        onClick={() => setOpen(true)}
        title={label || 'Edit playbook structure'}
        aria-label={label || 'Edit playbook structure'}
      >
        <span className={styles.openBtnIcon}>🌳</span>
        {label && <span>{label}</span>}
      </button>
      {open && ReactDOM.createPortal(
        <StructureEditorContent onClose={() => setOpen(false)} />,
        document.body,
      )}
    </>
  );
}
