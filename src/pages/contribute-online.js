import clsx from 'clsx';
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

/* ── Inline icons (Lucide-style, stroke-based) ───────────── */
const IconKey = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-9.6 9.6" />
    <path d="M15.5 7.5l3 3L22 7l-3-3" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Feature overview cards ──────────────────────────────── */
const FEATURES = [
  {
    Icon: IconKey,
    title: 'Authenticate',
    body: 'Connect your GitHub account in seconds — via popup, device flow, or a personal access token. No local setup required.',
  },
  {
    Icon: IconEdit,
    title: 'Edit content',
    body: 'Open any existing Playbook page and make changes using a full rich-text editor with headings, lists, links, images, and video.',
  },
  {
    Icon: IconLayers,
    title: 'Manage structure',
    body: 'Add new sections, pages, and subsections directly in the tree view. Rename, reorder, or delete items without touching the filesystem.',
  },
  {
    Icon: IconUpload,
    title: 'Upload documents',
    body: 'Import PDF, Word (.docx), or Markdown files. The tool extracts text and images automatically and places them in the right location.',
  },
  {
    Icon: IconGlobe,
    title: 'Translate',
    body: 'Translate any page into Hausa, Amharic, Swahili, French, or Portuguese — auto-translated first, then refined in a side-by-side editor.',
  },
  {
    Icon: IconSend,
    title: 'Submit a PR',
    body: 'All changes are staged locally, then submitted as a single Pull Request on GitHub. No direct commits to main — everything goes through review.',
  },
];

