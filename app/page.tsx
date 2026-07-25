type Venture = {
  name: string;
  code: string;
  label: string;
  status: string;
  href: string;
  logo: string;
  description: string;
  tone: string;
  linkLabel: string;
};

const groupCompanies: Venture[] = [
  {
    name: "GrowKong Group",
    code: "01",
    label: "COMPANY GROUP · OPERATING SYSTEM",
    status: "Building now",
    href: "https://group.growkong.com",
    logo: "/brands/growkong-group.svg",
    description:
      "A company group combining product creation, creator-powered distribution, and shared operating infrastructure.",
    tone: "group",
    linkLabel: "View group",
  },
  {
    name: "GrowKong Network",
    code: "02",
    label: "CREATOR NETWORK · DISTRIBUTION",
    status: "Registration open",
    href: "https://growkong.com",
    logo: "/brands/growkong-network.svg",
    description:
      "The distribution layer of the group. Registrations are open, with more than 100 people already waiting to join.",
    tone: "network",
    linkLabel: "View network",
  },
];

const products: Venture[] = [
  {
    name: "PinPinMe",
    code: "04",
    label: "AI · SOCIAL SOFTWARE",
    status: "Live",
    href: "https://pinpinme.com",
    logo: "/brands/pinpinme.svg",
    description:
      "A Pinterest-first workspace for creating, scheduling, publishing, and improving content without the daily busywork.",
    tone: "violet",
    linkLabel: "View product",
  },
  {
    name: "NoSweatKing",
    code: "05",
    label: "AI · INTERVIEW SOFTWARE",
    status: "Live",
    href: "https://nosweatking.com",
    logo: "/brands/nosweatking.svg",
    description:
      "An AI interview copilot built to understand the question, use a candidate’s real context, and return an answer in about half a second.",
    tone: "gold",
    linkLabel: "View product",
  },
];

const contextLinks = [
  ["Calendar", "Time and commitments"],
  ["Projects", "Current work and decisions"],
  ["Context", "People, history, and constraints"],
  ["Assistant", "One operating layer"],
];

