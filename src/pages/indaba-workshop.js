import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import {
  IconBookOpen,
  IconWrench,
  IconSparkles,
  IconUsers,
  IconLayers,
  IconCalendar,
  IconMapPin,
  IconClock,
  IconCheckCircle,
  IconClipboardCheck,
  IconAward,
  IconMail,
  IconExternalLink,
  IconHeart,
} from '@site/src/components/Icons';

const OBJECTIVES = [
  'Introduce and demonstrate the AfricaNLP Playbook and annotation platform.',
  'Hands-on exploration to evaluate usability, accessibility, and relevance for African NLP needs.',
  'Test real-world annotation tasks across text, speech, and machine translation.',
  'Create space for community feedback, needs assessment, and collaborative co-design.',
  'Build bridges between language communities, researchers, practitioners, and tool developers.',
  'Raise awareness so the wider community is prepared to adopt and deploy these tools.',
  'Establish a community of interest that continues testing, refining, and contributing.',
  'Identify missing chapters, feature requests, and long-term collaboration opportunities.',
];

const AGENDA = [
  {
    duration: '5 min',
    title: 'Opening',
    body: 'Welcome, purpose of the session, and context.',
    icon: IconSparkles,
  },
  {
    duration: '15 min',
    title: 'Part 1 · Demo of the AfricaNLP Playbook',
    body: 'Overview of chapters (text, speech, MT, governance, sustainability), interactive modules, templates and videos, plus how communities can contribute new chapters or updates.',
    icon: IconBookOpen,
  },
  {
    duration: '15 min',
    title: 'Part 2 · Demo of the Annotation Platform',
    body: 'Mobile-first PWA, offline mode, multilingual support; text, speech and MT annotation workflows; contributor management, dashboards, and quality-control features.',
    icon: IconWrench,
  },
  {
    duration: '15 min',
    title: 'Part 3 · Hands-On Exploration',
    body: 'Participants work in small groups: try annotation tasks (voice, text, MT), test the Playbook’s guidelines and templates, try mobile offline mode, and provide live feedback.',
    icon: IconClipboardCheck,
  },
  {
    duration: '15 min',
    title: 'Part 4 · Community Dialogue',
    body: '“What is missing for African NLP?” — missing Playbook chapters, needed platform features, African language challenges, and ideas for long-term community involvement.',
    icon: IconUsers,
  },
  {
    duration: '5 min',
    title: 'Closing & Next Steps',
    body: 'Summary of insights, invitation to join pilot deployments and long-term testing, and follow-up channels (GitHub, mailing list, social platforms).',
    icon: IconHeart,
  },
];

const OUTCOMES = [
  {
    icon: IconSparkles,
    title: 'Awareness',
    body: 'Awareness of two major open-source African NLP infrastructure tools.',
  },
  {
    icon: IconBookOpen,
    title: 'Practical knowledge',
    body: 'How to use the playbook and platform for your own projects.',
  },
  {
    icon: IconLayers,
    title: 'Contribution paths',
    body: 'Clear pathways to contribute new chapters, translations, or platform features.',
  },
  {
    icon: IconClipboardCheck,
    title: 'Hands-on experience',
    body: 'Real annotation tasks across text, speech, and machine translation.',
  },
  {
    icon: IconUsers,
    title: 'Shared understanding',
    body: 'A view of the African community’s needs for data creation.',
  },
  {
    icon: IconCheckCircle,
    title: 'Live feedback log',
    body: 'A compiled list of feedback, feature requests, and priority use cases.',
  },
];

const AUDIENCE = [
  'African NLP researchers and students',
  'Linguists and language community leaders',
  'Annotators and dataset creators',
  'MT, speech, conversational AI, and text processing practitioners',
  'NGOs, civic tech groups, and digital rights advocates',
  'Developers and HCI designers',
  'Anyone interested in ethical, sustainable African language tech',
];