export default function ContributeOnline() {
  return (
    <Layout
      title="Contribute Online"
      description="Step-by-step guide to contributing to the Masakhane Playbook directly in your browser — no local setup required."
    >
      <section className={clsx(styles.section, styles.cfcSection, styles.cfcPageSection)}>
        <div className="container">

          <Link to="/" className={styles.cfcBackLink}>← Back to home</Link>

          {/* ── Hero ─────────────────────────────────────────── */}
          <div className={styles.cfcHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Online contribution</span>
              <Heading as="h1" className={styles.sectionTitle}>
                Contribute directly in your browser
              </Heading>
              <p className={styles.cfcLead}>
                No Git, no terminal, no local setup. Authenticate with GitHub,
                use the built-in editor to add or improve content, and submit
                your changes as a Pull Request — all without leaving the page.
              </p>
            </div>
            <div className={styles.cfcActions}>
              <a
                href="#launch"
                className={clsx('button', styles.primaryButton)}
              >
                Start Contributing Online
              </a>
              <Link
                to="/contribute"
                className={clsx('button', styles.secondaryButton)}
              >
                Prefer cloning? See GitHub guide
              </Link>
            </div>
          </div>

          {/* ── Feature overview cards ────────────────────────── */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              What you can do
            </Heading>
            <p className={styles.cfcSubheadLead}>
              The online editor covers the full contribution lifecycle — from
              authentication through editing, uploading, translating, and
              submitting.
            </p>
          </div>

          <div className={styles.expectationGrid}>
            {FEATURES.map(({ Icon, title, body }) => (
              <article key={title} className={styles.expectationCard}>
                <div className={styles.expectationIcon}>
                  <Icon />
                </div>
                <h3 className={styles.expectationTitle}>{title}</h3>
                <p className={styles.expectationBody}>{body}</p>
              </article>
            ))}
          </div>

          {/* ── Step 1: Authenticate ──────────────────────────── */}
          <div className={styles.cfcSubhead} id="step-auth">
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Step 1 — Authenticate with GitHub
            </Heading>
            <p className={styles.cfcSubheadLead}>
              All contributions are submitted as Pull Requests under your GitHub
              account. Connect once — your session is remembered until you sign
              out. Three methods are supported; use whichever works for you.
            </p>
          </div>

          <div className={styles.scopeGrid}>

            {/* Method A */}
            <article className={styles.scopeCard}>
              <h3 className={styles.scopeName}>
                Sign in with GitHub
                <span style={{ marginLeft: '0.4em', fontSize: '0.75em', fontWeight: 600, color: 'var(--ifm-color-primary)', verticalAlign: 'middle' }}>Recommended</span>
              </h3>
              <p className={styles.scopeIntro}>
                The fastest option. Opens a GitHub authorization popup in a
                new window.
              </p>
              <ul className={styles.scopeList}>
                <li>Click <strong>Sign in with GitHub</strong> inside the editor</li>
                <li>A GitHub popup opens — review the permissions</li>
                <li>Click <strong>Authorize</strong></li>
                <li>The popup closes and your avatar appears — you are connected</li>
              </ul>
            </article>

            {/* Method B */}
            <article className={styles.scopeCard}>
              <h3 className={styles.scopeName}>Device flow</h3>
              <p className={styles.scopeIntro}>
                Automatic fallback when your browser blocks popups. No extra
                setup needed.
              </p>
              <ul className={styles.scopeList}>
                <li>The editor detects the blocked popup and switches automatically</li>
                <li>A <strong>6-character verification code</strong> appears in the dialog</li>
                <li>Click the link to open <code>github.com/login/device</code></li>
                <li>Enter the code and click <strong>Authorize</strong></li>
                <li>The editor detects authorization and connects your account</li>
              </ul>
            </article>

            {/* Method C */}
            <article className={styles.scopeCard}>
              <h3 className={styles.scopeName}>Personal Access Token</h3>
              <p className={styles.scopeIntro}>
                Use a GitHub token you generate yourself. Useful in restricted
                network environments.
              </p>
              <ul className={styles.scopeList}>
                <li>Go to <a href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a></li>
                <li>Select scope <strong>public_repo</strong> (classic token)</li>
                <li>Generate and copy the token</li>
                <li>Paste it into the token field in the editor and click <strong>Connect</strong></li>
              </ul>
            </article>

          </div>

          {/* Sign-out note */}
          <article className={styles.requirementsCard} style={{ marginTop: '1.5rem' }}>
            <ul className={styles.requirementsList}>
              <li>
                <span className={styles.requirementsBullet}>✓</span>
                <span>Your token is stored in <strong>localStorage</strong> on your device only — it is never sent to any server other than GitHub.</span>
              </li>
              <li>
                <span className={styles.requirementsBullet}>✓</span>
                <span>To sign out, click the avatar in the editor header and choose <strong>Sign out</strong>.</span>
              </li>
              <li>
                <span className={styles.requirementsBullet}>✓</span>
                <span>The minimum required scope is <code>public_repo</code>. No admin or private-repo access is ever requested.</span>
              </li>
            </ul>
          </article>

          {/* ── Step 2: Manage Structure ──────────────────────── */}
          <div className={styles.cfcSubhead} id="step-structure">
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Step 2 — Manage structure
            </Heading>
            <p className={styles.cfcSubheadLead}>
              The left panel shows the full Playbook tree. You can add, rename,
              reorder, and delete sections, pages, and subsections without
              touching any files directly.
            </p>
          </div>

          {/* Add a section */}
          <div className={styles.cfcSubhead} style={{ marginTop: '1rem', textAlign: 'left' }}>
            <Heading as="h3" className={styles.cfcSubheadTitle} style={{ fontSize: '1.2rem' }}>
              Add a top-level section
            </Heading>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { num: '01', title: 'Open the editor', body: 'Click "Start Contributing Online" at the bottom of this page to launch the editor dialog.' },
              { num: '02', title: 'Click "+ Section"', body: 'At the top of the left panel, click the "+ Section" button. An inline form appears.' },
              { num: '03', title: 'Enter a name', body: 'Type the section title (e.g. "Data Quality"). Press Enter or click Confirm.' },
              { num: '04', title: 'Section created', body: 'The tree shows the new section with a default intro page. Two files are staged: docs/{slug}/_category_.json and docs/{slug}/intro.md.' },
            ].map((s) => (
              <div key={s.num} className={styles.processStep}>
                <div className={styles.processNum}>{s.num}</div>
                <h4 className={styles.processTitle}>{s.title}</h4>
                <p className={styles.processBody}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Add a page / subsection */}
          <div className={styles.cfcSubhead} style={{ marginTop: '2rem', textAlign: 'left' }}>
            <Heading as="h3" className={styles.cfcSubheadTitle} style={{ fontSize: '1.2rem' }}>
              Add a page or subsection
            </Heading>
          </div>
          <div className={styles.requirementsGrid}>
            <article className={styles.requirementsCard}>
              <div className={styles.requirementsHeader}>
                <h4 className={styles.requirementsTitle}>Add a page inside a section</h4>
              </div>
              <ul className={styles.requirementsList}>
                <li><span className={styles.requirementsBullet}>1</span><span>Hover over any section name in the tree — a <strong>+ Page</strong> icon appears.</span></li>
                <li><span className={styles.requirementsBullet}>2</span><span>Click it and type the page title, then confirm.</span></li>
                <li><span className={styles.requirementsBullet}>3</span><span>The new page opens in the right panel ready to edit. Staged file: <code>docs/{'{section}/{slug}.md'}</code>.</span></li>
              </ul>
            </article>
            <article className={styles.requirementsCard}>
              <div className={styles.requirementsHeader}>
                <h4 className={styles.requirementsTitle}>Add a subsection under a page</h4>
              </div>
              <ul className={styles.requirementsList}>
                <li><span className={styles.requirementsBullet}>1</span><span>Hover over any existing page — a <strong>+ Subsection</strong> icon appears.</span></li>
                <li><span className={styles.requirementsBullet}>2</span><span>Click it and enter the subsection name.</span></li>
                <li><span className={styles.requirementsBullet}>3</span><span>The page becomes a parent folder. Staged files: <code>_category_.json</code> + <code>index.md</code> for the new subsection.</span></li>
              </ul>
            </article>
          </div>

          {/* Rename / reorder / delete */}
          <article className={styles.requirementsCard} style={{ marginTop: '1rem' }}>
            <div className={styles.requirementsHeader}>
              <h4 className={styles.requirementsTitle}>Rename, reorder, and delete</h4>
            </div>
            <ul className={styles.requirementsList}>
              <li><span className={styles.requirementsBullet}>✎</span><span><strong>Rename:</strong> hover any item → click the rename icon → type a new name → press Enter.</span></li>
              <li><span className={styles.requirementsBullet}>↕</span><span><strong>Reorder:</strong> use the up/down arrows that appear on hover to move items within their section.</span></li>
              <li><span className={styles.requirementsBullet}>✕</span><span><strong>Delete:</strong> click the trash icon → confirm. The deletion is staged and can be undone in the changes panel before submitting.</span></li>
            </ul>
          </article>

          {/* ── Step 3: Edit Existing Content ─────────────────── */}
          <div className={styles.cfcSubhead} id="step-edit">
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Step 3 — Edit existing content
            </Heading>
            <p className={styles.cfcSubheadLead}>
              Click the edit icon next to any page or section in the tree to
              open it in the full rich-text editor.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { num: '01', title: 'Select a page', body: 'In the left panel tree, click the pencil icon next to any page. The page content loads in the right panel.' },
              { num: '02', title: 'Edit with the toolbar', body: 'Use the rich-text toolbar above the editor area to format your content (see toolbar reference below).' },
              { num: '03', title: 'Save', body: 'Click Save. The change is staged locally — it appears in the pending changes panel with a "~" indicator. Nothing is sent to GitHub yet.' },
            ].map((s) => (
              <div key={s.num} className={styles.processStep}>
                <div className={styles.processNum}>{s.num}</div>
                <h4 className={styles.processTitle}>{s.title}</h4>
                <p className={styles.processBody}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* WYSIWYG toolbar reference */}
          <div className={styles.cfcSubhead} style={{ marginTop: '2rem', textAlign: 'left' }}>
            <Heading as="h3" className={styles.cfcSubheadTitle} style={{ fontSize: '1.2rem' }}>
              Toolbar reference
            </Heading>
          </div>
          <div className={styles.requirementsGrid}>
            <article className={styles.requirementsCard}>
              <div className={styles.requirementsHeader}>
                <h4 className={styles.requirementsTitle}>Text formatting</h4>
              </div>
              <ul className={styles.requirementsList}>
                <li><span className={styles.requirementsBullet}>B</span><span><strong>Bold</strong>, <em>Italic</em>, Underline, Strikethrough</span></li>
                <li><span className={styles.requirementsBullet}>H</span><span>Headings H1, H2, H3</span></li>
                <li><span className={styles.requirementsBullet}>¶</span><span>Bullet list, Numbered list, Blockquote</span></li>
                <li><span className={styles.requirementsBullet}>A</span><span>Text colour picker</span></li>
                <li><span className={styles.requirementsBullet}>✕</span><span>Remove all formatting from selection</span></li>
              </ul>
            </article>
            <article className={styles.requirementsCard}>
              <div className={styles.requirementsHeader}>
                <h4 className={styles.requirementsTitle}>Media &amp; links</h4>
              </div>
              <ul className={styles.requirementsList}>
                <li><span className={styles.requirementsBullet}>🔗</span><span>Insert link (prompts for URL) / Remove link</span></li>
                <li><span className={styles.requirementsBullet}>🖼</span><span>Insert image from local file (embedded inline)</span></li>
                <li><span className={styles.requirementsBullet}>▶</span><span>Insert video by URL — YouTube, Vimeo, or direct link</span></li>
                <li><span className={styles.requirementsBullet}>📎</span><span>Insert video from local file (max 10 MB, embedded inline)</span></li>
              </ul>
            </article>
          </div>

          {/* Detailed step sections will be added in subsequent commits */}

        </div>
      </section>
    </Layout>
  );
}
