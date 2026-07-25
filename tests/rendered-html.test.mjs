import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://vladbudko.com/", {
      headers: {
        accept: "text/html",
        host: "vladbudko.com",
        "x-forwarded-host": "vladbudko.com",
        "x-forwarded-proto": "https",
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

test("server-renders the founder profile", async () => {
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
  assert.match(html, /href="https:\/\/growkong\.com"/);
  assert.match(html, /GrowKong Network/);
  assert.match(html, /GrowKong Foundry/);
  assert.match(html, /Next layer · Product creation/);
  assert.doesNotMatch(html, /Shared systems/);
  assert.match(html, /Context OS/);
  assert.match(html, /Successful exit through an equity sale/);
  assert.match(html, /I got these wrong/);
  assert.match(html, /MyWhy/);
  assert.match(html, /Restaurant photography/);
});

test("keeps job-seeking and starter language out of the finished site", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(html, /Download Resume|View Resume|Product Manager/i);
  assert.doesNotMatch(html, /Building something ambitious|Get in touch/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
  assert.doesNotMatch(html, /646-239-1517|vlad9bu@gmail\.com/i);
  assert.match(html, /https:\/\/vladbudko\.com\/og\.png/);
});
