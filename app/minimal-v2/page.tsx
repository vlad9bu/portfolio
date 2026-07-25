import type { Metadata } from "next";
import { MotionController } from "../minimal/MinimalMotion";
import styles from "../minimal/minimal.module.css";

export const metadata: Metadata = {
  title: "Vlad Budko — Minimal Focus Edition",
  description:
    "A focused founder profile for Vlad Budko, Co-founder and CEO of GrowKong Group.",
  alternates: {
    canonical: "/minimal-v2",
  },
  openGraph: {
    type: "profile",
    title: "Vlad Budko — Minimal Focus Edition",
    description:
      "Founder-operator building GrowKong Group and the systems around it.",
    images: [
      {
        url: "/og-minimal.png",
        width: 1734,
        height: 907,
        alt: "Vlad Budko — Founder / Operator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vlad Budko — Minimal Focus Edition",
    description:
      "Founder-operator building GrowKong Group and the systems around it.",
    images: ["/og-minimal.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const capabilities = [
  {
    code: "01",
    title: "Product creation",
    label: "From problem to operation",
    description:
      "I turn focused opportunities we identify inside the group into working software, then build the operating structure required to make the product real.",
    proof: "Working products, not decks.",
  },
  {
    code: "02",
    title: "Distribution",
    label: "Demand as infrastructure",
    description:
      "I treat distribution as part of the product system. GrowKong is building creator-powered demand into the group itself.",
    proof: "Distribution is designed in.",
  },
  {
    code: "03",
    title: "Operating systems",
    label: "Context that compounds",
    description:
      "I connect product, audience, revenue, and internal context so each operating cycle improves the next decision.",
    proof: "The system keeps the learning.",
  },
  {
    code: "04",
    title: "Founder judgment",
    label: "Evidence over momentum",
    description:
      "I move quickly, but evidence decides what deserves to scale, what needs to change, and what should stop.",
    proof: "Motion is not progress.",
  },
];

const independentSystems = [
  {
    code: "01",
    name: "Arahaz",
    status: "Independent / Live",
    description:
      "A largely autonomous digital magazine launched in 2026, built around a high-automation editorial system.",
    href: "https://arahaz.com",
  },
  {
    code: "02",
    name: "Context OS",
    status: "Private / Daily use",
    description:
      "My personal AI operating system connecting calendar, projects, working context, and daily decisions.",
  },
];

export default function MinimalFocusEdition() {
  return (
    <main className={`${styles.page} minimal-page`}>
      <header className={styles.header}>
        <a href="#top" className={styles.monogram} aria-label="Back to top">
          VB
        </a>
        <nav aria-label="Minimal focus edition index">
          <a href="#now">Now</a>
          <a href="#capabilities">Practice</a>
          <a href="#record">Record</a>
          <a href="#systems">Systems</a>
          <a href="#decisions">Decisions</a>
        </nav>
        <div className={styles.headerActions}>
          <MotionController />
          <a href="/minimal" className={styles.edition}>
            V2 / Compare minimal ↗
          </a>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroMain}>
          <div className={styles.heroMeta} data-reveal>
            <span>Founder / Operator</span>
            <span>United States</span>
            <span>2026</span>
          </div>
          <h1 data-hero-title>
            <span>Vlad</span>
            <span>Budko.</span>
          </h1>
          <div className={styles.heroStatement} data-reveal>
            <p>Co-founder &amp; CEO of GrowKong Group.</p>
            <p>
              I build software companies by connecting product creation,
              distribution, operating systems, and founder judgment.
            </p>
          </div>
        </div>

        <figure className={styles.portrait} data-reveal data-tilt>
          <img
            src="/vlad-budko.jpg"
            alt="Vlad Budko"
            width="1500"
            height="1500"
            fetchPriority="high"
          />
          <figcaption>
            <span>Portrait / 01</span>
            <span>Founder profile</span>
          </figcaption>
        </figure>
      </section>

      <section className={styles.section} id="now">
        <div className={styles.sectionIndex} data-reveal>
          <span>01</span>
          <p>Now</p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.sectionHeading} data-reveal>
            <p>Current focus</p>
            <h2>One group. One operating system.</h2>
            <span>
              GrowKong is the current focus: a first-party system designed to
              build and distribute its own products, then keep the capital and
              learning inside the group.
            </span>
          </div>

          <a
            className={styles.focusGroup}
            href="https://group.growkong.com"
            target="_blank"
            rel="noreferrer"
            data-reveal
            data-press
          >
            <span className={styles.focusGroupCode}>Current / Building</span>
            <span className={styles.focusGroupLogo}>
              <img
                src="/brands/growkong-group.svg"
                alt=""
                width="70"
                height="70"
              />
            </span>
            <span className={styles.focusGroupIdentity}>
              <small>Company group · Operating system</small>
              <strong>GrowKong Group</strong>
            </span>
            <p>
              A closed, first-party company-building system. GrowKong builds and
              distributes its own products, grows the ones that earn traction,
              and keeps the resulting capital, data, and operating intelligence
              inside the group.
            </p>
            <b>Explore the group ↗</b>
          </a>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.darkSection}`}
        id="capabilities"
      >
        <div className={styles.sectionIndex} data-reveal>
          <span>02</span>
          <p>Practice</p>
        </div>
        <div className={styles.sectionBody}>
          <div
            className={`${styles.sectionHeading} ${styles.capabilityHeading}`}
            data-reveal
          >
            <p>How I build</p>
            <h2>The work sits at four intersections.</h2>
            <span>
              These are not service categories. They are the disciplines I use
              together while building companies.
            </span>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability) => (
              <article data-reveal key={capability.title}>
                <div>
                  <span>{capability.code}</span>
                  <small>{capability.label}</small>
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <strong>{capability.proof}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="record">
        <div className={styles.sectionIndex} data-reveal>
          <span>03</span>
          <p>Record</p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.recordIntro} data-reveal>
            <p>Before GrowKong</p>
            <h2>Built in Ukraine. Scaled with 22 people. Sold.</h2>
            <span>
              One e-commerce company worth keeping on the record.
            </span>
          </div>
          <div className={styles.metrics}>
            <article data-reveal>
              <strong>126K+</strong>
              <span>Customers</span>
            </article>
            <article data-reveal>
              <strong>$250K+</strong>
              <span>Annual revenue</span>
            </article>
            <article data-reveal>
              <strong>22</strong>
              <span>People</span>
            </article>
            <article data-reveal>
              <strong>9×</strong>
              <span>Daily-order growth</span>
            </article>
          </div>
          <p className={styles.outcome} data-reveal>
            <span>Outcome</span>
            Successful exit through an equity sale.
          </p>
        </div>
      </section>

      <section className={styles.section} id="systems">
        <div className={styles.sectionIndex} data-reveal>
          <span>04</span>
          <p>Systems</p>
        </div>
        <div className={styles.sectionBody}>
          <div
            className={`${styles.sectionHeading} ${styles.compactHeading}`}
            data-reveal
          >
            <p>Independent systems</p>
            <h2>Some tools exist outside the group.</h2>
            <span>
              They show how I think and operate, without competing with the
              main story.
            </span>
          </div>
          <div className={styles.compactSystemList}>
            {independentSystems.map((system) => {
              const content = (
                <>
                  <span>{system.code}</span>
                  <span>
                    <small>{system.status}</small>
                    <strong>{system.name}</strong>
                  </span>
                  <p>{system.description}</p>
                  <b aria-hidden="true">{system.href ? "↗" : "—"}</b>
                </>
              );

              return system.href ? (
                <a
                  href={system.href}
                  target="_blank"
                  rel="noreferrer"
                  data-reveal
                  data-press
                  key={system.name}
                >
                  {content}
                </a>
              ) : (
                <article data-reveal key={system.name}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.closedSection}`}
        id="decisions"
      >
        <div className={styles.sectionIndex} data-reveal>
          <span>05</span>
          <p>Decisions</p>
        </div>
        <div className={styles.sectionBody}>
          <div
            className={`${styles.sectionHeading} ${styles.decisionHeading}`}
            data-reveal
          >
            <p>Decisions not to scale</p>
            <h2>Knowing when to stop is part of building.</h2>
            <span>
              Both projects produced real usage or revenue. The decision was
              not that nothing worked; it was that the underlying model was not
              durable enough to keep scaling.
            </span>
          </div>
          <div className={styles.closedList}>
            <article data-reveal>
              <span>01 / 130+ users</span>
              <h3>MyWhy</h3>
              <p>
                We expected stronger retention and believed the original model
                could support the product. Real usage showed high churn and
                introduced safety risks that were difficult to justify in an
                AI-led mental-health product. We decided not to keep scaling it.
              </p>
            </article>
            <article data-reveal>
              <span>02 / ≈ $4K MRR</span>
              <h3>Restaurant photography</h3>
              <p>
                The Miami operation proved that customers were willing to pay.
                But fulfillment depended too heavily on people and local
                variability, while the economics did not support predictable
                growth. We closed it instead of forcing an unstable model to
                scale.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.principle} data-principle>
        <span>Working principle / 2026</span>
        <blockquote data-reveal>
          Evidence over narratives.
          <br />
          Progress over motion.
        </blockquote>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>Vlad Budko</strong>
          <span>Co-founder &amp; CEO / GrowKong Group</span>
        </div>
        <div>
          <a href="mailto:vlad.b@growkong.com">Email</a>
          <a
            href="https://www.linkedin.com/in/vladyslav-budko/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
