import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { fetchRawFile, createEditPR } from '@site/src/utils/github';
import styles from './index.module.css';

/* ── Markdown ↔ HTML helpers ─────────────────────────────────────────── */

function splitFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m
    ? { frontmatter: `---\n${m[1]}\n---\n`, content: m[2] }
    : { frontmatter: '', content: md };
}

function inlineMd(text) {
  return text
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i++]);
      }
      out.push(`<pre><code>${codeLines.join('\n')}</code></pre>`);
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const lvl = heading[1].length;
      out.push(`<h${lvl}>${inlineMd(heading[2])}</h${lvl}>`);
      i++;
      continue;
    }

    if (line.match(/^[-*+]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*+]\s/)) {
        items.push(`<li>${inlineMd(lines[i].replace(/^[-*+]\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(`<li>${inlineMd(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (line.match(/^>+\s/)) {
      const bqLines = [];
      while (i < lines.length && lines[i].match(/^>+\s?/)) {
        bqLines.push(inlineMd(lines[i].replace(/^>+\s?/, '')));
        i++;
      }
      out.push(`<blockquote><p>${bqLines.join('<br>')}</p></blockquote>`);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].match(/^[-*+]\s/) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].match(/^>/) &&
      !lines[i].startsWith('```')
    ) {
      paraLines.push(inlineMd(lines[i]));
      i++;
    }
    if (paraLines.length > 0) {
      out.push(`<p>${paraLines.join('<br>')}</p>`);
    }
  }
  return out.join('\n');
}

function nodeToMd(node) {
  let out = '';
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      out += child.textContent;
      continue;
    }
    if (child.nodeType !== 1) continue;
    const tag = child.tagName.toLowerCase();
    const inner = nodeToMd(child);
    switch (tag) {
      case 'h1': out += `\n\n# ${inner.trim()}\n\n`; break;
      case 'h2': out += `\n\n## ${inner.trim()}\n\n`; break;
      case 'h3': out += `\n\n### ${inner.trim()}\n\n`; break;
      case 'h4': out += `\n\n#### ${inner.trim()}\n\n`; break;
      case 'h5': out += `\n\n##### ${inner.trim()}\n\n`; break;
      case 'h6': out += `\n\n###### ${inner.trim()}\n\n`; break;
      case 'strong': case 'b': out += `**${inner}**`; break;
      case 'em': case 'i': out += `*${inner}*`; break;
      case 'u': out += `__${inner}__`; break;
      case 's': case 'del': case 'strike': out += `~~${inner}~~`; break;
      case 'code':
        if (child.parentElement?.tagName.toLowerCase() === 'pre') out += inner;
        else out += `\`${inner}\``;
        break;
      case 'pre': out += `\n\n\`\`\`\n${inner}\n\`\`\`\n\n`; break;
      case 'a': out += `[${inner}](${child.getAttribute('href') || ''})`; break;
      case 'img': out += `![${child.getAttribute('alt') || ''}](${child.getAttribute('src') || ''})`; break;
      case 'p': out += `\n\n${inner}\n\n`; break;
      case 'br': out += '\n'; break;
      case 'blockquote': out += `\n\n> ${inner.trim().replace(/\n/g, '\n> ')}\n\n`; break;
      case 'ul': {
        for (const li of child.querySelectorAll(':scope > li')) {
          out += `\n- ${nodeToMd(li).trim()}`;
        }
        out += '\n';
        break;
      }
      case 'ol': {
        let idx = 1;
        for (const li of child.querySelectorAll(':scope > li')) {
          out += `\n${idx}. ${nodeToMd(li).trim()}`;
          idx++;
        }
        out += '\n';
        break;
      }
      case 'li': out += inner; break;
      case 'span': {
        const colorMatch = (child.getAttribute('style') || '').match(/color\s*:\s*([^;]+)/i);
        out += colorMatch
          ? `<span style="color:${colorMatch[1].trim()}">${inner}</span>`
          : inner;
        break;
      }
      case 'div': out += `\n${inner}\n`; break;
      default: out += inner;
    }
  }
  return out;
}

export function htmlToMd(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return nodeToMd(div).replace(/\n{3,}/g, '\n\n').trim();
}

/* ── WYSIWYG Editor ─────────────────────────────────────────────────── */

function ToolBtn({ title, onAction, children }) {
  return (
    <button
      type="button"
      title={title}
      className={styles.toolBtn}
      onMouseDown={(e) => { e.preventDefault(); onAction(); }}
    >
      {children}
    </button>
  );
}

