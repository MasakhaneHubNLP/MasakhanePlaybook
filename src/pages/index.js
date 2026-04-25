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
  IconMail,
  IconArrowRight,
  IconExternalLink,
  IconNewspaper,
  IconSparkles,
  IconShieldCheck,
  IconHeart,
  IconRocket,
} from '@site/src/components/Icons';

/* ============================================================
   HERO
   ============================================================ */
function HeroSection() {
  const logo = useBaseUrl('/img/logo.svg');
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <IconSparkles size={14} /> AfricaNLP · Masakhane Hub
            </span>
            <Heading as="h1" className={styles.heroTitle}>
              Build African language datasets,<br />
              <span className={styles.heroTitleAccent}>the right way.</span>
            </Heading>
            <p className={styles.heroTagline}>
              An open playbook and annotation platform for grassroots NLP data
              collection  →  designed with communities, for communities, across
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
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5+</span>
                <span className={styles.statLabel}>African languages</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Data modalities</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Open source</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroOrb} />
            <div className={styles.heroBlob} />
            <div className={styles.heroLogoCircle}>
              <img src={logo} alt="" className={styles.heroLogo} />
            </div>
            <div className={clsx(styles.floatTag, styles.floatTagOne)}>
              <span className={styles.tagDot} /> Hausa · Amharic · Swahili
            </div>
            <div className={clsx(styles.floatTag, styles.floatTagTwo)}>
              <span className={styles.tagDot} /> Voice · Text · Image
            </div>
            <div className={clsx(styles.floatTag, styles.floatTagThree)}>
              <span className={styles.tagDot} /> Apache 2.0
            </div>
          </div>
        </div>
      </div>
    </header>
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
    <section className={clsx(styles.section, styles.featureRow)}>
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
          <Link className={clsx('button', styles.primaryButton)} to="/playbook/">
            <IconBookOpen size={18} /> Read the Playbook
          </Link>
        </div>
        <div className={styles.featureVisual}>
          <div className={styles.mockBrowser}>
            <div className={styles.mockBar}>
              <span /><span /><span />
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockSidebar}>
                <div className={styles.mockSidebarItem} />
                <div className={clsx(styles.mockSidebarItem, styles.mockSidebarActive)} />
                <div className={styles.mockSidebarItem} />
                <div className={styles.mockSidebarItem} />
                <div className={styles.mockSidebarItem} />
              </div>
              <div className={styles.mockContent}>
                <div className={styles.mockH1} />
                <div className={styles.mockLine} />
                <div className={styles.mockLine} />
                <div className={clsx(styles.mockLine, styles.mockLineShort)} />
                <div className={styles.mockH2} />
                <div className={styles.mockLine} />
                <div className={clsx(styles.mockLine, styles.mockLineShort)} />
                <div className={styles.mockCallout}>
                  <div className={styles.mockCalloutLine} />
                  <div className={clsx(styles.mockCalloutLine, styles.mockLineShort)} />
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
    <section className={clsx(styles.section, styles.featureRow, styles.altSection)}>
      <div className={clsx('container', styles.featureGrid, styles.featureGridReverse)}>
        <div className={styles.featureCopy}>
          <span className={styles.featureEyebrow}>
            <IconWrench size={14} /> The Annotation Tool
          </span>
          <Heading as="h2" className={styles.featureTitle}>
            An open, mobile-first, Progressive Web App for grassroots data collection.
          </Heading>
          <p className={styles.featureLead}>
            Adapted from Label Studio, our platform is built for the realities
            of African contexts → patchy connectivity, multiple scripts, and
            community-led annotation workflows.
          </p>
          <ul className={styles.featureList}>
            <li>Offline-first capture with background synchronization</li>
            <li>Speech, text, ranking, and multimodal annotation support</li>
            <li>Inter-annotator agreement (Fleiss' κ, Krippendorff's α) dashboards</li>
            <li>African-language localization and virtual keyboards</li>
            <li>Apache 2.0 licensed with a clear contributor agreement</li>
          </ul>
          <Link className={clsx('button', styles.primaryButton)} to="/tool">
            <IconWrench size={18} /> Explore the Tool
          </Link>
        </div>
        <div className={styles.featureVisual}>
          <div className={styles.mockPhone}>
            <div className={styles.mockPhoneNotch} />
            <div className={styles.mockPhoneScreen}>
              <div className={styles.mockPhoneHeader}>
                <div className={styles.mockPhoneTitle} />
                <div className={styles.mockPhoneAvatar} />
              </div>
              <div className={styles.mockTask}>
                <div className={styles.mockTaskLabel} />
                <div className={styles.mockWaveform}>
                  {Array.from({length: 28}).map((_, i) => (
                    <span key={i} style={{height: `${15 + ((i * 13) % 70)}%`}} />
                  ))}
                </div>
              </div>
              <div className={styles.mockChips}>
                <span className={styles.mockChip}>positive</span>
                <span className={clsx(styles.mockChip, styles.mockChipActive)}>neutral</span>
                <span className={styles.mockChip}>negative</span>
              </div>
              <div className={styles.mockSubmit}>Submit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ANNOUNCEMENTS
   ============================================================ */
