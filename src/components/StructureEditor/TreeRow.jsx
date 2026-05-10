import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';

export function InlineForm({ placeholder, initialValue = '', onConfirm, onCancel }) {
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

export function TreeRow({
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
