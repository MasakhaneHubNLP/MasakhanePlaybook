import clsx from 'clsx';
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const PREREQUISITES = [
  {
    name: 'Git',
    body: (
      <>
        Install from{' '}
        <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer">
          git-scm.com
        </a>
        . Verify with <code>git --version</code>.
      </>
    ),
  },
  {
    name: 'Node.js ≥ 18',
    body: (
      <>
        Install from{' '}
        <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
          nodejs.org
        </a>
        . Verify with <code>node --version</code>.
      </>
    ),
  },
  {
    name: 'GitHub account',
    body: (
      <>
        Free at{' '}
        <a href="https://github.com/join" target="_blank" rel="noopener noreferrer">
          github.com/join
        </a>
        . You'll use it to fork and submit a Pull Request.
      </>
    ),
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Fork the repository',
    body: (
      <>
        Go to{' '}
        <a
          href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/MasakhaneHubNLP/MasakhanePlaybook
        </a>{' '}
        and click <strong>Fork</strong> (top-right corner). This creates your
        own copy under your GitHub account.
      </>
    ),
    code: null,
  },
  {
    num: '02',
    title: 'Clone your fork locally',
    body: (
      <>
        Replace <code>YOUR-USERNAME</code> with your GitHub username:
      </>
    ),
    code: 'git clone https://github.com/YOUR-USERNAME/MasakhanePlaybook.git\ncd MasakhanePlaybook',
  },
  {
    num: '03',
    title: 'Create a feature branch',
    body: (
      <>
        Never commit directly to <code>main</code>. Create a descriptive branch
        for your contribution:
      </>
    ),
    code: 'git checkout -b add/your-chapter-name',
  },
  {
    num: '04',
    title: 'Install dependencies and preview',
    body: (
      <>
        Install packages, then start the local dev server. The site will be live
        at <code>http://localhost:3000</code> and will hot-reload as you edit.
      </>
    ),
    code: 'npm install\nnpm start',
  },
  {
    num: '05',
    title: 'Make your changes',
    body: (
      <>
        Playbook chapters live in the <code>docs/</code> folder as Markdown
        (<code>.md</code>) files. Translations go in{' '}
        <code>i18n/&lt;lang&gt;/docusaurus-plugin-content-docs/current/</code>.
        Follow the{' '}
        <a
          href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          contributor guidelines
        </a>{' '}
        for frontmatter, structure, and style conventions.
      </>
    ),
    code: null,
  },
  {
    num: '06',
    title: 'Commit and push',
    body: <>Stage your changes, write a clear commit message, and push to your fork:</>,
    code: 'git add .\ngit commit -m "docs: add chapter on <topic>"\ngit push origin add/your-chapter-name',
  },
  {
    num: '07',
    title: 'Open a Pull Request',
    body: (
      <>
        GitHub will show a banner prompting you to open a PR. Click{' '}
        <strong>Compare &amp; pull request</strong>, fill in the description
        template, and submit. A maintainer will review and respond within a few
        days.
      </>
    ),
    code: null,
  },
];

const TIPS = [
  'Keep PRs focused — one chapter or fix per PR makes review faster.',
  'Run npm run build locally before pushing to catch broken links and MDX errors.',
  'Check existing chapters for frontmatter conventions (title, description, sidebar_position).',
  'For large additions, open a GitHub Discussion first to align on scope.',
  'Translations must mirror the English source structure exactly.',
];

export default function ContributeClone() {
  return (
    <Layout
      title="Contribute via GitHub"
      description="Step-by-step guide to contributing to the Masakhane Playbook by cloning the GitHub repository."
    >
      <section className={clsx(styles.section, styles.cfcSection, styles.cfcPageSection)}>
        <div className="container">
          <Link to="/" className={styles.cfcBackLink}>
            ← Back to home
          </Link>

          {/* Header */}
          <div className={styles.cfcHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Clone &amp; Contribute</span>
              <Heading as="h1" className={styles.sectionTitle}>
                Contribute via GitHub
              </Heading>
              <p className={styles.cfcLead}>
                Fork the repository, make your changes locally with any editor,
                and submit a Pull Request. Full control, works offline, no
                account permissions needed beyond a GitHub login.
              </p>
            </div>
            <div className={styles.cfcActions}>
              <a
                href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook/fork"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx('button', styles.primaryButton)}
              >
                Fork on GitHub
              </a>
              <a
                href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx('button', styles.secondaryButton)}
              >
                Read the README
              </a>
            </div>
          </div>

          {/* Prerequisites */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Prerequisites
            </Heading>
          </div>
          <div className={styles.scopeGrid}>
            {PREREQUISITES.map((p) => (
              <article key={p.name} className={styles.scopeCard}>
                <h3 className={styles.scopeName}>{p.name}</h3>
                <p className={styles.scopeIntro}>{p.body}</p>
              </article>
            ))}
          </div>

          {/* Steps */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Step-by-step
            </Heading>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STEPS.map((step) => (
              <div key={step.num} className={styles.processStep}>
                <div className={styles.processNum}>{step.num}</div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processBody}>{step.body}</p>
                {step.code && (
                  <pre style={{ marginTop: '0.85rem', marginBottom: 0 }}>
                    <code>{step.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className={styles.cfcSubhead}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Tips for a smooth review
            </Heading>
          </div>
          <article className={styles.requirementsCard}>
            <ul className={styles.requirementsList}>
              {TIPS.map((tip) => (
                <li key={tip}>
                  <span className={styles.requirementsBullet}>✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Bottom CTA */}
          <div className={styles.cfcSubhead} style={{ marginTop: '5rem' }}>
            <Heading as="h2" className={styles.cfcSubheadTitle}>
              Prefer to edit without cloning?
            </Heading>
            <p className={styles.cfcSubheadLead}>
              Use the <strong>Online</strong> editor — authenticate with GitHub
              and edit or translate any page directly in your browser.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/playbook/" className={clsx('button', styles.primaryButton)}>
                Browse the Playbook
              </Link>
              <Link to="/about" className={clsx('button', styles.secondaryButton)}>
                About the project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
