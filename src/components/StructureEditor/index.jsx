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
import { WysiwygEditor, mdToHtml, htmlToMd } from '@site/src/components/EditModal';
import styles from './index.module.css';

const AUTH_KEY = 'masakhane_pb_auth';
const CHANGES_KEY = 'masakhane_pb_changes';

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
  // phases: 'idle' | 'device-pending' | 'loading' | 'waiting'
  const [phase, setPhase] = useState('idle');
  const [deviceInfo, setDeviceInfo] = useState(null); // { user_code, verification_uri }
  const [error, setError]   = useState('');
  const [draft, setDraft]   = useState('');
  const abortRef = useRef(null);

  const configured = !!(clientId && proxyUrl);

  // ── Device Flow ───────────────────────────────────────────────────────
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

  // ── Fallback (no config): open token page then paste ─────────────────
  function handleFallbackSignIn() {
    window.open(
      'https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook+Contribute',
      '_blank', 'noopener,noreferrer',
    );
    setPhase('waiting');
  }

  async function handlePaste() {
    if (!draft.trim()) return;
    setPhase('loading');
    setError('');
    try {
      await onConnect(draft.trim());
    } catch (e) {
      setError(e.message || 'Invalid token or missing public_repo permission.');
      setPhase('waiting');
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

  // ── Device flow pending: show the code ────────────────────────────────
  if (phase === 'device-pending' && deviceInfo) {
    return (
      <div className={styles.authDeviceBox}>
        <p className={styles.authDevicePrompt}>
          GitHub opened — enter this code to authorize:
        </p>
        <div className={styles.authDeviceCode}>{deviceInfo.user_code}</div>
        <p className={styles.authDeviceHint}>Waiting for you to authorize on GitHub…</p>
        <button className={styles.authCancelSmall} onClick={cancelDevice} type="button">Cancel</button>
      </div>
    );
  }

  // ── Paste panel (fallback, after GitHub tab was opened) ───────────────
  if (phase === 'waiting') {
    return (
      <div className={styles.authWaiting}>
        <p className={styles.authWaitingMsg}>Copy the generated token from the GitHub tab:</p>
        <div className={styles.authPatRow}>
          <input
            type="password"
            className={styles.authTokenInput}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePaste()}
            placeholder="ghp_xxxxxxxxxxxx"
            autoComplete="off"
            autoFocus
          />
          <button className={styles.authConnectBtn} onClick={handlePaste} disabled={!draft.trim()} type="button">
            Connect
          </button>
        </div>
        <button className={styles.authCancelSmall} onClick={() => { setPhase('idle'); setDraft(''); setError(''); }} type="button">
          ← Back
        </button>
        {error && <p className={styles.authError}>{error}</p>}
      </div>
    );
  }

  // ── Default: sign-in button ───────────────────────────────────────────
  return (
    <div className={styles.authBlock}>
      <button
        className={styles.authGitHubBtn}
        onClick={configured ? handleDeviceFlow : handleFallbackSignIn}
        disabled={phase === 'loading'}
        type="button"
      >
        {GH_MARK}
        {phase === 'loading' ? 'Connecting…' : 'Sign in with GitHub'}
      </button>
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
  editingPath,
  loadingPaths,
}) {
  const idx = siblings.indexOf(node);
  const canUp = idx > 0;
  const canDown = idx < siblings.length - 1;
  const isExpanded = expanded.has(node.path);
  const isLoading = loadingPaths.has(node.path);
  const formKey = `${node.path}:`;
  const isEditing = editingPath === node.path;

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
          className={`${styles.nodeLabel} ${node.type === 'page' ? styles.nodeLabelClickable : ''}`}
          title={node.path}
          onClick={node.type === 'page' ? () => onEditPage(node) : undefined}
        >
          {node.label}
        </span>

        {isLoading && <span className={styles.loadingDot} title="Loading…">⋯</span>}

        <div className={styles.nodeActions}>
          {node.type === 'page' && (
            <button
              className={`${styles.actionBtn} ${styles.editPageBtn}`}
              title="Edit page content"
              onClick={() => onEditPage(node)}
              type="button"
            >
              ✎
            </button>
          )}
          {node.type === 'section' && (
            <button
              className={styles.actionBtn}
              title="Add page inside this section"
              onClick={() => onSetActiveForm(`${formKey}add-page`)}
              type="button"
            >
              + Page
            </button>
          )}
          {node.type === 'page' && (
            <button
              className={styles.actionBtn}
              title="Add a sub-page"
              onClick={() => onSetActiveForm(`${formKey}add-subpage`)}
              type="button"
            >
              + Sub
            </button>
          )}
          <button
            className={styles.actionBtn}
            title="Rename"
            onClick={() => onSetActiveForm(`${formKey}rename`)}
            type="button"
          >
            ✏
          </button>
          <button className={`${styles.actionBtn} ${styles.arrowBtn}`} title="Move up" onClick={() => onMoveUp(node)} disabled={!canUp} type="button">↑</button>
          <button className={`${styles.actionBtn} ${styles.arrowBtn}`} title="Move down" onClick={() => onMoveDown(node)} disabled={!canDown} type="button">↓</button>
          {node.type === 'page' && (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              title="Delete page"
              onClick={() => onDelete(node)}
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
          editingPath={editingPath}
          loadingPaths={loadingPaths}
        />
      ))}
    </>
  );
}

