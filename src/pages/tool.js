import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {IconWrench, IconRocket} from '@site/src/components/Icons';
import styles from './tool.module.css';

export default function Tool() {
  return (
    <Layout
      title="Annotation Tool"
      description="Open Source and Culture-Oriented Annotation Tool for African Languages">
      <main className={styles.toolMain}>
        <div className="container">
          <div className={styles.placeholder}>
            <div className={styles.iconCircle}>
              <IconWrench size={36} />
            </div>
            <Heading as="h1" className={styles.title}>
              Annotation Tool
            </Heading>
            <p className={styles.tagline}>
              Open Infrastructure for Grassroots NLP Data Collection in
              African Languages
            </p>
            <div className={styles.comingSoon}>
              <span className={styles.badge}>
                <IconRocket size={14} /> Coming soon
              </span>
              <p>
                A specialized Progressive Web Application (PWA) for African
                language NLP data collection. The tool will support
                offline-first capture, mobile-friendly workflows, and African
                language localization.
              </p>
              <p>
                Documentation and live access will be linked here once the
                first release is available.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
