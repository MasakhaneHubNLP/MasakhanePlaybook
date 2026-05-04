import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {IconUsers, IconRocket} from '@site/src/components/Icons';
import styles from './about.module.css';

export default function About() {
  return (
    <Layout
      title="About Us"
      description="The community behind the Masakhane Playbook and annotation tools for African languages">
      <main className={styles.aboutMain}>
        <div className="container">
          <div className={styles.placeholder}>
            <div className={styles.iconCircle}>
              <IconUsers size={36} />
            </div>
            <Heading as="h1" className={styles.title}>
              About Us
            </Heading>
            <p className={styles.tagline}>
              A pan-African research community building open language
              resources — together, in the languages that matter.
            </p>
            <div className={styles.comingSoon}>
              <span className={styles.badge}>
                <IconRocket size={14} /> Coming soon
              </span>
              <p>
                This page will introduce the researchers, linguists, and
                community members behind the Masakhane Playbook and
                annotation tools — spanning universities, NLP labs, and
                grassroots language communities across Africa.
              </p>
              <p>
                You will find team bios, institutional affiliations,
                contributor acknowledgements, and the story of how this
                initiative came together.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
