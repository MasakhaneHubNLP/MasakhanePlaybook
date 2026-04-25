import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import {
  IconBookOpen,
  IconFileText,
  IconMic,
  IconImage,
  IconLayers,
  IconMegaphone,
  IconAward,
  IconCheckCircle,
  IconClipboardCheck,
  IconMail,
  IconArrowRight,
  IconExternalLink,
  IconShieldCheck,
  IconHeart,
  IconRocket,
} from '@site/src/components/Icons';

const SCOPE = [
  {
    icon: IconFileText,
    name: 'Text Data',
    intro: 'Written-language tasks across classification, generation, retrieval, and structured prediction.',
    examples: [
      'Text Classification (sentiment, emotion, hate speech, topic, intent)',
      'Sequence Labeling & Span Annotation (NER, POS, chunking)',
      'Machine Translation & Summarization',
      'Question Answering (extractive, generative, Seq2Seq)',
      'Dialogue & Instruction Data (chatbots, instruction-following)',
      'Information Retrieval & Ranking',
    ],
  },
  {
    icon: IconMic,
    name: 'Speech Tasks',
    intro: 'Voice and audio annotation for recognition, synthesis, and paralinguistic understanding.',
    examples: [
      'Automatic Speech Recognition (ASR / STT)',
      'Speech Generation & Synthesis (TTS, STS)',
      'Speaker & Paralinguistic Tasks (identity, emotion)',
      'Code-switching and dialect-aware speech data',
    ],
  },
  {
    icon: IconImage,
    name: 'Vision & Multimodal',
    intro: 'Image, video, and cross-modal grounding with strong African-context relevance.',
    examples: [
      'Image Recognition & Detection (classification, objects)',
      'Vision–Language Tasks (captioning, VQA, OCR)',
      'Multimodal & Cross-Modal Learning (text · audio · image · video)',
      'Document Understanding & layout analysis',
    ],
  },
];

const PROPOSAL_REQUIREMENTS = [
  'Author names, affiliations, and contact details',
  'Relevant experience in dataset creation and annotation',
  'Target data modality(ies) as the chapter name',
  'Structured outline of sections and key topics',
  'Alignment with practical annotation workflows',
  'Applicability to low-resource and underrepresented settings',
  'Potential for reuse by the broader community globally',
  'Maximum 5 pages per chapter (multiplied per modality)',
];

const EVALUATION_CRITERIA = [
  'Clarity and coherence of the proposed chapter',
  'Relevance to data annotation practices and challenges',
  'Practical applicability, state of the art, and usability',
  'Coverage of quality, ethics, and workflow design',
  'Author experience and expertise',
  'Contribution to low-resource and multilingual contexts',
  'Coverage of underrepresented languages or communities',
  'Actionable guidance and reusable resources',
  'Real-world annotation experience reflected',
  'Interdisciplinary and community-based teams encouraged',
];

const EXPECTATIONS = [
  {
    icon: IconClipboardCheck,
    title: 'Standalone guidelines',
    body: 'Clear, structured annotation guidelines that can be picked up and used without prior context.',
  },
  {
    icon: IconLayers,
    title: 'End-to-end workflow',
    body: 'From task definition through annotation to quality assurance — covering the full lifecycle.',
  },
  {
    icon: IconShieldCheck,
    title: 'Ethics & inclusivity',
    body: 'Explicit considerations for ethics, bias, and inclusivity, with practical mitigations.',
  },
  {
    icon: IconBookOpen,
    title: 'Templates & cases',
    body: 'Practical tools, templates, examples, and (where possible) real-world case studies.',
  },
];

const TIMELINE = [
  {label: 'Call opens', date: 'TBA', icon: IconMegaphone},
  {label: 'Proposal deadline', date: 'TBA', icon: IconFileText},
  {label: 'Notification', date: 'TBA', icon: IconMail},
  {label: 'Full chapter due', date: 'TBA', icon: IconClipboardCheck},
  {label: 'Final publication', date: 'TBA', icon: IconRocket},
];

