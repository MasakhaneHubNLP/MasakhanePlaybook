import clsx from 'clsx';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import acc from './contribute-online.module.css';
import { StructureEditorContent } from '@site/src/components/StructureEditor';

/* ── Inline icons ────────────────────────────────────────── */
const IconKey = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3L22 7l-3-3" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Feature overview cards ──────────────────────────────── */
const FEATURES = [
  { Icon: IconKey,    title: 'Authenticate',      body: 'Connect your GitHub account in seconds — via popup, device flow, or a personal access token. No local setup required.' },
  { Icon: IconEdit,   title: 'Edit content',       body: 'Open any existing Playbook page and make changes using a full rich-text editor with headings, lists, links, images, and video.' },
  { Icon: IconLayers, title: 'Manage structure',   body: 'Add new sections, pages, and subsections directly in the tree view. Rename, reorder, or delete items without touching the filesystem.' },
  { Icon: IconUpload, title: 'Upload documents',   body: 'Import PDF, Word (.docx), or Markdown files. The tool extracts text and images automatically and places them in the right location.' },
  { Icon: IconGlobe,  title: 'Translate',          body: 'Translate any page into Hausa, Amharic, Swahili, French, or Portuguese — auto-translated first, then refined in a side-by-side editor.' },
  { Icon: IconSend,   title: 'Submit a PR',        body: 'All changes are staged locally, then submitted as a single Pull Request on GitHub. No direct commits to main — everything goes through review.' },
];

/* ── Accordion step content ──────────────────────────────── */
function StepAuth({ s }) {
  return (
    <>
      <div className={styles.scopeGrid}>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>
            Sign in with GitHub
            <span style={{ marginLeft: '0.4em', fontSize: '0.75em', fontWeight: 600, color: 'var(--ifm-color-primary)', verticalAlign: 'middle' }}>Recommended</span>
          </h3>
          <p className={styles.scopeIntro}>Opens a GitHub authorization popup in a new window.</p>
          <ul className={styles.scopeList}>
            <li>Click <strong>Sign in with GitHub</strong> inside the editor</li>
            <li>A GitHub popup opens — review the permissions</li>
            <li>Click <strong>Authorize</strong></li>
            <li>The popup closes and your avatar appears — you are connected</li>
          </ul>
        </article>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>Device flow</h3>
          <p className={styles.scopeIntro}>Automatic fallback when your browser blocks popups.</p>
          <ul className={styles.scopeList}>
            <li>The editor switches to device flow automatically</li>
            <li>A <strong>6-character code</strong> appears in the dialog</li>
            <li>Visit <code>github.com/login/device</code> in any tab</li>
            <li>Enter the code and click <strong>Authorize</strong></li>
            <li>The editor connects automatically</li>
          </ul>
        </article>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>Personal Access Token</h3>
          <p className={styles.scopeIntro}>Use a GitHub token you generate yourself.</p>
          <ul className={styles.scopeList}>
            <li>Go to <a href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a></li>
            <li>Select scope <strong>public_repo</strong></li>
            <li>Generate and copy the token</li>
            <li>Paste into the token field and click <strong>Connect</strong></li>
          </ul>
        </article>
      </div>
      <article className={styles.requirementsCard} style={{ marginTop: '1.25rem' }}>
        <ul className={styles.requirementsList}>
          <li><span className={styles.requirementsBullet}>✓</span><span>Your token is stored in <strong>localStorage</strong> on your device only — never sent to any server other than GitHub.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>To sign out, click your avatar in the editor header and choose <strong>Sign out</strong>.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>Minimum required scope: <code>public_repo</code>. No admin or private-repo access is ever requested.</span></li>
        </ul>
      </article>
    </>
  );
}