/* ── Modal content ───────────────────────────────────────────────────── */

export function StructureEditorContent({ onClose }) {
  const { siteConfig } = useDocusaurusContext();
  const buildToken   = siteConfig.customFields?.GITHUB_EDIT_TOKEN || '';
  const oauthClientId = siteConfig.customFields?.GITHUB_OAUTH_CLIENT_ID || '';
  const oauthProxyUrl = siteConfig.customFields?.GITHUB_OAUTH_PROXY_URL || '';
  const oauthCallbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${siteConfig.baseUrl}oauth-callback`
    : '';

  // Auth: persisted in localStorage
  const [auth, setAuth] = useState(null); // { token, username, avatarUrl, name }

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
  const [leftWidth, setLeftWidth] = useState(320);
  const [fullscreen, setFullscreen] = useState(false);

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

  /* ── Bootstrap: load auth + changes from localStorage ── */

  useEffect(() => {
    // Load saved pending changes
    try {
      const raw = localStorage.getItem(CHANGES_KEY);
      if (raw) setChanges(JSON.parse(raw));
    } catch {}

    // Load saved auth from localStorage
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) { setAuth(JSON.parse(raw)); return; }
    } catch {}

    // Auto-login with the build token (maintainer mode) when no user session exists
    if (buildToken) {
      verifyGitHubToken(buildToken)
        .then(info => setAuth({ token: buildToken, ...info }))
        .catch(() => {});
    }
  }, []);

  // Persist changes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(changes).length === 0) {
      localStorage.removeItem(CHANGES_KEY);
    } else {
      localStorage.setItem(CHANGES_KEY, JSON.stringify(changes));
    }
  }, [changes]);

  // Fetch tree (public, no token needed for read)
  useEffect(() => {
    fetchDocsTree(null)
      .then(({ files, cats }) => {
        setGitFiles(files);
        setCatData(cats);
        const topKeys = Object.keys(cats).filter(p => p.match(/^docs\/[^/]+\/_category_\.json$/));
        setExpanded(new Set(topKeys.map(p => p.replace('/_category_.json', ''))));
      })
      .catch(e => setError(`Failed to load playbook tree: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

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

  async function handleEditPage(node) {
    if (rightPanel?.path === node.path && !rightPanel.fetching) return;
    setRightPanel({ path: node.path, htmlContent: null, frontmatter: '', fetching: true, dirty: false });
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
        style={fullscreen ? undefined : { width: modalSize.width, height: modalSize.height }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
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
            <div className={styles.editorLayout} style={{ gridTemplateColumns: `${leftWidth}px 4px 1fr` }}>

              {/* ── Left panel ── */}
              <div className={styles.leftPanel}>
                <div className={styles.treePanelHeader}>
                  <span className={styles.treePanelTitle}>Playbook pages</span>
                  <button
                    className={styles.addSectionBtn}
                    onClick={() => setActiveForm('root:add-section')}
                    type="button"
                  >
                    + Section
                  </button>
                </div>

                {loading ? (
                  <div className={styles.stateBox}>Loading tree from GitHub…</div>
                ) : error ? (
                  <div className={styles.errorBox}>{error}</div>
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
                        editingPath={rightPanel?.path}
                        loadingPaths={loadingPaths}
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

                {/* Footer: pending + auth + submit */}
                <div className={styles.leftPanelFooter}>
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
                </div>
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
                      <div className={styles.rightPanelHeader}>
                        <span className={styles.rightPanelPath} title={rightPanel.path}>
                          ✎ {rightPanel.path.replace(/^docs\//, '')}
                        </span>
                        <div className={styles.rightPanelActions}>
                          <button
                            className={styles.rightPanelSaveBtn}
                            type="button"
                            onClick={saveRightPanel}
                          >
                            ✓ Save to changes
                          </button>
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
                      <div className={styles.rightPanelBody}>
                        <WysiwygEditor
                          key={rightPanel.path}
                          initialHtml={rightPanel.htmlContent}
                          onChange={html => setRightPanel(prev => ({ ...prev, htmlContent: html, dirty: true }))}
                        />
                      </div>
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