function WysiwygEditor({ initialHtml, onChange }) {
  const editorRef = useRef(null);
  const colorRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = initialHtml || '';
      initialized.current = true;
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, [initialHtml]);

  const exec = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter link URL:');
    if (url) exec('createLink', url);
  }, [exec]);

  const handleColor = useCallback((e) => {
    exec('foreColor', e.target.value);
  }, [exec]);

  return (
    <div className={styles.editorWrap}>
      <div className={styles.toolbar}>
        <ToolBtn title="Bold (Ctrl+B)" onAction={() => exec('bold')}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title="Italic (Ctrl+I)" onAction={() => exec('italic')}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="Underline (Ctrl+U)" onAction={() => exec('underline')}>
          <u>U</u>
        </ToolBtn>
        <ToolBtn title="Strikethrough" onAction={() => exec('strikeThrough')}>
          <s>S</s>
        </ToolBtn>
        <span className={styles.toolSep} />
        <ToolBtn title="Heading 1" onAction={() => exec('formatBlock', 'h1')}>H1</ToolBtn>
        <ToolBtn title="Heading 2" onAction={() => exec('formatBlock', 'h2')}>H2</ToolBtn>
        <ToolBtn title="Heading 3" onAction={() => exec('formatBlock', 'h3')}>H3</ToolBtn>
        <span className={styles.toolSep} />
        <ToolBtn title="Bullet list" onAction={() => exec('insertUnorderedList')}>
          ≡•
        </ToolBtn>
        <ToolBtn title="Numbered list" onAction={() => exec('insertOrderedList')}>
          ≡1
        </ToolBtn>
        <ToolBtn title="Blockquote" onAction={() => exec('formatBlock', 'blockquote')}>
          "
        </ToolBtn>
        <span className={styles.toolSep} />
        <ToolBtn title="Insert link" onAction={insertLink}>🔗</ToolBtn>
        <ToolBtn title="Remove link" onAction={() => exec('unlink')}>🔗̶</ToolBtn>
        <span className={styles.toolSep} />
        <label className={styles.colorLabel} title="Text color">
          <span className={styles.colorIcon}>A</span>
          <input
            ref={colorRef}
            type="color"
            className={styles.colorInput}
            defaultValue="#e74c3c"
            onChange={handleColor}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </label>
        <ToolBtn title="Remove formatting" onAction={() => exec('removeFormat')}>
          Tx
        </ToolBtn>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={styles.editorContent}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            exec('insertHTML', '&nbsp;&nbsp;');
          }
        }}
      />
    </div>
  );
}

/* ── Form field helper ───────────────────────────────────────────────── */

