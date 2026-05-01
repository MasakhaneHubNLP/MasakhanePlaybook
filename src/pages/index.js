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
import NEWS_DATA from '@site/src/data/news.json';
import COMMUNITIES_DATA from '@site/src/data/communities.json';
import { CardEditButton } from '@site/src/components/EditModal';
import editStyles from '@site/src/components/EditModal/index.module.css';

/* ── Icon map for news cards (icons stored as strings in JSON) ────────── */
const ICON_MAP = {
  users: IconUsers,
  megaphone: IconMegaphone,
  sparkles: IconSparkles,
  rocket: IconRocket,
};

/* ============================================================
   HERO
   ============================================================ */
function HeroSection() {
  const heroPhotoUrl = useBaseUrl('/img/hero.jpg');
  const haUrl = `pathname://${useBaseUrl('/ha/')}`;
  const amUrl = `pathname://${useBaseUrl('/am/')}`;
  const swUrl = `pathname://${useBaseUrl('/sw/')}`;
  const frUrl = `pathname://${useBaseUrl('/fr/')}`;
  const ptUrl = `pathname://${useBaseUrl('/pt/')}`;
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
            <p className={styles.heroLangs}>
              <span className={styles.heroLangsLabel}>Read this in:</span>{' '}
              <Link className={styles.heroLangLink} to={haUrl} hrefLang="ha">Hausa</Link>
              <span className={styles.heroLangSep} aria-hidden="true"> · </span>
              <Link className={styles.heroLangLink} to={amUrl} hrefLang="am">Amharic</Link>
              <span className={styles.heroLangSep} aria-hidden="true"> · </span>
              <Link className={styles.heroLangLink} to={swUrl} hrefLang="sw">Swahili</Link>
              <span className={styles.heroLangSep} aria-hidden="true"> · </span>
              <Link className={styles.heroLangLink} to={frUrl} hrefLang="fr">Français</Link>
              <span className={styles.heroLangSep} aria-hidden="true"> · </span>
              <Link className={styles.heroLangLink} to={ptUrl} hrefLang="pt">Português</Link>
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
   STATS
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
          {NEWS_DATA.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || IconSparkles;
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

            const card = item.href ? (
              <Link
                key={item.id}
                to={item.href}
                className={clsx(styles.newsCard, styles.newsCardLink)}
              >
                {Inner}
              </Link>
            ) : (
              <article key={item.id} className={styles.newsCard}>
                {Inner}
              </article>
            );

            return (
              <div key={item.id} className={clsx(styles.newsCard, editStyles.cardWrap)} style={{padding: 0}}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className={clsx(styles.newsCard, styles.newsCardLink)}
                    style={{display: 'flex', flexDirection: 'column', height: '100%'}}
                  >
                    {Inner}
                  </Link>
                ) : (
                  <article
                    className={styles.newsCard}
                    style={{height: '100%'}}
                  >
                    {Inner}
                  </article>
                )}
                <CardEditButton
                  mode="news"
                  filePath="src/data/news.json"
                  itemId={item.id}
                  itemData={item}
                  pageTitle={item.title}
                />
              </div>
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
   FAQ
   ============================================================ */
const FAQ = [
  {
    q: 'Is the Playbook free to use?',
    a: (
      <>
        Yes — entirely. The Playbook content is community-maintained and
        openly licensed, and the Masakhane Tool annotation platform is
        Apache 2.0. There is no closed version, no paid tier, no commercial
        fork.
      </>
    ),
  },
  {
    q: 'Can I contribute a chapter?',
    a: (
      <>
        Yes, contributions are very welcome. The recommended flow is to open
        an issue with a chapter outline first, then write and submit a pull
        request. See the{' '}
        <a
          href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-contribute-a-chapter"
          target="_blank"
          rel="noreferrer noopener">
          step-by-step guide
        </a>{' '}
        in the README.
      </>
    ),
  },
  {
    q: 'How do I cite the Playbook?',
    a: (
      <>
        Every chapter page has a "Cite this page" link. The{' '}
        <Link to="/cite">citation page</Link> provides BibTeX, APA, MLA,
        Chicago, and a machine-readable <code>CITATION.cff</code>. If you
        cite a specific chapter, please include the chapter title and URL.
      </>
    ),
  },
  {
    q: 'Is the Masakhane Tool deployable on-prem?',
    a: (
      <>
        Yes. The Tool is Apache 2.0 licensed and ships as a Progressive Web
        App, so you can self-host on any machine that serves static files
        and a backend, install it on a phone for offline use, or deploy it
        inside an institutional network. Pilot deployments are running at
        Bayero University and Bahir Dar University ICT4D.
      </>
    ),
  },
  {
    q: 'Which African languages are supported?',
    a: (
      <>
        The site UI is translated into 6 languages — English, Hausa,
        Amharic, Swahili, French, and Portuguese — with chapter content
        gradually following. The Tool itself supports any African language
        through Unicode, with virtual keyboards and localised UI strings.
      </>
    ),
  },
  {
    q: 'How can I get involved?',
    a: (
      <>
        Join the conversation on{' '}
        <a
          href="https://discord.gg/ChNPHV2PPS"
          target="_blank"
          rel="noreferrer noopener">
          Discord
        </a>
        , subscribe to the{' '}
        <Link to="/newsletter">AfricaNLP Newsletter</Link>, or open an issue
        or pull request on{' '}
        <a
          href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook"
          target="_blank"
          rel="noreferrer noopener">
          GitHub
        </a>
        . If you'd like to lead a chapter, see the open Call for Chapter
        Development Proposals.
      </>
    ),
  },
];

function FAQSection() {
  return (
    <section className={clsx(styles.section, styles.altSection)}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>FAQ</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Frequently asked
          </Heading>
        </div>
        <div className={styles.faqList}>
          {FAQ.map(({q, a}) => (
            <details key={q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{q}</summary>
              <p className={styles.faqAnswer}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMMUNITIES
   ============================================================ */
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
          {COMMUNITIES_DATA.map((c) => (
            <div key={c.id} className={clsx(styles.communityCard, editStyles.cardWrap)}>
              <a
                className={styles.communityCard}
                href={c.url}
                target="_blank"
                rel="noreferrer noopener"
                style={{display: 'block'}}
              >
                <h3 className={styles.communityName}>{c.name}</h3>
                <p className={styles.communityRole}>{c.role}</p>
                <span className={styles.communityArrow}>
                  <IconExternalLink size={18} />
                </span>
              </a>
              <CardEditButton
                mode="community"
                filePath="src/data/communities.json"
                itemId={c.id}
                itemData={c}
                pageTitle={c.name}
              />
            </div>
          ))}
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
        <FAQSection />
        <CommunitiesSection />
      </main>
    </Layout>
  );
}
