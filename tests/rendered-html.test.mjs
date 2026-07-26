import assert from "node:assert/strict";
import test from "node:test";

async function requestWorker(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://vladbudko.com${path}`, {
      ...init,
      headers: {
        accept: "text/html",
        host: "vladbudko.com",
        "x-forwarded-host": "vladbudko.com",
        "x-forwarded-proto": "https",
        ...init.headers,
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function render(path = "/") {
  return requestWorker(path);
}

test("server-renders the focused founder profile at the main address", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Vlad Budko — Co-founder &amp; CEO, GrowKong Group<\/title>/i,
  );
  assert.match(html, /I build software companies/);
  assert.match(html, /href="https:\/\/group\.growkong\.com"/);
  assert.match(html, /One group\. One operating system/);
  assert.match(html, /first-party company-building system/);
  assert.match(html, /Founder judgment/);
  assert.match(html, /Context OS/);
  assert.match(html, /Successful exit through an equity sale/);
  assert.match(html, /Knowing when to stop is part of building/);
  assert.match(html, /MyWhy AI Therapist/);
  assert.match(html, /Restaurant photography/);
  assert.doesNotMatch(
    html,
    /GrowKong Network|GrowKong Foundry|PinPinMe|NoSweatKing/,
  );
});

test("keeps job-seeking and starter language out of the finished site", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(html, /Download Resume|View Resume|Product Manager/i);
  assert.doesNotMatch(html, /Building something ambitious|Get in touch/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
  assert.doesNotMatch(html, /646-239-1517|vlad9bu@gmail\.com/i);
  assert.match(html, /https:\/\/vladbudko\.com\/og-minimal\.png/);
});

test("server-renders the minimal comparison edition", async () => {
  const response = await render("/minimal");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Vlad Budko — Minimal Edition/);
  assert.match(html, /GrowKong is the work/);
  assert.match(html, /View original/);
  assert.match(html, /Invert/);
  assert.match(html, /Open system map/);
  assert.match(html, /Evidence over narratives/);
  assert.match(html, /I got these wrong/);
  assert.match(html, /https:\/\/vladbudko\.com\/og-minimal\.png/);
  assert.doesNotMatch(html, /Download Resume|Get in touch/i);
});

test("server-renders the focused minimal copy without group catalog noise", async () => {
  const response = await render("/minimal-v2");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Vlad Budko — Minimal Focus Edition/);
  assert.match(html, /One group\. One operating system/);
  assert.match(html, /first-party company-building system/);
  assert.match(html, /Product creation/);
  assert.match(html, /Founder judgment/);
  assert.match(html, /Successful exit through an equity sale/);
  assert.match(html, /Some tools exist outside the group/);
  assert.match(html, /Knowing when to stop is part of building/);
  assert.match(html, /We decided not to keep scaling it/);
  assert.doesNotMatch(
    html,
    /GrowKong Network|GrowKong Foundry|PinPinMe|NoSweatKing/,
  );
  assert.doesNotMatch(html, /focused customer problems/);
  assert.doesNotMatch(html, /I got these wrong|I chose the wrong business model/);
});

test("server-renders Move The King as a separate business logic game", async () => {
  const response = await render("/move-the-king");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Move The King — A Business Logic Game/);
  assert.match(html, /Every choice creates a trade-off/);
  assert.match(html, /The King reads the board/);
  assert.match(html, /Enter the board/);
  assert.match(html, /How to play/);
  assert.match(html, /There is no perfect move/);
  assert.match(html, /Keep the system alive/);
  assert.match(html, /og-move-the-king\.png/);
  assert.doesNotMatch(html, /OPENAI_API_KEY|sk-[A-Za-z0-9]/);
});

test("Move The King board API keeps a complete fallback deck without a key", async () => {
  const response = await requestWorker("/api/move-the-king/board", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://vladbudko.com",
    },
    body: "{}",
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.mode, "simulation");
  assert.equal(payload.board.rounds.length, 4);
  assert.equal(
    payload.board.rounds.every((round) => round.moves.length === 3),
    true,
  );
  assert.equal(payload.model, undefined);
});

test("Move The King API returns a bounded local counter without a key", async () => {
  const response = await requestWorker("/api/move-the-king", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://vladbudko.com",
    },
    body: JSON.stringify({
      roundIndex: 0,
      round: {
        title: "Traction arrived before retention.",
        situation:
          "A focused B2B product reaches $18K MRR in six months. New accounts keep arriving, but monthly logo churn has climbed to 9%.",
        pressure:
          "The board rewards visible momentum. The product is quietly leaking trust.",
      },
      move: {
        id: "repair-core",
        title: "Slow acquisition. Repair retention.",
        detail:
          "Put the growth story on hold and spend one cycle fixing activation, onboarding, and the weakest workflow.",
        principle: "Protect the base",
        impact: {
          capital: -5,
          trust: 11,
          momentum: -5,
          leverage: 7,
        },
      },
      metrics: {
        capital: 63,
        trust: 72,
        momentum: 43,
        leverage: 44,
      },
      history: [],
    }),
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.mode, "simulation");
  assert.equal(typeof payload.counter.counterMove, "string");
  assert.equal(typeof payload.counter.impact.capital, "number");
  assert.equal(payload.model, undefined);
});
