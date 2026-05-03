import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { StructureEditorContent } from '@site/src/components/StructureEditor';
import styles from './index.module.css';

export default function ContributeButton({ filePath, pageTitle }) {
  const [open, setOpen] = useState(false);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <button
        type="button"
        className={styles.contributeBtn}
        onClick={() => setOpen(true)}
        aria-label="Contribute to this page"
      >
        <span className={styles.icon}>✦</span>
        Contribute
      </button>

      {open && ReactDOM.createPortal(
        <StructureEditorContent onClose={() => setOpen(false)} />,
        document.body,
      )}
    </>
  );
}