function StepStructure() {
  const addSectionSteps = [
    { num: '01', title: 'Open the editor', body: 'Click "Start Contributing Online" at the bottom of this page to launch the editor dialog.' },
    { num: '02', title: 'Click "+ Section"', body: 'At the top of the left panel, click the "+ Section" button. An inline form appears.' },
    { num: '03', title: 'Enter a name', body: 'Type the section title (e.g. "Data Quality"). Press Enter or click Confirm.' },
    { num: '04', title: 'Section created', body: 'The tree shows the new section with a default intro page. Staged files: docs/{slug}/_category_.json and docs/{slug}/intro.md.' },
  ];
  return (
    <>
      <Heading as="h3" style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Add a top-level section</Heading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {addSectionSteps.map((s) => (
          <div key={s.num} className={styles.processStep}>
            <div className={styles.processNum}>{s.num}</div>
            <h4 className={styles.processTitle}>{s.title}</h4>
            <p className={styles.processBody}>{s.body}</p>
          </div>
        ))}
      </div>
      <Heading as="h3" style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Add a page or subsection</Heading>
      <div className={styles.requirementsGrid} style={{ marginBottom: '1.25rem' }}>
        <article className={styles.requirementsCard}>
          <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Add a page inside a section</h4></div>
          <ul className={styles.requirementsList}>
            <li><span className={styles.requirementsBullet}>1</span><span>Hover over any section name — a <strong>+ Page</strong> icon appears.</span></li>
            <li><span className={styles.requirementsBullet}>2</span><span>Click it, type the page title, confirm.</span></li>
            <li><span className={styles.requirementsBullet}>3</span><span>New page opens in the right panel. Staged: <code>docs/{'{section}/{slug}.md'}</code></span></li>
          </ul>
        </article>
        <article className={styles.requirementsCard}>
          <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Add a subsection under a page</h4></div>
          <ul className={styles.requirementsList}>
            <li><span className={styles.requirementsBullet}>1</span><span>Hover over any page — a <strong>+ Subsection</strong> icon appears.</span></li>
            <li><span className={styles.requirementsBullet}>2</span><span>Click it and enter the subsection name.</span></li>
            <li><span className={styles.requirementsBullet}>3</span><span>Page becomes a parent folder. Staged: <code>_category_.json</code> + <code>index.md</code></span></li>
          </ul>
        </article>
      </div>
      <article className={styles.requirementsCard}>
        <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Rename, reorder, and delete</h4></div>
        <ul className={styles.requirementsList}>
          <li><span className={styles.requirementsBullet}>✎</span><span><strong>Rename:</strong> hover any item → click the rename icon → type a new name → press Enter.</span></li>
          <li><span className={styles.requirementsBullet}>↕</span><span><strong>Reorder:</strong> use the up/down arrows on hover to move items within their section.</span></li>
          <li><span className={styles.requirementsBullet}>✕</span><span><strong>Delete:</strong> click the trash icon → confirm. Staged; undo available in the changes panel.</span></li>
        </ul>
      </article>
    </>
  );
}

