import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import {
  IconBookOpen,
  IconWrench,
  IconMegaphone,
  IconUsers,
  IconArrowRight,
  IconExternalLink,
  IconNewspaper,
  IconSparkles,
  IconRocket,
} from '@site/src/components/Icons';

/* ============================================================
   HERO
   ============================================================ */
function HeroSection() {
  const heroPhotoUrl = useBaseUrl('/img/hero.jpg');
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Heading as="h1" className={styles.heroTitle}>
              Build African language datasets,
              {' '}
              <span className={styles.heroTitleAccent}>the right way.</span>
            </Heading>
            <p className={styles.heroTagline}>
              An open playbook and annotation platform for grassroots NLP data
              collection — designed with communities, for communities, across
              the continent.
            </p>
            <div className={styles.heroButtons}>
              <Link className={clsx('button', styles.primaryButton)} to="/playbook/">
                <IconBookOpen size={18} /> Read the Playbook
              </Link>
              <Link className={clsx('button', styles.secondaryButton)} to="/tool">
                <IconWrench size={18} /> Explore the Tool
              </Link>
            </div>
          </div>
          <div
            className={styles.heroPhoto}
            style={{backgroundImage: `url(${heroPhotoUrl})`}}
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   STATS — thin band of headline numbers between hero and news
   ============================================================ */
const STATS = [
  {value: '22+', label: 'Chapters'},
  {value: '6', label: 'Languages'},
  {value: '6', label: 'Partner communities'},
  {value: 'Apache 2.0', label: 'Open source'},
];

function StatsBand() {
  return (
    <section className={styles.statsBand} aria-label="By the numbers">
      <div className="container">
        <div className={styles.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   NEWS
   ============================================================ */
const NEWS = [
  {
    date: 'Q1 · 2026',
    tag: 'Workshop',
    title: 'Case-study workshop on low-resource annotation',
    body: 'Annotators, linguists, researchers, tool developers, and legal experts convene to surface challenges and mitigation strategies for African data work.',
    icon: IconUsers,
  },
  {
    date: 'Q2 · 2026',
    tag: 'Call for Chapters',
    title: 'Call for Chapter Development Proposals',
    body: 'Domain experts are invited to lead chapters across text, speech, and vision/multimodal annotation. USD $1,000 honorarium per accepted chapter.',
    icon: IconMegaphone,
    href: '/call-for-chapters',
  },
  {
    date: 'Aug 2–7 · 2026',
    tag: 'Indaba 2026',
    title: 'Workshop accepted at Deep Learning Indaba 2026',
    body: 'A 90-minute interactive showcase of the AfricaNLP Playbook and annotation platform — live demos, hands-on annotation tasks, and a community dialogue. Pan-Atlantic University, Lagos, Nigeria.',
    icon: IconSparkles,
    href: '/indaba-workshop',
  },
  {
    date: 'Q3 · 2026',
    tag: 'Release',
    title: 'First playbook release with 5 translated languages',
    body: 'A culturally contextualized, community-reviewed first version is published on Docusaurus with downloadable PDFs for offline use.',
    icon: IconRocket,
  },
];

function NewsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <IconNewspaper size={14} /> Latest News
          </span>
          <Heading as="h2" className={styles.sectionTitle}>
            What's happening in the project
          </Heading>
        </div>
        <div className={styles.newsGrid}>
          {NEWS.map((item, idx) => {
            const Icon = item.icon;
            const Inner = (
              <>
                <div className={clsx(styles.newsThumb, styles[`newsThumb${idx}`])}>
                  <span className={styles.newsThumbIcon}>
                    <Icon size={32} />
                  </span>
                  <span className={styles.newsThumbLabel}>{item.tag}</span>
                </div>
                <div className={styles.newsBody}>
                  <span className={styles.newsDate}>{item.date}</span>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  <p className={styles.newsExcerpt}>{item.body}</p>
                  {item.href && (
                    <span className={styles.newsReadMore}>
                      Read more <IconArrowRight size={16} />
                    </span>
                  )}
                </div>
              </>
            );
            if (item.href) {
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={clsx(styles.newsCard, styles.newsCardLink)}>
                  {Inner}
                </Link>
              );
            }
            return (
              <article key={item.title} className={styles.newsCard}>
                {Inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ============================================================
   FEATURE: PLAYBOOK
   ============================================================ */
function FeaturePlaybook() {
  return (
    <section className={clsx(styles.section, styles.altSection, styles.featureRow)}>
      <div className={clsx('container', styles.featureGrid)}>
        <div className={styles.featureCopy}>
          <span className={styles.featureEyebrow}>
            <IconBookOpen size={14} /> The Playbook
          </span>
          <Heading as="h2" className={styles.featureTitle}>
            A practical guide to dataset creation, written with the
            communities who use it.
          </Heading>
          <p className={styles.featureLead}>
            From task formulation and label schema design to consent forms,
            inter-annotator agreement, and sustainability → every chapter is
            built around real low-resource language scenarios.
          </p>
          <ul className={styles.featureList}>
            <li>Step-by-step guidelines, video demos, and quality checklists</li>
            <li>Voice, text, speech–text alignment, and translation chapters</li>
            <li>Templates for consent, licensing, and governance toolkits</li>
            <li>Translated into 5 African languages with community review</li>
          </ul>
        </div>
        <div className={styles.featureVisual}>
          <div className={styles.mockBrowser} aria-hidden="true">
            <div className={styles.mockBar}>
              <span /><span /><span />
              <div className={styles.mockUrl}>
                masakhane-playbook / annotation-design
              </div>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockSidebar}>
                <span className={styles.mockSidebarItem}>
                  <span className={styles.mockSidebarNum}>1</span>Introduction
                </span>
                <span className={styles.mockSidebarItem}>
                  <span className={styles.mockSidebarNum}>2</span>Data Collection
                </span>
                <span
                  className={clsx(
                    styles.mockSidebarItem,
                    styles.mockSidebarActive,
                  )}>
                  <span className={styles.mockSidebarNum}>3</span>Annotation Design
                </span>
                <span className={styles.mockSidebarItem}>
                  <span className={styles.mockSidebarNum}>4</span>Data Quality
                </span>
                <span className={styles.mockSidebarItem}>
                  <span className={styles.mockSidebarNum}>5</span>Modality Tasks
                </span>
                <span className={styles.mockSidebarItem}>
                  <span className={styles.mockSidebarNum}>6</span>Governance
                </span>
              </div>
              <div className={styles.mockContent}>
                <span className={styles.mockEyebrow}>Chapter 3</span>
                <h3 className={styles.mockH1}>
                  Annotation Design &amp; Workforce
                </h3>
                <p className={styles.mockPara}>
                  Inter-annotator agreement measures how consistently different
                  annotators produce the same labels — a critical signal for
                  guideline clarity.
                </p>
                <h4 className={styles.mockH2}>3.2 Cohen's kappa</h4>
                <div className={styles.mockFormula}>
                  κ = (P<sub>o</sub> − P<sub>e</sub>) / (1 − P<sub>e</sub>)
                </div>
                <div className={styles.mockCallout}>
                  <span className={styles.mockCalloutLabel}>TIP</span>
                  <p className={styles.mockCalloutText}>
                    Pilot with 50–100 items first to refine guidelines before
                    scaling annotation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURE: TOOL
   ============================================================ */
function FeatureTool() {
  return (
    <section className={clsx(styles.section, styles.featureRow, styles.showcaseSection)}>
      <div className={clsx('container', styles.featureGrid, styles.featureGridReverse)}>
        <div className={styles.featureCopy}>
          <span className={styles.featureEyebrow}>
            <IconWrench size={14} /> Masakhane Tool
          </span>
          <Heading as="h2" className={styles.featureTitle}>
            An open, mobile-first, Progressive Web App for grassroots data collection.
          </Heading>
          <p className={styles.featureLead}>
            Built for the realities of African contexts → patchy connectivity,
            multiple scripts, and community-led annotation workflows.
          </p>
          <ul className={styles.featureList}>
            <li>Offline-first capture with background synchronization</li>
            <li>Speech, text, ranking, and multimodal annotation support</li>
            <li>Inter-annotator agreement (Fleiss' κ, Krippendorff's α) dashboards</li>
            <li>African-language localization and virtual keyboards</li>
            <li>Apache 2.0 licensed with a clear contributor agreement</li>
          </ul>
        </div>
        <div className={styles.featureVisual}>
          <div className={styles.toolLifecycle}>
            <div className={styles.lifecycleStages} aria-hidden="true">
              <span className={styles.lifecycleStage}>
                <span className={styles.lifecycleStageNum}>1</span> Collect
              </span>
              <span className={styles.lifecycleConnector} />
              <span
                className={clsx(
                  styles.lifecycleStage,
                  styles.lifecycleStageActive,
                )}>
                <span className={styles.lifecycleStageNum}>2</span> Annotate
              </span>
              <span className={styles.lifecycleConnector} />
              <span className={styles.lifecycleStage}>
                <span className={styles.lifecycleStageNum}>3</span> Validate
              </span>
            </div>

            <div className={styles.mockStack} aria-hidden="true">
            {/* Back card — LLM Evaluation (Amharic) */}
            <div className={clsx(styles.mockPhone, styles.mockPhoneBack)}>
              <div className={styles.mockPhoneNotch} />
              <div className={styles.mockPhoneScreen}>
                <div className={styles.mockPhoneHeader}>
                  <div className={styles.mockPhoneBrand}>
                    <span className={styles.mockPhoneLogo}>𝓐</span>
                    <span className={styles.mockPhoneTitle}>MasakhaneTool</span>
                  </div>
                  <span className={styles.mockPhoneLangBadge}>AM</span>
                </div>
                <div className={styles.mockPhoneMeta}>
                  <span className={styles.mockMetaLabel}>
                    <span className={styles.mockMetaDot} /> LLM Evaluation
                  </span>
                  <span className={styles.mockMetaProgress}>12 / 300</span>
                </div>
                <div className={styles.mockChatBubble}>
                  <span className={styles.mockChatRole}>Prompt</span>
                  <p className={styles.mockChatText} lang="am">
                    ስለ ኢትዮጵያ በአማርኛ ጻፍ።
                  </p>
                </div>
                <div
                  className={clsx(
                    styles.mockChatBubble,
                    styles.mockChatBubbleModel,
                  )}>
                  <span className={styles.mockChatRole}>Model · gpt-4</span>
                  <p className={styles.mockChatText} lang="am">
                    ኢትዮጵያ በምስራቅ አፍሪካ የምትገኝ ጥንታዊ ሀገር ናት።
                  </p>
                </div>
                <div className={styles.mockSentimentLabel}>Quality</div>
                <div className={styles.mockChips}>
                  <span className={clsx(styles.mockChip, styles.mockChipActive)}>
                    <span className={styles.mockChipCheck}>✓</span> Accurate
                  </span>
                  <span className={styles.mockChip}>Fluent</span>
                  <span className={styles.mockChip}>Safe</span>
                </div>
                <div className={styles.mockStars}>
                  <span className={styles.mockStarFilled}>★</span>
                  <span className={styles.mockStarFilled}>★</span>
                  <span className={styles.mockStarFilled}>★</span>
                  <span className={styles.mockStarFilled}>★</span>
                  <span className={styles.mockStarEmpty}>★</span>
                  <span className={styles.mockStarsLabel}>4 / 5</span>
                </div>
              </div>
            </div>

            {/* Middle card — Named Entity Annotation (Swahili) */}
            <div className={clsx(styles.mockPhone, styles.mockPhoneMid)}>
              <div className={styles.mockPhoneNotch} />
              <div className={styles.mockPhoneScreen}>
                <div className={styles.mockPhoneHeader}>
                  <div className={styles.mockPhoneBrand}>
                    <span className={styles.mockPhoneLogo}>𝓐</span>
                    <span className={styles.mockPhoneTitle}>MasakhaneTool</span>
                  </div>
                  <span className={styles.mockPhoneLangBadge}>SW</span>
                </div>
                <div className={styles.mockPhoneMeta}>
                  <span className={styles.mockMetaLabel}>
                    <span className={styles.mockMetaDot} /> Named Entity Annotation
                  </span>
                  <span className={styles.mockMetaProgress}>132 / 500</span>
                </div>
                <div className={styles.mockNerCard}>
                  <p className={styles.mockNerText} lang="sw">
                    Rais{' '}
                    <mark className={clsx(styles.mockNerTag, styles.mockNerPer)}>
                      Samia Suluhu Hassan
                      <span className={styles.mockNerTagLabel}>PER</span>
                    </mark>{' '}
                    aliongea katika{' '}
                    <mark className={clsx(styles.mockNerTag, styles.mockNerLoc)}>
                      Dodoma
                      <span className={styles.mockNerTagLabel}>LOC</span>
                    </mark>
                    .
                  </p>
                </div>
                <div className={styles.mockSentimentLabel}>Entity type</div>
                <div className={styles.mockChips}>
                  <span className={clsx(styles.mockChip, styles.mockChipActive)}>
                    <span className={styles.mockChipCheck}>✓</span> Person
                  </span>
                  <span className={styles.mockChip}>Location</span>
                  <span className={styles.mockChip}>Org</span>
                  <span className={styles.mockChip}>Date</span>
                </div>
              </div>
            </div>

            {/* Front card — AfriSenti sentiment (Hausa) */}
            <div className={clsx(styles.mockPhone, styles.mockPhoneFront)}>
              <div className={styles.mockPhoneNotch} />
              <div className={styles.mockPhoneScreen}>
                <div className={styles.mockPhoneHeader}>
                  <div className={styles.mockPhoneBrand}>
                    <span className={styles.mockPhoneLogo}>𝓐</span>
                    <span className={styles.mockPhoneTitle}>MasakhaneTool</span>
                  </div>
                  <span className={styles.mockPhoneLangBadge}>HA</span>
                </div>

                <div className={styles.mockPhoneMeta}>
                  <span className={styles.mockMetaLabel}>
                    <span className={styles.mockMetaDot} /> Sentiment Annotation
                  </span>
                  <span className={styles.mockMetaProgress}>47 / 500</span>
                </div>

                <article className={styles.mockTweetCard}>
                  <header className={styles.mockTweetHeader}>
                    <span className={styles.mockTweetAvatar}>A</span>
                    <span className={styles.mockTweetHandle}>@aiAfrika</span>
                    <span className={styles.mockTweetTime}>· 2h</span>
                  </header>
                  <p className={styles.mockTweetText} lang="ha">
                    Wannan littafin yana da matukar amfani! Ina ba da shawara
                    ga kowa ya karanta.
                  </p>
                  <p className={styles.mockTweetGloss}>
                    "This book is genuinely useful — I recommend it to everyone."
                  </p>
                </article>

                <div className={styles.mockSentimentLabel}>Sentiment</div>
                <div className={styles.mockChips}>
                  <span className={clsx(styles.mockChip, styles.mockChipActive)}>
                    <span className={styles.mockChipCheck}>✓</span> positive
                  </span>
                  <span className={styles.mockChip}>neutral</span>
                  <span className={styles.mockChip}>negative</span>
                </div>

                <div className={styles.mockBottomBar}>
                  <span className={styles.mockSkip}>Skip</span>
                  <span className={styles.mockSubmit}>Submit →</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMMUNITIES
   ============================================================ */
const COMMUNITIES = [
  {name: 'Masakhane', url: 'https://www.masakhane.io/', role: 'Long-term steward of the playbook and toolkit'},
  {name: 'EthioNLP', url: 'https://ethionlp.github.io/', role: 'Ethiopian NLP research and language coverage'},
  {name: 'HausaNLP', url: 'https://hausanlp.org/', role: 'Hausa NLP research and bot-based collection'},
  {name: 'Black in AI', url: 'https://blackinai.github.io/', role: 'Outreach and community amplification'},
  {name: 'Lanfrica', url: 'https://lanfrica.com/', role: 'Discoverability and knowledge sharing'},
  {name: 'Zindi Africa', url: 'https://zindi.africa/', role: 'Competition-driven, incentivized annotation'},
];

function CommunitiesSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <IconUsers size={14} /> Communities
          </span>
          <Heading as="h2" className={styles.sectionTitle}>
            Built with grassroots networks across Africa
          </Heading>
          <p className={styles.sectionLead}>
            Our work is grounded in long-running community collaborations.
            These networks shape the content, validate the methods, and
            sustain the resources beyond any single grant cycle.
          </p>
        </div>
        <div className={styles.communityGrid}>
          {COMMUNITIES.map((c) => (
            <a
              key={c.name}
              className={styles.communityCard}
              href={c.url}
              target="_blank"
              rel="noreferrer noopener">
              <h3 className={styles.communityName}>{c.name}</h3>
              <p className={styles.communityRole}>{c.role}</p>
              <span className={styles.communityArrow}>
                <IconExternalLink size={18} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA — closing band before the footer
   ============================================================ */
function FinalCTA() {
  return (
    <section className={styles.finalCTA}>
      <div className="container">
        <div className={styles.finalCTAInner}>
          <Heading as="h2" className={styles.finalCTATitle}>
            Ready to start?
          </Heading>
          <p className={styles.finalCTALead}>
            Read the Playbook to plan your dataset, then join the community
            on Discord to ask questions and share your work.
          </p>
          <div className={styles.finalCTAButtons}>
            <Link
              className={clsx('button', styles.finalCTAPrimary)}
              to="/playbook/">
              <IconBookOpen size={18} /> Read the Playbook
            </Link>
            <a
              className={clsx('button', styles.finalCTASecondary)}
              href="https://discord.gg/ChNPHV2PPS"
              target="_blank"
              rel="noreferrer noopener">
              <IconUsers size={18} /> Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — ${siteConfig.tagline}`}
      description="A community-driven playbook and open annotation infrastructure for African language data.">
      <HeroSection />
      <main>
        <StatsBand />
        <NewsSection />
        <FeaturePlaybook />
        <FeatureTool />
        <CommunitiesSection />
        <FinalCTA />
      </main>
    </Layout>
  );
}