function VentureCard({ venture }: { venture: Venture }) {
  return (
    <a
      className={`venture-card ${venture.tone}`}
      href={venture.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="venture-card-top">
        <span>{venture.code}</span>
        <span className="status">
          <i />
          {venture.status}
        </span>
      </div>
      <div className="venture-identity">
        <div className="venture-logo">
          <img src={venture.logo} alt="" width="64" height="64" />
        </div>
        <p>{venture.label}</p>
        <h3>{venture.name}</h3>
      </div>
      <p className="venture-description">{venture.description}</p>
      <span className="venture-link">{venture.linkLabel} ↗</span>
    </a>
  );
}

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vlad Budko",
    jobTitle: "Co-founder & CEO",
    image: "https://vladbudko.com/vlad-budko.jpg",
    worksFor: {
      "@type": "Organization",
      name: "GrowKong Group",
      url: "https://group.growkong.com",
    },
    sameAs: [
      "https://www.linkedin.com/in/vladyslav-budko/",
      "https://group.growkong.com",
      "https://arahaz.com",
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Vlad Budko, back to top">
          VB
        </a>
        <nav aria-label="Page index">
          <a href="#now">Now</a>
          <a href="#systems">Systems</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#archive">Archive</a>
        </nav>
        <span className="edition">2026 / 01</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span>Vlad Budko</span>
            <span>Co-founder &amp; CEO</span>
          </div>
          <h1>
            I build software companies
            <span>and the systems around them.</span>
          </h1>
          <p className="hero-summary">
            Currently building GrowKong Group — products, distribution
            infrastructure, and the operating systems behind both.
          </p>
          <div className="hero-index" aria-label="Profile summary">
            <span>Founder-operator</span>
            <span>Product systems</span>
            <span>United States</span>
          </div>
        </div>

        <div className="hero-portrait" aria-label="Portrait of Vlad Budko">
          <div className="portrait-grid" aria-hidden="true" />
          <img
            src="/vlad-budko.jpg"
            alt="Vlad Budko"
            width="1500"
            height="1500"
            fetchPriority="high"
          />
          <div className="portrait-caption">
            <span>VB / Founder profile</span>
            <span>01</span>
          </div>
        </div>
      </section>

      <section className="section current-section" id="now">
        <div className="section-rail">
          <span>01</span>
          <p>Current focus</p>
        </div>
        <div className="section-body">
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow">GrowKong Group</p>
              <h2>A group designed to compound what works.</h2>
            </div>
            <p className="intro-copy">
              GrowKong combines product creation, creator-powered distribution,
              and shared operating infrastructure. The group is still being
              built. The point is not to look finished; the point is to keep
              getting stronger with every launch.
            </p>
          </div>

          <div className="venture-grid primary-ventures">
            {groupCompanies.map((venture) => (
              <VentureCard venture={venture} key={venture.name} />
            ))}
          </div>

          <article className="foundry-step">
            <div className="foundry-step-index">
              <span>03</span>
              <div className="foundry-step-logo">
                <img
                  src="/brands/growkong-foundry.svg"
                  alt=""
                  width="64"
                  height="64"
                />
              </div>
            </div>
            <div className="foundry-step-copy">
              <p>Next layer · Product creation</p>
              <h3>GrowKong Foundry</h3>
              <span>
                A product foundry for turning focused customer problems into
                working software and independent businesses.
              </span>
            </div>
            <div className="foundry-step-status">
              <i />
              In development
            </div>
          </article>

          <div className="products-header">
            <p className="eyebrow">Products in market</p>
            <p>First-party products built inside the group.</p>
          </div>
          <div className="venture-grid">
            {products.map((venture) => (
              <VentureCard venture={venture} key={venture.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="section independent-section">
        <div className="section-rail">
          <span>02</span>
          <p>Independent work</p>
        </div>
        <div className="section-body">
          <a
            className="arahaz-panel"
            href="https://arahaz.com"
            target="_blank"
            rel="noreferrer"
          >
            <div className="arahaz-meta">
              <p>AR / 2026</p>
              <span>Independent · Live</span>
            </div>
            <div className="arahaz-title">
              <p>A largely autonomous editorial system</p>
              <h2>Arahaz</h2>
            </div>
            <p className="arahaz-copy">
              Launched in 2026. A digital magazine built to publish practical
              guides across technology, travel, food, career, and everyday
              systems with a high degree of automation.
            </p>
            <span className="outbound" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </section>

      <section className="section systems-section" id="systems">
        <div className="section-rail">
          <span>03</span>
          <p>Private systems</p>
        </div>
        <div className="section-body">
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow">Built for myself</p>
              <h2>The private tools are part of the work.</h2>
            </div>
            <p className="intro-copy">
              Not every useful system needs customers. Some exist because I
              wanted a better way to think, decide, and operate every day.
            </p>
          </div>

          <article className="context-panel">
            <div className="context-copy">
              <div className="context-meta">
                <span>Private</span>
                <span>In daily use</span>
              </div>
              <h3>Context OS</h3>
              <p>
                A personal AI operating system connecting my calendar,
                projects, working context, and daily decisions into one
                assistant.
              </p>
            </div>
            <div className="context-map" aria-label="Context OS system map">
              {contextLinks.map(([title, detail], index) => (
                <div className="context-node" key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </div>
                </div>
              ))}
              <div className="context-orbit" aria-hidden="true">
                <span>C/OS</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section outcomes-section" id="outcomes">
        <div className="section-rail">
          <span>04</span>
          <p>Selected outcomes</p>
        </div>
        <div className="section-body">
          <div className="section-intro outcomes-intro">
            <p className="eyebrow">Before GrowKong</p>
            <h2>One company worth remembering.</h2>
            <p>
              An e-commerce company built in Ukraine, scaled with a 22-person
              team, and sold in a successful exit.
            </p>
          </div>
          <div className="metrics-grid">
            <article>
              <strong>126K+</strong>
              <span>customers</span>
            </article>
            <article>
              <strong>$250K+</strong>
              <span>annual revenue</span>
            </article>
            <article>
              <strong>22</strong>
              <span>people on the team</span>
            </article>
            <article>
              <strong>9×</strong>
              <span>growth in daily orders</span>
            </article>
          </div>
          <div className="exit-line">
            <span>Outcome</span>
            <strong>Successful exit through an equity sale.</strong>
          </div>
        </div>
      </section>

      <section className="section archive-section" id="archive">
        <div className="section-rail">
          <span>05</span>
          <p>Closed ventures</p>
        </div>
        <div className="section-body">
          <div className="archive-heading">
            <p className="eyebrow">What I chose not to scale</p>
            <h2>I got these wrong.</h2>
            <p>
              The decisions were mine. So was the decision to stop.
            </p>
          </div>

          <div className="archive-grid">
            <article className="archive-card">
              <div className="archive-card-head">
                <span>01 / CLOSED</span>
                <strong>130+ users</strong>
              </div>
              <h3>MyWhy</h3>
              <p>
                I chose the wrong business model, underestimated churn, and
                misjudged the safety risk of putting AI this close to mental
                health decisions. I shut it down.
              </p>
            </article>
            <article className="archive-card">
              <div className="archive-card-head">
                <span>02 / CLOSED</span>
                <strong>≈ $4K MRR</strong>
              </div>
              <h3>Restaurant photography</h3>
              <p>
                I got the unit economics wrong and built a Miami operation that
                depended too heavily on unpredictable people and revenue. It
                made money, but it was not a durable business. I shut it down.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="closing-note">
        <p className="eyebrow">A working principle</p>
        <blockquote>
          I prefer evidence over narratives. I build quickly, but I do not
          confuse motion with progress.
        </blockquote>
      </section>

      <footer>
        <div>
          <strong>Vlad Budko</strong>
          <span>Co-founder &amp; CEO · GrowKong Group</span>
        </div>
        <div className="footer-links">
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