function StepEdit() {
  const steps = [
    { num: '01', title: 'Select a page', body: 'In the left panel tree, click the pencil icon next to any page. The page content loads in the right panel.' },
    { num: '02', title: 'Edit with the toolbar', body: 'Use the rich-text toolbar above the editor area to format your content (see reference below).' },
    { num: '03', title: 'Save', body: 'Click Save. The change is staged locally in the pending changes panel. Nothing is sent to GitHub yet.' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {steps.map((s) => (
          <div key={s.num} className={styles.processStep}>
            <div className={styles.processNum}>{s.num}</div>
            <h4 className={styles.processTitle}>{s.title}</h4>
            <p className={styles.processBody}>{s.body}</p>
          </div>
        ))}
      </div>
      <div className={styles.requirementsGrid}>
        <article className={styles.requirementsCard}>
          <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Text formatting</h4></div>
          <ul className={styles.requirementsList}>
            <li><span className={styles.requirementsBullet}>B</span><span><strong>Bold</strong>, <em>Italic</em>, Underline, Strikethrough</span></li>
            <li><span className={styles.requirementsBullet}>H</span><span>Headings H1, H2, H3</span></li>
            <li><span className={styles.requirementsBullet}>¶</span><span>Bullet list, Numbered list, Blockquote</span></li>
            <li><span className={styles.requirementsBullet}>A</span><span>Text colour picker</span></li>
            <li><span className={styles.requirementsBullet}>✕</span><span>Remove all formatting from selection</span></li>
          </ul>
        </article>
        <article className={styles.requirementsCard}>
          <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Media &amp; links</h4></div>
          <ul className={styles.requirementsList}>
            <li><span className={styles.requirementsBullet}>🔗</span><span>Insert link (prompts for URL) / Remove link</span></li>
            <li><span className={styles.requirementsBullet}>🖼</span><span>Insert image from local file (embedded inline)</span></li>
            <li><span className={styles.requirementsBullet}>▶</span><span>Insert video by URL — YouTube, Vimeo, or direct link</span></li>
            <li><span className={styles.requirementsBullet}>📎</span><span>Insert video from local file (max 10 MB)</span></li>
          </ul>
        </article>
      </div>
    </>
  );
}

function StepUpload() {
  const steps = [
    { num: '01', title: 'Click the upload button', body: 'In the left panel header, click the upload (↑) icon. A file picker opens.' },
    { num: '02', title: 'Select your file', body: 'Choose a PDF, DOCX, MD, MDX, TXT, or HTML file from your device.' },
    { num: '03', title: 'Extraction runs in-browser', body: 'Text and images are extracted locally — nothing is uploaded to any server at this stage.' },
    { num: '04', title: 'Choose placement', body: 'Select where to place the content: as a new top-level page, inside an existing section, or as a subsection. Confirm.' },
    { num: '05', title: 'Review and edit', body: 'The extracted content opens in the right panel. Review, fix formatting, and click Save to stage the change.' },
  ];
  return (
    <>
      <div className={styles.scopeGrid} style={{ marginBottom: '1.5rem' }}>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>PDF</h3>
          <p className={styles.scopeIntro}>Text and embedded images are extracted. Each page becomes a paragraph; images are embedded inline.</p>
          <ul className={styles.scopeList}>
            <li>File must contain selectable text (not scanned images)</li>
            <li>Large PDFs may take a few seconds to process</li>
          </ul>
        </article>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>Word (.docx)</h3>
          <p className={styles.scopeIntro}>Converted to HTML via Mammoth, then to Markdown. Headings, lists, bold, and italic are preserved.</p>
          <ul className={styles.scopeList}>
            <li>Complex layouts may be simplified</li>
            <li>Embedded images are extracted inline</li>
          </ul>
        </article>
        <article className={styles.scopeCard}>
          <h3 className={styles.scopeName}>Markdown / Text / HTML</h3>
          <p className={styles.scopeIntro}>Uploaded as-is with frontmatter added automatically.</p>
          <ul className={styles.scopeList}>
            <li>Extensions: <code>.md</code> <code>.mdx</code> <code>.txt</code> <code>.html</code></li>
            <li>Existing frontmatter is preserved</li>
          </ul>
        </article>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {steps.map((s) => (
          <div key={s.num} className={styles.processStep}>
            <div className={styles.processNum}>{s.num}</div>
            <h4 className={styles.processTitle}>{s.title}</h4>
            <p className={styles.processBody}>{s.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function StepTranslate() {
  const steps = [
    { num: '01', title: 'Select a page', body: 'Click the translate icon next to any page in the left panel tree.' },
    { num: '02', title: 'Choose a target language', body: 'Use the language dropdown in the right panel.' },
    { num: '03', title: 'Auto-translate', body: 'Click Auto-translate. The editor splits: original English on the left, machine-translated text on the right. African languages use MyMemory; European languages use Helsinki-NLP.' },
    { num: '04', title: 'Alternatively — Google Translate', body: 'Click the Google Translate button as an alternative. Results appear in the same right-hand pane.' },
    { num: '05', title: 'Refine the translation', body: 'Edit the right-hand pane directly. The left pane stays fixed for reference. Use the same rich-text toolbar.' },
    { num: '06', title: 'Save', body: 'Click Save. The translation is staged as a new file at i18n/{lang}/docusaurus-plugin-content-docs/current/{original-path}.' },
  ];
  return (
    <>
      <article className={styles.requirementsCard} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.requirementsHeader}><h4 className={styles.requirementsTitle}>Supported languages</h4></div>
        <ul className={styles.requirementsList}>
          {[['ha','Hausa'],['am','Amharic'],['sw','Swahili'],['fr','Français'],['pt','Português']].map(([code, name]) => (
            <li key={code}>
              <span className={styles.requirementsBullet}><code style={{ fontSize: '0.8em' }}>{code}</code></span>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </article>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {steps.map((s) => (
          <div key={s.num} className={styles.processStep}>
            <div className={styles.processNum}>{s.num}</div>
            <h4 className={styles.processTitle}>{s.title}</h4>
            <p className={styles.processBody}>{s.body}</p>
          </div>
        ))}
      </div>
      <article className={styles.requirementsCard}>
        <ul className={styles.requirementsList}>
          <li><span className={styles.requirementsBullet}>✓</span><span>Auto-translation is a <strong>starting point</strong> — always review and refine before saving.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>Uploaded documents can also be translated — upload first, then open the translation tab.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>The translation file path mirrors the English source so the site serves both under the correct locale URL.</span></li>
        </ul>
      </article>
    </>
  );
}

function StepSubmit() {
  const steps = [
    { num: '01', title: 'Open the changes panel', body: 'The left panel shows a "Pending changes" count badge. Click it to see all staged changes: + (create), ~ (edit), − (delete).' },
    { num: '02', title: 'Review and undo if needed', body: 'Each change has an undo button (↩). Click to remove that specific change. "Clear all" discards everything.' },
    { num: '03', title: 'Click "Submit as Pull Request"', body: 'Click Submit. You must be authenticated. The editor bundles all staged changes into a single commit on a new branch.' },
    { num: '04', title: 'Pull Request is created', body: 'A PR opens on GitHub with a title and body listing all changes. The editor shows a confirmation with a direct link.' },
    { num: '05', title: 'Wait for review', body: 'A maintainer will review, leave feedback if needed, and merge when the changes meet editorial guidelines.' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {steps.map((s) => (
          <div key={s.num} className={styles.processStep}>
            <div className={styles.processNum}>{s.num}</div>
            <h4 className={styles.processTitle}>{s.title}</h4>
            <p className={styles.processBody}>{s.body}</p>
          </div>
        ))}
      </div>
      <article className={styles.requirementsCard}>
        <ul className={styles.requirementsList}>
          <li><span className={styles.requirementsBullet}>✓</span><span>PRs are always created on a new branch — never directly on <code>main</code>.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>Branch names are auto-generated: <code>edit/{'{slug}-{timestamp}'}</code> or <code>structure/edit-{'{timestamp}'}</code>.</span></li>
          <li><span className={styles.requirementsBullet}>✓</span><span>Staged changes are saved in <strong>localStorage</strong> — closing the browser and coming back restores your work.</span></li>
        </ul>
      </article>
    </>
  );
}

/* ── Accordion step definitions ──────────────────────────── */
const STEPS = [
  { label: 'Authenticate',  title: 'Authenticate with GitHub',       Content: StepAuth },
  { label: 'Structure',     title: 'Manage structure',               Content: StepStructure },
  { label: 'Edit',          title: 'Edit existing content',          Content: StepEdit },
  { label: 'Upload',        title: 'Upload documents',               Content: StepUpload },
  { label: 'Translate',     title: 'Translate a page',               Content: StepTranslate },
  { label: 'Submit PR',     title: 'Review changes and submit a PR', Content: StepSubmit },
];

/* ── Page ────────────────────────────────────────────────── */
export default function ContributeOnline() {
  const [activeTab, setActiveTab] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);

  const prev = () => setActiveTab((t) => Math.max(0, t - 1));
  const next = () => setActiveTab((t) => Math.min(STEPS.length - 1, t + 1));
  const isFirst = activeTab === 0;
  const isLast  = activeTab === STEPS.length - 1;
  const { title, Content } = STEPS[activeTab];

  return (
    <Layout
      title="Contribute Online"
      description="Step-by-step guide to contributing to the Masakhane Playbook directly in your browser — no local setup required."
    >
      <section className={clsx(styles.section, styles.cfcSection, styles.cfcPageSection)}>
        <div className="container">

          <Link to="/" className={styles.cfcBackLink}>← Back to home</Link>

          {/* ── Hero ───────────────────────────────────────── */}
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
              <button
                type="button"
                className={clsx('button', styles.primaryButton)}
                onClick={() => setEditorOpen(true)}
              >
                Start Contributing Online
              </button>
              <Link to="/contribute" className={clsx('button', styles.secondaryButton)}>
                Prefer cloning? See GitHub guide
              </Link>
            </div>
          </div>

          {/* ── Overview cards ─────────────────────────────── */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>What you can do</Heading>
            <p className={styles.cfcSubheadLead}>
              The online editor covers the full contribution lifecycle — from
              authentication through editing, uploading, translating, and submitting.
            </p>
          </div>
          <div className={styles.expectationGrid}>
            {FEATURES.map(({ Icon, title: t, body }) => (
              <article key={t} className={styles.expectationCard}>
                <div className={styles.expectationIcon}><Icon /></div>
                <h3 className={styles.expectationTitle}>{t}</h3>
                <p className={styles.expectationBody}>{body}</p>
              </article>
            ))}
          </div>

          {/* ── Tabbed step guide ──────────────────────────── */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>Step-by-step guide</Heading>
            <p className={styles.cfcSubheadLead}>
              Follow the steps below, or use Next / Previous to go through them in order.
            </p>
          </div>

          {/* Tab strip */}
          <div className={acc.tabList} role="tablist" aria-label="Contribution steps">
            {STEPS.map(({ label }, i) => (
              <button
                key={label}
                role="tab"
                type="button"
                aria-selected={i === activeTab}
                className={clsx(acc.tab, i === activeTab && acc.tabActive)}
                onClick={() => setActiveTab(i)}
              >
                <span className={acc.tabNum}>{i + 1}</span>
                <span className={acc.tabLabel}>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div role="tabpanel" className={acc.tabPanel}>
            <Heading as="h3" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Step {activeTab + 1} — {title}
            </Heading>
            <Content />

            {/* Next / Previous nav */}
            <div className={acc.tabNav}>
              {!isFirst ? (
                <button type="button" className={acc.navBtn} onClick={prev}>
                  ← Previous
                </button>
              ) : (
                <span className={acc.navSpacer} />
              )}

              {!isLast ? (
                <button type="button" className={clsx(acc.navBtn, acc.navBtnPrimary)} onClick={next}>
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className={clsx(acc.navBtn, acc.navBtnPrimary)}
                  onClick={() => setEditorOpen(true)}
                >
                  Start Contributing Online →
                </button>
              )}
            </div>
          </div>

          {editorOpen && typeof window !== 'undefined' &&
            ReactDOM.createPortal(
              <StructureEditorContent onClose={() => setEditorOpen(false)} />,
              document.body,
            )
          }

        </div>
      </section>
    </Layout>
  );
}
