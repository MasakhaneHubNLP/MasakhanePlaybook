import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { fetchDocsTree, computeDocsTree, createStructurePR, fetchRawFile } from '@site/src/utils/github';
import { WysiwygEditor, mdToHtml, htmlToMd } from '@site/src/components/EditModal';
import styles from './index.module.css';

function splitFrontmatter(md) {
  const m = String(md).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { frontmatter: `---\n${m[1]}\n---\n`, content: m[2] } : { frontmatter: '', content: md };
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

function titleCase(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
        {/* Expand toggle for sections */}
        {node.type === 'section' ? (
          <button className={styles.expandBtn} onClick={() => onToggle(node.path)} type="button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className={styles.expandSpacer} />
        )}

        {/* Icon + label */}
        <span className={styles.nodeIcon}>{node.type === 'section' ? '📁' : '📄'}</span>
        <span
          className={`${styles.nodeLabel} ${node.type === 'page' ? styles.nodeLabelClickable : ''}`}
          title={node.path}
          onClick={node.type === 'page' ? () => onEditPage(node) : undefined}
        >
          {node.label}
        </span>

        {isLoading && <span className={styles.loadingDot} title="Loading…">⋯</span>}

        {/* Action buttons */}
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
              title="Add a sub-page (converts this page into a section)"
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

      {/* Inline forms */}
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

      {/* Recurse into children */}
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
  const buildToken = siteConfig.customFields?.GITHUB_EDIT_TOKEN || '';

  const [gitFiles, setGitFiles] = useState([]);
  const [catData, setCatData] = useState({});
  const [changes, setChanges] = useState({});
  const [pageCache, setPageCache] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingPaths, setLoadingPaths] = useState(new Set());

  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const [expanded, setExpanded] = useState(new Set());
  const [activeForm, setActiveForm] = useState(null);

  // Right panel: null | { path, htmlContent, frontmatter, fetching, dirty }
  const [rightPanel, setRightPanel] = useState(null);

  const tree = useMemo(() => computeDocsTree(gitFiles, catData, changes), [gitFiles, catData, changes]);

  useEffect(() => {
    const stored = sessionStorage.getItem('gh_edit_token');
    setToken(stored || buildToken);
  }, [buildToken]);

  useEffect(() => {
    const stored = sessionStorage.getItem('gh_edit_token');
    const tok = stored || buildToken;
    fetchDocsTree(tok || null)
      .then(({ files, cats }) => {
        setGitFiles(files);
        setCatData(cats);
        const topKeys = Object.keys(cats).filter(p => p.match(/^docs\/[^/]+\/_category_\.json$/));
        setExpanded(new Set(topKeys.map(p => p.replace('/_category_.json', ''))));
      })
      .catch(e => setError(`Failed to load playbook tree: ${e.message}`))
      .finally(() => setLoading(false));
  }, [buildToken]);

  function handleTokenChange(val) {
    setToken(val);
    if (val) sessionStorage.setItem('gh_edit_token', val);
    else sessionStorage.removeItem('gh_edit_token');
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
    // Auto-open the new page in the right panel
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
    const posA = idx + 1;
    const posB = swapIdx + 1;

    if (node.type === 'section') moveSectionPosition(node, posB);
    else await movePagePosition(node, posB);

    if (sibling.type === 'section') moveSectionPosition(sibling, posA);
    else await movePagePosition(sibling, posA);
  }

  function deleteNode(node) {
    if (!window.confirm(`Delete "${node.label}"? This cannot be undone until the PR is cancelled.`)) return;
    del(node.path);
    if (rightPanel?.path === node.path) setRightPanel(null);
  }

  /* ── Submit ─────────────────────────────────────────────────────────── */

  async function handleSubmit() {
    if (!token.trim()) { setSubmitError('A GitHub personal access token is required.'); return; }
    const changeList = Object.entries(changes).map(([path, c]) => ({ path, ...c }));
    if (changeList.length === 0) { setSubmitError('No changes to submit.'); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const pr = await createStructurePR({
        token,
        changes: changeList,
        prTitle: `Contribute: playbook edits (${changeList.length} file${changeList.length > 1 ? 's' : ''})`,
        prBody: [
          'Community-suggested playbook changes.',
          '',
          '**Files changed:**',
          changeList.map(c => `- \`${c.op === 'delete' ? '–' : '+'} ${c.path}\``).join('\n'),
          '',
          '_Submitted via the Contribute editor._',
        ].join('\n'),
      });
      setSuccess(pr);
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
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Contribute to the Playbook">
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>✦</span>
            <h2 className={styles.modalTitle}>Contribute to the Playbook</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
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
            <div className={styles.editorLayout}>

              {/* ── Left panel: tree + controls ── */}
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

                {/* Footer: pending changes + token + submit */}
                <div className={styles.leftPanelFooter}>
                  {pendingList.length > 0 && (
                    <div className={styles.pendingSection}>
                      <div className={styles.pendingSectionTitle}>
                        Pending changes
                        <span className={styles.changeCount}>{pendingList.length}</span>
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
                              title="Undo this change"
                              type="button"
                            >
                              ↩
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.tokenSection}>
                    <div className={styles.tokenRow}>
                      <label htmlFor="se-token" className={styles.tokenLabel}>GitHub Token</label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook+Edit"
                        target="_blank"
                        rel="noreferrer noopener"
                        className={styles.tokenCreateLink}
                      >
                        Create →
                      </a>
                    </div>
                    <input
                      id="se-token"
                      type="password"
                      className={styles.tokenInput}
                      value={token}
                      onChange={e => handleTokenChange(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      autoComplete="off"
                    />
                    <p className={styles.tokenHint}>Needs <code>public_repo</code> scope.</p>
                  </div>

                  {submitError && <div className={styles.errorBox}>{submitError}</div>}

                  <div className={styles.submitRow}>
                    <button className={styles.cancelBtn} onClick={onClose} type="button">Cancel</button>
                    <button
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                      disabled={submitting || pendingList.length === 0}
                      type="button"
                    >
                      {submitting ? 'Creating PR…' : `Submit${pendingList.length > 0 ? ` (${pendingList.length})` : ''} as PR`}
                    </button>
                  </div>
                </div>
              </div>

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
                    <p>Click <strong>✎</strong> next to any page in the tree to edit its content here.</p>
                    <p className={styles.rightPanelPlaceholderHint}>Use the tree on the left to add sections, rename pages, and reorder items.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
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