export default function CallForChapters() {
  return (
    <Layout
      title="Call for Chapters"
      description="Submit a chapter proposal for the Masakhane Data Annotation Playbook. USD $1,000 honorarium per accepted chapter.">
      <main>
        <section
          id="call-for-chapters"
          className={clsx(styles.section, styles.cfcSection, styles.cfcPageSection)}>
          <div className="container">
            <Link to="/" className={styles.cfcBackLink}>
              ← Back to home
            </Link>

            {/* Header */}
            <div className={styles.cfcHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  <IconMegaphone size={14} /> Call for Chapters
                </span>
                <Heading as="h1" className={styles.sectionTitle}>
                  Help write the Data Annotation Playbook the community needs.
                </Heading>
                <p className={styles.cfcLead}>
                  The Masakhane community is developing a comprehensive, open,
                  community-driven <strong>Data Annotation Playbook</strong> for
                  high-quality datasets across diverse languages, domains, and
                  modalities. We invite researchers, practitioners, and
                  communities to submit chapter proposals — globally welcomed,
                  with a focus on African and low-resource language contexts.
                </p>
                <div className={styles.cfcMetaRow}>
                  <div className={styles.cfcMeta}>
                    <IconAward size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>$1,000</span>
                      <span className={styles.cfcMetaLabel}>Honorarium per chapter</span>
                    </div>
                  </div>
                  <div className={styles.cfcMeta}>
                    <IconLayers size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>3</span>
                      <span className={styles.cfcMetaLabel}>Modality areas</span>
                    </div>
                  </div>
                  <div className={styles.cfcMeta}>
                    <IconCheckCircle size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>2-stage</span>
                      <span className={styles.cfcMetaLabel}>Review process</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cfcActions}>
                <a
                  className={clsx('button', styles.primaryButton)}
                  href="mailto:afriannotate@gmail.com?subject=Chapter%20Proposal%20—%20AfricaNLP%20Playbook">
                  <IconMail size={18} /> Submit a proposal
                </a>
                <a
                  className={clsx('button', styles.secondaryButton)}
                  href="https://www.masakhane.io/"
                  target="_blank"
                  rel="noreferrer noopener">
                  <IconExternalLink size={18} /> Contact Masakhane
                </a>
              </div>
            </div>

            {/* Scope */}
            <div className={styles.cfcSubhead}>
              <Heading as="h2" className={styles.cfcSubheadTitle}>
                Scope of contributions
              </Heading>
              <p className={styles.cfcSubheadLead}>
                We welcome chapter proposals covering one or more data
                modalities. Submissions may focus on a single area or span
                multiple.
              </p>
            </div>
            <div className={styles.scopeGrid}>
              {SCOPE.map((s) => (
                <article key={s.name} className={styles.scopeCard}>
                  <div className={styles.scopeIconWrap}>
                    <s.icon size={28} />
                  </div>
                  <h3 className={styles.scopeName}>{s.name}</h3>
                  <p className={styles.scopeIntro}>{s.intro}</p>
                  <ul className={styles.scopeList}>
                    {s.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {/* Two-stage process */}
            <div className={styles.cfcSubhead}>
              <Heading as="h2" className={styles.cfcSubheadTitle}>
                Two-stage submission process
              </Heading>
            </div>
            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.processNum}>01</div>
                <div className={styles.processIcon}>
                  <IconFileText size={26} />
                </div>
                <h3 className={styles.processTitle}>Chapter proposal</h3>
                <p className={styles.processBody}>
                  Submit a short proposal (max 5 pages per chapter)
                  outlining the planned chapter contents, structure, and
                  your relevant experience. Multi-modality submissions
                  count separately.
                </p>
              </div>
              <div className={styles.processConnector} aria-hidden="true">
                <IconArrowRight size={28} />
              </div>
              <div className={styles.processStep}>
                <div className={styles.processNum}>02</div>
                <div className={styles.processIcon}>
                  <IconClipboardCheck size={26} />
                </div>
                <h3 className={styles.processTitle}>
                  Full chapter (upon acceptance)
                </h3>
                <p className={styles.processBody}>
                  Selected proposals are invited to develop the full
                  chapter following editorial guidelines. Final chapters
                  that meet the guidelines and align with the proposal are
                  published.
                </p>
              </div>
            </div>

            {/* Requirements + Evaluation */}
            <div className={styles.requirementsGrid}>
              <article className={styles.requirementsCard}>
                <div className={styles.requirementsHeader}>
                  <IconClipboardCheck size={22} />
                  <h3 className={styles.requirementsTitle}>
                    Proposal requirements
                  </h3>
                </div>
                <ul className={styles.requirementsList}>
                  {PROPOSAL_REQUIREMENTS.map((r) => (
                    <li key={r}>
                      <IconCheckCircle
                        size={18}
                        className={styles.requirementsBullet}
                      />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={styles.requirementsCard}>
                <div className={styles.requirementsHeader}>
                  <IconShieldCheck size={22} />
                  <h3 className={styles.requirementsTitle}>
                    Evaluation criteria
                  </h3>
                </div>
                <ul className={styles.requirementsList}>
                  {EVALUATION_CRITERIA.map((r) => (
                    <li key={r}>
                      <IconCheckCircle
                        size={18}
                        className={styles.requirementsBullet}
                      />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            {/* Expectations */}
            <div className={styles.cfcSubhead}>
              <Heading as="h2" className={styles.cfcSubheadTitle}>
                Expectations for accepted chapters
              </Heading>
              <p className={styles.cfcSubheadLead}>
                Chapters should prioritize clarity, usability, and
                reproducibility, and follow best practices over purely
                theoretical discussion.
              </p>
            </div>
            <div className={styles.expectationGrid}>
              {EXPECTATIONS.map((e) => (
                <div key={e.title} className={styles.expectationCard}>
                  <div className={styles.expectationIcon}>
                    <e.icon size={22} />
                  </div>
                  <h4 className={styles.expectationTitle}>{e.title}</h4>
                  <p className={styles.expectationBody}>{e.body}</p>
                </div>
              ))}
            </div>

            {/* Compensation banner */}
            <div className={styles.compBanner}>
              <div className={styles.compBannerIcon}>
                <IconAward size={36} />
              </div>
              <div className={styles.compBannerCopy}>
                <h3 className={styles.compBannerTitle}>
                  USD $1,000 honorarium per accepted chapter
                </h3>
                <p className={styles.compBannerBody}>
                  To support contributors, each accepted chapter receives
                  an honorarium of <strong>USD $1,000</strong>, paid after
                  the final chapter is submitted and meets the editorial
                  guidelines.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.cfcSubhead}>
              <Heading as="h2" className={styles.cfcSubheadTitle}>
                Timeline
              </Heading>
              <p className={styles.cfcSubheadLead}>
                Exact dates will be announced shortly. Subscribe to the
                AfricaNLP newsletter to be notified.
              </p>
            </div>
            <ol className={styles.timeline}>
              {TIMELINE.map((t, i) => (
                <li key={t.label} className={styles.timelineItem}>
                  <div className={styles.timelineDot}>
                    <t.icon size={18} />
                  </div>
                  <div className={styles.timelineCopy}>
                    <span className={styles.timelineStep}>Step {i + 1}</span>
                    <span className={styles.timelineLabel}>{t.label}</span>
                    <span className={styles.timelineDate}>{t.date}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.cfcFootnote}>
              <IconHeart size={20} className={styles.cfcFootnoteIcon} />
              <div>
                <strong>
                  A globally representative, openly licensed resource.
                </strong>{' '}
                Accepted chapters are released as open source on an
                interactive web platform for the community. We welcome
                diverse perspectives and experiences, and especially
                encourage interdisciplinary, community-based teams.
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
