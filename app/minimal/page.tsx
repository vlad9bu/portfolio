import type { Metadata } from "next";
import Link from "next/link";
import { ContextSystemCard, MotionController } from "./MinimalMotion";
import styles from "./minimal.module.css";

export const metadata: Metadata = {
  title: "Vlad Budko — Minimal Edition",
  description:
    "A minimal founder profile for Vlad Budko, Co-founder and CEO of GrowKong Group.",
  alternates: {
    canonical: "/minimal",
  },
  openGraph: {
    type: "profile",
    title: "Vlad Budko — Minimal Edition",
    description:
      "Founder-operator building GrowKong Group, products, distribution, and operating systems.",
    images: [
      {
        url: "/og-minimal.png",
        width: 1734,
        height: 907,
        alt: "Vlad Budko — Founder / Operator, Minimal Edition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vlad Budko — Minimal Edition",
    description:
      "Founder-operator building GrowKong Group, products, distribution, and operating systems.",
    images: ["/og-minimal.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

type OperatingLayer = {
  code: string;
  name: string;
  role: string;
  status: string;
  description: string;
  logo: string;
  href?: string;
};

const operatingLayers: OperatingLayer[] = [
  {
    code: "01",
    name: "GrowKong Group",
    role: "Company group",
    status: "Building",
    description:
      "The parent system combining product creation, creator-powered distribution, and shared operating infrastructure.",
    logo: "/brands/growkong-group.svg",
    href: "https://group.growkong.com",
  },
  {
    code: "02",
    name: "GrowKong Network",
    role: "Distribution",
    status: "Registration open",
    description:
      "A creator network designed to take first-party products to market. More than 100 people are waiting to join.",
    logo: "/brands/growkong-network.svg",
    href: "https://growkong.com",
  },
  {
    code: "03",
    name: "GrowKong Foundry",
    role: "Product creation",
    status: "In development",
    description:
      "The next layer: a foundry for turning focused customer problems into working software and independent businesses.",
    logo: "/brands/growkong-foundry.svg",
  },
];

const products = [
  {
    code: "04",
    name: "PinPinMe",
    detail: "Pinterest-first content software",
    href: "https://pinpinme.com",
    logo: "/brands/pinpinme.svg",
  },
  {
    code: "05",
    name: "NoSweatKing",
    detail: "Real-time AI interview copilot",
    href: "https://nosweatking.com",
    logo: "/brands/nosweatking.svg",
  },
];

function LayerRow({ layer }: { layer: OperatingLayer }) {
  const content = (
    <>
      <span className={styles.layerCode}>{layer.code}</span>
      <span className={styles.layerLogo}>
        <img src={layer.logo} alt="" width="42" height="42" />
      </span>
      <span className={styles.layerIdentity}>
        <small>{layer.role}</small>
        <strong>{layer.name}</strong>
      </span>
      <span className={styles.layerDescription}>{layer.description}</span>
      <span className={styles.layerStatus}>
        <i />
        {layer.status}
      </span>
      <span className={styles.layerArrow} aria-hidden="true">
        {layer.href ? "↗" : "—"}
      </span>
    </>
  );

  if (layer.href) {
    return (
      <a
        className={styles.layer}
        href={layer.href}
        target="_blank"
        rel="noreferrer"
        data-reveal
        data-press
      >
        {content}
      </a>
    );
  }

  return (
    <article className={styles.layer} data-reveal>
      {content}
    </article>
  );
}

export default function MinimalEdition() {
  return (
    <main className={`${styles.page} minimal-page`}>
      <header className={styles.header}>
        <a href="#top" className={styles.monogram} aria-label="Back to top">
          VB
        </a>
        <nav aria-label="Minimal edition index">
          <a href="#now">Now</a>
          <a href="#systems">Systems</a>
          <a href="#record">Record</a>
          <a href="#closed">Closed</a>
        </nav>
        <div className={styles.headerActions}>
          <MotionController />
          <Link href="/" className={styles.edition}>
            Edition B / View original ↗
          </Link>
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
              I build software companies and the systems around them: products,
              distribution, and the operating layer connecting both.
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
            <p>Current operating system</p>
            <h2>GrowKong is the work.</h2>
            <span>
              A group built around a simple loop: build products, distribute
              them, learn from real demand, and compound what works.
            </span>
          </div>

          <div className={styles.layerList}>
            {operatingLayers.map((layer) => (
              <LayerRow layer={layer} key={layer.name} />
            ))}
          </div>

          <div className={styles.productHeader} data-reveal>
            <span>Products in market</span>
            <span>First-party software</span>
          </div>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <a
                href={product.href}
                target="_blank"
                rel="noreferrer"
                className={styles.product}
                key={product.name}
                data-reveal
                data-press
              >
                <span>{product.code}</span>
                <img src={product.logo} alt="" width="48" height="48" />
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.detail}</small>
                </span>
                <i>Live</i>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.darkSection}`}
        id="systems"
      >
        <div className={styles.sectionIndex} data-reveal>
          <span>02</span>
          <p>Systems</p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.systemsGrid}>
            <a
              className={styles.systemCard}
              href="https://arahaz.com"
              target="_blank"
              rel="noreferrer"
              data-reveal
              data-tilt
              data-press
            >
              <span>Independent / Live</span>
              <h2>Arahaz</h2>
              <p>
                A largely autonomous digital magazine launched in 2026,
                publishing practical guides through a high-automation editorial
                system.
              </p>
              <b aria-hidden="true">↗</b>
            </a>
            <ContextSystemCard />
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

      <section
        className={`${styles.section} ${styles.closedSection}`}
        id="closed"
      >
        <div className={styles.sectionIndex} data-reveal>
          <span>04</span>
          <p>Closed</p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.closedHeading} data-reveal>
            <p>Bad decisions, owned plainly.</p>
            <h2>I got these wrong.</h2>
          </div>
          <div className={styles.closedList}>
            <article data-reveal>
              <span>01 / 130+ users</span>
              <h3>MyWhy AI Therapist</h3>
              <p>
                I chose the wrong business model, underestimated churn, and
                misjudged the safety risk of putting AI this close to mental
                health decisions. I shut it down.
              </p>
            </article>
            <article data-reveal>
              <span>02 / ≈ $4K MRR</span>
              <h3>Restaurant photography</h3>
              <p>
                I got the unit economics wrong and built a Miami operation that
                depended too heavily on unpredictable people and revenue. It
                made money, but it was not durable. I shut it down.
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