function initials(name) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const ORGANIZERS = [
  {name: 'Seid Muhie Yimam', affiliation: 'University of Hamburg · Bahir Dar University'},
  {name: 'Shamsuddeen Hassan Muhammad', affiliation: 'Bayero University Kano'},
  {name: 'Idris Abdulmumin', affiliation: 'University of Pretoria'},
  {name: 'Abinew Ali Ayele', affiliation: 'Bahir Dar University'},
  {name: 'Tadesse Destaw Belay', affiliation: 'IPN'},
  {name: 'Ibrahim Said Ahmad', affiliation: 'University of Wisconsin–Stevens Point'},
];

export default function IndabaWorkshop() {
  return (
    <Layout
      title="Workshop at Deep Learning Indaba 2026"
      description="An interactive showcase of the AfricaNLP Playbook and annotation platform at Deep Learning Indaba 2026, Lagos, Nigeria.">
      <main className={styles.idbPage}>
        {/* Hero */}
        <section className={styles.idbHero}>
          <div className={clsx('container', styles.idbHeroInner)}>
            <Link to="/" className={styles.cfcBackLink}>
              ← Back to home
            </Link>

            <div className={styles.cfcHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  <IconSparkles size={14} /> Indaba 2026 · Workshop
                </span>
                <Heading as="h1" className={styles.sectionTitle}>
                  AfricaNLP Playbook & Annotation Platform → <span className={styles.heroTitleAccent}> accepted at Deep Learning Indaba 2026.</span>
                </Heading>
                <p className={styles.cfcLead}>
                  This session presents two major community-oriented
                  infrastructure projects for African NLP: the{' '}
                  <strong>AfricaNLP Dataset Creation Playbook</strong> and an
                  open, mobile-first <strong>annotation platform</strong>{' '}
                  tailored for low-resource African language contexts. Funded
                  by the Masakhane African Languages Hub, the session is
                  designed to democratize data creation, support grassroots
                  language communities, and strengthen the foundation for
                  African AI research.
                </p>
                <div className={styles.cfcMetaRow}>
                  <div className={styles.cfcMeta}>
                    <IconCalendar size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>Aug 2–7, 2026</span>
                      <span className={styles.cfcMetaLabel}>Event dates</span>
                    </div>
                  </div>
                  <div className={styles.cfcMeta}>
                    <IconMapPin size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>Lagos, Nigeria</span>
                      <span className={styles.cfcMetaLabel}>Pan-Atlantic University</span>
                    </div>
                  </div>
                  <div className={styles.cfcMeta}>
                    <IconClock size={22} className={styles.cfcMetaIcon} />
                    <div>
                      <span className={styles.cfcMetaNum}>1.5 hours</span>
                      <span className={styles.cfcMetaLabel}>Showcase &amp; interactive exhibition</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.cfcActions}>
                <a
                  className={clsx('button', styles.primaryButton)}
                  href="https://deeplearningindaba.com/2026/"
                  target="_blank"
                  rel="noreferrer noopener">
                  <IconExternalLink size={18} /> Visit Indaba 2026
                </a>
                <a
                  className={clsx('button', styles.secondaryButton)}
                  href="mailto:afriannotate@gmail.com?subject=Indaba%202026%20Workshop">
                  <IconMail size={18} /> Contact organizers
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Motivation */}
        <section className={styles.idbMotivation}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Motivation
              </Heading>
            </div>
            <p className={styles.idbProse}>
              High-quality, community-owned datasets remain one of the
              largest bottlenecks in African NLP. While research interest
              has grown, many communities still lack accessible tools,
              clear workflows, or governance models for ethical,
              large-scale, multilingual data creation. Indaba is an ideal
              venue to expose these tools to the African AI community,
              gather feedback, and collaboratively shape their next
              iterations as we approach launch.
            </p>
          </div>
        </section>

        {/* Objectives */}
        <section className={styles.idbObjectives}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Session objectives
              </Heading>
            </div>
            <ul className={styles.objectivesList}>
              {OBJECTIVES.map((o) => (
                <li key={o}>
                  <IconCheckCircle size={20} className={styles.requirementsBullet} />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Agenda */}
        <section className={styles.idbAgenda}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Agenda
              </Heading>
              <p className={styles.idbSubheadLead}>
                A 90-minute showcase and interactive exhibition. Format
                designed for participatory, hands-on engagement.
              </p>
            </div>
            <ol className={styles.agendaList}>
              {AGENDA.map((part, i) => (
                <li key={part.title} className={styles.agendaItem}>
                  <div className={styles.agendaIndex}>
                    <span className={styles.agendaNum}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.agendaDuration}>
                      <IconClock size={14} /> {part.duration}
                    </span>
                  </div>
                  <div className={styles.agendaIcon}>
                    <part.icon size={24} />
                  </div>
                  <div className={styles.agendaCopy}>
                    <h3 className={styles.agendaTitle}>{part.title}</h3>
                    <p className={styles.agendaBody}>{part.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Awards highlight */}
        <section className={styles.idbAwards}>
          <div className="container">
            <div className={styles.compBanner}>
              <div className={styles.compBannerIcon}>
                <IconAward size={36} />
              </div>
              <div className={styles.compBannerCopy}>
                <h3 className={styles.compBannerTitle}>
                  Three contributors awarded at the closing
                </h3>
                <p className={styles.compBannerBody}>
                  Three team members who actively engaged and showcased
                  real-world examples will receive a recognition award at
                  the end of the Indaba event.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expected outcomes */}
        <section className={styles.idbOutcomes}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Expected outcomes
              </Heading>
              <p className={styles.idbSubheadLead}>
                Participants leave with concrete tools, knowledge, and
                connections.
              </p>
            </div>
            <div className={styles.expectationGrid}>
              {OUTCOMES.map((o) => (
                <div key={o.title} className={styles.expectationCard}>
                  <div className={styles.expectationIcon}>
                    <o.icon size={24} />
                  </div>
                  <h4 className={styles.expectationTitle}>{o.title}</h4>
                  <p className={styles.expectationBody}>{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target audience */}
        <section className={styles.idbAudience}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Target audience
              </Heading>
              <p className={styles.idbSubheadLead}>
                No prior technical background is required.
              </p>
            </div>
            <ul className={styles.audienceList}>
              {AUDIENCE.map((a) => (
                <li key={a} className={styles.audienceChip}>
                  <IconUsers size={16} /> {a}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Organizers */}
        <section className={styles.idbOrganizers}>
          <div className="container">
            <div className={styles.idbSubhead}>
              <Heading as="h2" className={styles.idbSubheadTitle}>
                Organizing team
              </Heading>
              <p className={styles.idbSubheadLead}>
                Members of the two project teams funded by the Masakhane
                African Languages Hub, anchored at Bayero University Kano
                (BUK), Bahir Dar University (BDU), and partner
                institutions.
              </p>
            </div>
            <div className={styles.organizerGrid}>
              {ORGANIZERS.map((o) => (
                <div key={o.name} className={styles.organizerCard}>
                  <div className={styles.organizerAvatar}>{initials(o.name)}</div>
                  <div className={styles.organizerCopy}>
                    <h4 className={styles.organizerName}>{o.name}</h4>
                    <p className={styles.organizerAff}>{o.affiliation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footnote */}
        <section className={styles.idbFootnoteWrap}>
          <div className="container">
            <div className={styles.cfcFootnote}>
              <IconHeart size={22} className={styles.cfcFootnoteIcon} />
              <div>
                <strong>Join us in Lagos.</strong> If you're attending
                Indaba 2026 and would like to collaborate on the playbook
                or annotation tool, reach out before the event so we can
                plan focused conversations during the hands-on exploration.
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