function FormField({ label, value, onChange, multiline }) {
  return (
    <div className={styles.formField}>
      <label className={styles.fieldLabel}>{label}</label>
      {multiline ? (
        <textarea
          className={styles.fieldInput}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={styles.fieldInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ── Main Modal ──────────────────────────────────────────────────────── */

function ModalContent({ onClose, mode, filePath, itemId, itemData, pageTitle }) {
  const { siteConfig } = useDocusaurusContext();
  const buildToken = siteConfig.customFields?.GITHUB_EDIT_TOKEN || '';

  const [token, setToken] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [frontmatter, setFrontmatter] = useState('');
  const [formData, setFormData] = useState({});
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('gh_edit_token');
    setToken(stored || buildToken);
  }, [buildToken]);

  useEffect(() => {
    if (mode === 'markdown' && filePath) {
      setFetching(true);
      setError('');
      fetchRawFile(filePath)
        .then((md) => {
          const { frontmatter: fm, content } = splitFrontmatter(md);
          setFrontmatter(fm);
          setHtmlContent(mdToHtml(content));
        })
        .catch((err) => setError(`Failed to load content: ${err.message}`))
        .finally(() => setFetching(false));
    } else if (itemData) {
      setFormData({ ...itemData });
    }
  }, [mode, filePath, itemData]);

  const handleTokenChange = (val) => {
    setToken(val);
    if (val) sessionStorage.setItem('gh_edit_token', val);
    else sessionStorage.removeItem('gh_edit_token');
  };

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('A GitHub personal access token is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let newContent, prTitle, prBody;

      if (mode === 'markdown') {
        const md = htmlToMd(htmlContent);
        newContent = frontmatter + md + '\n';
        prTitle = `Edit: ${pageTitle || filePath}`;
        prBody = [
          `Community-suggested edit for **${pageTitle || filePath}**.`,
          '',
          '_Submitted via the website editor._',
        ].join('\n');
      } else {
        const raw = await fetchRawFile(filePath);
        const arr = JSON.parse(raw);
        const idx = arr.findIndex((item) => item.id === itemId);
        if (idx === -1) throw new Error('Item not found. The data may have changed — please refresh and try again.');
        arr[idx] = { ...arr[idx], ...formData };
        newContent = JSON.stringify(arr, null, 2) + '\n';
        prTitle = `Edit ${mode} card: "${formData.title || formData.name || itemId}"`;
        prBody = [
          `Community-suggested edit for **${mode}** card \`${itemId}\`.`,
          '',
          '_Submitted via the website editor._',
        ].join('\n');
      }

      const pr = await createEditPR({ token, filePath, newContent, prTitle, prBody });
      setSuccess(pr);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modeLabel = mode === 'markdown'
    ? `Suggest an edit — ${pageTitle || filePath}`
    : mode === 'news'
    ? 'Edit news card'
    : 'Edit community card';

  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={modeLabel}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{modeLabel}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {success ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successText}>Pull request created successfully!</p>
              <a
                href={success.url}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.prLink}
              >
                View PR #{success.number} on GitHub →
              </a>
              <p className={styles.successNote}>
                A maintainer will review and merge your suggested changes. Thank you!
              </p>
              <button className={styles.closeSuccessBtn} onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              {/* Markdown WYSIWYG editor */}
              {mode === 'markdown' && (
                <div className={styles.editorSection}>
                  {fetching ? (
                    <div className={styles.loadingBox}>Loading content from GitHub…</div>
                  ) : (
                    <WysiwygEditor initialHtml={htmlContent} onChange={setHtmlContent} />
                  )}
                </div>
              )}

              {/* News card fields */}
              {mode === 'news' && (
                <div className={styles.formSection}>
                  <FormField label="Date" value={formData.date || ''} onChange={(v) => setFormData((d) => ({ ...d, date: v }))} />
                  <FormField label="Tag / Category" value={formData.tag || ''} onChange={(v) => setFormData((d) => ({ ...d, tag: v }))} />
                  <FormField label="Title" value={formData.title || ''} onChange={(v) => setFormData((d) => ({ ...d, title: v }))} />
                  <FormField label="Body text" value={formData.body || ''} onChange={(v) => setFormData((d) => ({ ...d, body: v }))} multiline />
                  <FormField label="Link URL (optional)" value={formData.href || ''} onChange={(v) => setFormData((d) => ({ ...d, href: v || null }))} />
                </div>
              )}

              {/* Community card fields */}
              {mode === 'community' && (
                <div className={styles.formSection}>
                  <FormField label="Name" value={formData.name || ''} onChange={(v) => setFormData((d) => ({ ...d, name: v }))} />
                  <FormField label="Website URL" value={formData.url || ''} onChange={(v) => setFormData((d) => ({ ...d, url: v }))} />
                  <FormField label="Role / Description" value={formData.role || ''} onChange={(v) => setFormData((d) => ({ ...d, role: v }))} />
                </div>
              )}

              {/* Token */}
              <div className={styles.tokenSection}>
                <div className={styles.tokenRow}>
                  <label htmlFor="gh-token" className={styles.tokenLabel}>
                    GitHub Personal Access Token
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook+Edit"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.tokenCreateLink}
                  >
                    Create one →
                  </a>
                </div>
                <input
                  id="gh-token"
                  type="password"
                  className={styles.tokenInput}
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  autoComplete="off"
                />
                <p className={styles.tokenHint}>
                  Your token stays in your browser session only. It needs <code>public_repo</code> scope to create a pull request.
                </p>
              </div>

              {error && <div className={styles.errorBox}>{error}</div>}

              {/* Actions */}
              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={onClose} type="button">
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={submitting || fetching}
                  type="button"
                >
                  {submitting ? 'Creating pull request…' : 'Submit as Pull Request'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditModal(props) {
  if (typeof window === 'undefined' || !props.isOpen) return null;
  return ReactDOM.createPortal(
    <ModalContent {...props} />,
    document.body
  );
}

/* ── Edit Button (convenience wrapper) ──────────────────────────────── */

export function EditButton({ className, label, ...modalProps }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className || styles.editBtn}
        onClick={() => setOpen(true)}
        title={label || 'Suggest an edit'}
        aria-label={label || 'Suggest an edit'}
      >
        <span className={styles.editBtnIcon}>✏</span>
        {label && <span>{label}</span>}
      </button>
      <EditModal isOpen={open} onClose={() => setOpen(false)} {...modalProps} />
    </>
  );
}

/* ── Inline card edit button (pencil icon only) ──────────────────────── */

export function CardEditButton(props) {
  return (
    <EditButton
      {...props}
      className={styles.cardEditBtn}
      label={null}
    />
  );
}
