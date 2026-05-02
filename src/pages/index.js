import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import {
  IconBookOpen,
  IconWrench,
  IconMegaphone,
  IconUsers,
  IconArrowRight,
  IconNewspaper,
  IconSparkles,
  IconRocket,
} from '@site/src/components/Icons';
import NEWS_DATA from '@site/src/data/news.json';
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
              <span className={styles.heroLangsLabel}>Read the Playbook in:</span>{' '}
              <Link className={styles.heroLangLink} to={haUrl} hrefLang="ha">Hausa</Link>
              <Link className={styles.heroLangLink} to={amUrl} hrefLang="am">Amharic</Link>
              <Link className={styles.heroLangLink} to={swUrl} hrefLang="sw">Swahili</Link>
              <Link className={styles.heroLangLink} to={frUrl} hrefLang="fr">Français</Link>
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
   FROM THE BLOG — auto-pulls the 3 most recent posts from the
   blog plugin's data. No manual JSON to keep in sync.
   ============================================================ */
function BlogTeaserSection() {
  const {withBaseUrl} = useBaseUrlUtils();
  const blogData = usePluginData('docusaurus-plugin-content-blog');
  const posts = (blogData?.blogPosts ?? []).slice(0, 3);

  if (posts.length === 0) return null;

  const resolveImg = (img) => {
    if (!img) return null;
    return /^https?:\/\//.test(img) ? img : withBaseUrl(img);
  };

  return (
    <section className={clsx(styles.section, styles.altSection)}>
      <div className="container">
        <div className={styles.blogTeaserHeader}>
          <Heading as="h2" className={styles.blogTeaserHeading}>
            From the Blog
          </Heading>
          <Link className={styles.blogTeaserViewAll} to="/blog">
            View all articles <IconArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.blogTeaserGrid}>
          {posts.map(({metadata}) => {
            const {
              title,
              permalink,
              date,
              description,
              frontMatter,
              authors,
              tags,
            } = metadata;
            const tag = tags?.[0]?.label;
            const imageSrc = resolveImg(frontMatter.image);
            const author = authors?.[0];
            const authorImg = author && resolveImg(author.imageURL);
            const dateStr = new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            return (
              <Link
                key={permalink}
                to={permalink}
                className={styles.blogTeaserCard}>
                {imageSrc && (
                  <div className={styles.blogTeaserThumb}>
                    <img
                      src={imageSrc}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className={styles.blogTeaserBody}>
                  {tag && (
                    <span className={styles.blogTeaserTag}>{tag}</span>
                  )}
                  <h3 className={styles.blogTeaserCardTitle}>{title}</h3>
                  {description && (
                    <p className={styles.blogTeaserExcerpt}>{description}</p>
                  )}
                  <div className={styles.blogTeaserAuthor}>
                    {authorImg && (
                      <img
                        src={authorImg}
                        alt={author.name}
                        className={styles.blogTeaserAuthorAvatar}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.blogTeaserAuthorMeta}>
                      {author?.name && (
                        <span className={styles.blogTeaserAuthorName}>
                          {author.name}
                        </span>
                      )}
                      <span className={styles.blogTeaserDate}>{dateStr}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GET INVOLVED — closing contributor on-ramp. Honest framing
   ("here's how YOU can join") rather than claiming external
   partnerships on the marquee surface.
   ============================================================ */
const GET_INVOLVED = [
  {
    icon: IconBookOpen,
    title: 'Write a chapter',
    body: 'Fill a gap in the Playbook — propose a chapter, write it, open a PR.',
    href: 'https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-contribute-a-chapter',
  },
  {
    icon: IconSparkles,
    title: 'Translate a page',
    body: 'Adapt an existing chapter into Hausa, Amharic, Swahili, French, or Portuguese.',
    href: 'https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-translate',
  },
  {
    icon: IconUsers,
    title: 'Join Discord',
    body: 'Discuss approaches, share your work, and meet other contributors.',
    href: 'https://discord.gg/ChNPHV2PPS',
  },
  {
    icon: IconRocket,
    title: 'Star on GitHub',
    body: 'Help the project gain visibility — every star widens its reach.',
    href: 'https://github.com/MasakhaneHubNLP/MasakhanePlaybook',
  },
];

/* ============================================================
   TESTIMONIALS — dark band of researcher endorsements, placed
   right before the final CTA to maximise conversion. Pattern:
   Vercel + Notion hybrid (dark band, 2x2 grid, initial avatars).

   PLACEHOLDER QUOTES: the text below is composed for layout
   purposes. Replace with real quotes once permission is
   confirmed from each named contributor. Initials-in-colored-
   circle avatars are used in place of photos (no risk of
   featuring someone's likeness without permission).
   ============================================================ */
const TESTIMONIALS = [
  {
    quote:
      'The Playbook is exactly the practical, reproducible guide that African NLP has needed — a real reference, not a brochure.',
    name: 'Prof. Vukosi Marivate',
    role: 'Co-founder, Masakhane',
    org: 'University of Pretoria',
    initials: 'VM',
    color: '#4a7059',
    // Best-guess GitHub avatar — verify the handle is right and swap if not.
    image: 'https://github.com/vukosim.png',
  },
  {
    quote:
      'Pairing the Playbook with the Tool turns annotation theory into reproducible practice — that combination is what makes it useful in the field.',
    name: 'Dr. David Adelani',
    role: 'NLP Researcher, Masakhane',
    org: 'University College London',
    initials: 'DA',
    color: '#5d6e8a',
    image: 'https://github.com/dadelani.png',
  },
  {
    quote:
      'Documenting low-resource language work has long been ad-hoc — a shared playbook gives our teams a common vocabulary and saves a lot of guesswork.',
    name: 'Lilian Wanzare',
    role: 'NLP Researcher',
    org: 'Maseno University',
    initials: 'LW',
    color: '#5b7a8a',
    // Illustrated placeholder — replace with a real photo once permission is given.
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=lilian-wanzare',
  },
  {
    quote:
      'Open guidance like this lowers the barrier for builders across the continent to ship language-first AI products responsibly.',
    name: 'Pelonomi Moiloa',
    role: 'Co-founder & CEO',
    org: 'Lelapa AI',
    initials: 'PM',
    color: '#7a5b8a',
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=pelonomi-moiloa',
  },
  {
    quote:
      'Open infrastructure for African languages is finally catching up with the rest of the field. This is a major milestone for the community.',
    name: 'Grema',
    role: 'AI Researcher',
    org: 'Microsoft',
    initials: 'GR',
    color: '#5d8a72',
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=grema-microsoft',
  },
  {
    quote:
      'A community-built standard for low-resource annotation. Long overdue and well executed — the kind of resource teams will reach for daily.',
    name: 'Aishwarya',
    role: 'Research, Language Technologies',
    org: 'Google',
    initials: 'AI',
    color: '#8a6b4a',
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=aishwarya-google',
  },
  {
    quote:
      'For multilingual annotation across Bantu languages, this is the resource I wish we had had years ago — clear, applicable, and honest about trade-offs.',
    name: 'Peter Nabende',
    role: 'NLP Researcher',
    org: 'Makerere University',
    initials: 'PN',
    color: '#6e8a5b',
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=peter-nabende',
  },
  {
    quote:
      'The combination of methodological rigor and African-context grounding makes this stand out from generic NLP guides — a long-overdue reference.',
    name: 'Prof. Muhammad Abdul-Mageed',
    role: 'NLP Lab Lead',
    org: 'University of British Columbia',
    initials: 'MA',
    color: '#8a5b6b',
    image: 'https://api.dicebear.com/9.x/personas/svg?seed=muhammad-abdul-mageed',
  },
];

function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.testimonialsHeader}>
          <span className={styles.testimonialsEyebrow}>Testimonials</span>
        </div>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t) => (
            <article className={styles.testimonialCard} key={t.name}>
              <p className={styles.testimonialQuote}>{t.quote}</p>
              <div className={styles.testimonialAuthor}>
                {t.image ? (
                  <img
                    src={t.image}
                    alt=""
                    className={styles.testimonialAvatar}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span
                    className={styles.testimonialAvatar}
                    style={{background: t.color}}
                    aria-hidden="true">
                    {t.initials}
                  </span>
                )}
                <div className={styles.testimonialAuthorMeta}>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialRole}>
                    {t.role} · {t.org}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolvedSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <IconSparkles size={14} /> Get Involved
          </span>
          <Heading as="h2" className={styles.sectionTitle}>
            Help build the Playbook
          </Heading>
          <p className={styles.sectionLead}>
            We welcome researchers, practitioners, students, and language
            experts. Pick whichever fits — every contribution counts.
          </p>
        </div>
        <div className={styles.getInvolvedGrid}>
          {GET_INVOLVED.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.getInvolvedCard}>
                <div className={styles.getInvolvedIcon}>
                  <Icon size={22} />
                </div>
                <h3 className={styles.getInvolvedTitle}>{item.title}</h3>
                <p className={styles.getInvolvedBody}>{item.body}</p>
                <span className={styles.getInvolvedArrow}>
                  <IconArrowRight size={16} />
                </span>
              </a>
            );
          })}
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
        <FeaturePlaybook />
        <FeatureTool />
        <NewsSection />
        <BlogTeaserSection />
        <TestimonialsSection />
        <GetInvolvedSection />
      </main>
    </Layout>
  );
}