const ANNOUNCEMENTS = [
  {
    icon: IconMail,
    title: 'Monthly AfricaNLP Newsletter',
    body: 'Subscribe for updates on best practices, milestones, and contributor opportunities across the African NLP community.',
  },
  {
    icon: IconRocket,
    title: 'Pilot deployments',
    body: 'The annotation platform will first roll out at Bayero University and Bahir Dar University (ICT4D) for testing and validation before broader release.',
  },
  {
    icon: IconHeart,
    title: 'Open feedback channel',
    body: 'Built-in feedback mechanisms live inside the playbook so the community can shape its evolution release after release.',
  },
];

function AnnouncementsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <IconMegaphone size={14} /> Announcements
          </span>
          <Heading as="h2" className={styles.sectionTitle}>
            Stay in the loop
          </Heading>
        </div>
        <div className={styles.announcementGrid}>
          {ANNOUNCEMENTS.map((item) => (
            <div key={item.title} className={styles.announcementCard}>
              <div className={styles.announcementBadge}>
                <item.icon size={20} />
              </div>
              <div>
                <h3 className={styles.announcementTitle}>{item.title}</h3>
                <p className={styles.announcementBody}>{item.body}</p>
              </div>
            </div>
          ))}
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
    <section className={clsx(styles.section, styles.altSection)}>
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
   WHO WE ARE
   ============================================================ */
const PILLARS = [
  {
    icon: IconUsers,
    title: 'Multidisciplinary team',
    body: 'Researchers, tool developers, linguists, and legal experts with deep experience in African NLP → including authors of AfriSenti, NaijaSenti, AfriHate, BRIGHTER, and AmhEn.',
  },
  {
    icon: IconWrench,
    title: 'Proven open-source track record',
    body: 'The team builds and maintains widely used annotation tools → WebAnno (top-rated in a major systematic review), CodeAnno, ActiveAnno, Label Studio and Potato annotation tool platforms.',
  },
  {
    icon: IconHeart,
    title: 'Gender-balanced leadership',
    body: 'Nearly 40% of collaborators are women, many holding PhDs in NLP and Data Science, with intentional design for inclusive recruitment, training, and governance.',
  },
  {
    icon: IconShieldCheck,
    title: 'Institutional anchors',
    body: 'Anchored at Bayero University, Bahir Dar University (ICT4D), and partner research networks → ensuring real-world deployment and long-term stewardship.',
  },
];

function WhoWeAreSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <IconSparkles size={14} /> Who we are
          </span>
          <Heading as="h2" className={styles.sectionTitle}>
            A coalition for African language AI
          </Heading>
          <p className={styles.sectionLead}>
            We are a multidisciplinary team building open infrastructure so
            that African languages are first-class citizens of modern AI →
            from grassroots data collection through to responsible model
            evaluation.
          </p>
        </div>
        <div className={styles.pillarGrid}>
          {PILLARS.map((p) => (
            <div key={p.title} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <p.icon size={24} />
              </div>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA BANNER
   ============================================================ */
function CTABanner() {
  return (
    <section className={styles.cta}>
      <div className={clsx('container', styles.ctaInner)}>
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to dive in?
        </Heading>
        <p className={styles.ctaText}>
          Start with the playbook to learn the methodology, or jump to the
          annotation tool to see what we are building together.
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
        <NewsSection />
        <FeaturePlaybook />
        <FeatureTool />
        <AnnouncementsSection />
        <CommunitiesSection />
        <WhoWeAreSection />
        <CTABanner />
      </main>
    </Layout>
  );
}
