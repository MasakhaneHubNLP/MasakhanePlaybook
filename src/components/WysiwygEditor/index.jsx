import React, { useEffect, useRef, useCallback } from 'react';
import styles from '@site/src/components/EditModal/index.module.css';

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

export function WysiwygEditor({ initialHtml, onChange }) {
  const editorRef = useRef(null);
  const colorRef = useRef(null);
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
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

  const handleImageFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const defaultAlt = file.name.replace(/\.[^.]+$/, '');
    const alt = window.prompt('Alt text for the image:', defaultAlt) ?? defaultAlt;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false,
        `<img src="${ev.target.result}" alt="${alt}" style="max-width:100%;height:auto">`
      );
      onChange(editorRef.current?.innerHTML || '');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onChange]);

  const handleVideoInsert = useCallback(() => {
    const url = window.prompt('Enter video URL (YouTube, Vimeo, or direct .mp4/.webm):');
    if (!url) return;
    let html;
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (ytMatch) {
      html = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allowfullscreen style="max-width:100%"></iframe>`;
    } else if (vimeoMatch) {
      html = `<iframe width="560" height="315" src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allowfullscreen style="max-width:100%"></iframe>`;
    } else {
      html = `<video src="${url}" controls style="max-width:100%;height:auto"></video>`;
    }
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleVideoFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.alert('Video file exceeds 10 MB. Please use the 🎬 URL button to link to a hosted video instead.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false,
        `<video src="${ev.target.result}" controls style="max-width:100%;height:auto"></video>`
      );
      onChange(editorRef.current?.innerHTML || '');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onChange]);

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
        {/* Image insert — label wraps hidden file input so click is a trusted user gesture */}
        <label
          className={styles.toolBtn}
          title="Insert image from file"
          onMouseDown={(e) => e.preventDefault()}
        >
          🖼
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageFile}
          />
        </label>
        <ToolBtn title="Insert video (YouTube, Vimeo, or direct URL)" onAction={handleVideoInsert}>🎬</ToolBtn>
        <label
          className={styles.toolBtn}
          title="Insert video from file (max 10 MB)"
          onMouseDown={(e) => e.preventDefault()}
        >
          📹
          <input
            ref={vidInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleVideoFile}
          />
        </label>
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
