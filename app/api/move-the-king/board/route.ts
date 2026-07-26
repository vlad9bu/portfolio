import { NextResponse } from "next/server";
import {
  fallbackBoard,
  metricKeys,
  type GameBoard,
  type GameRound,
  type Metrics,
  type Move,
} from "../../../move-the-king/game";

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
};

const requestWindow = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

export const maxDuration = 60;

const metricSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capital: { type: "integer" },
    trust: { type: "integer" },
    momentum: { type: "integer" },
    leverage: { type: "integer" },
  },
  required: ["capital", "trust", "momentum", "leverage"],
};

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    thesis: { type: "string" },
    rounds: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          situation: { type: "string" },
          pressure: { type: "string" },
          moves: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                detail: { type: "string" },
                principle: { type: "string" },
                impact: metricSchema,
                outcome: { type: "string" },
              },
              required: ["title", "detail", "principle", "impact", "outcome"],
            },
          },
        },
        required: ["title", "situation", "pressure", "moves"],
      },
    },
  },
  required: ["title", "thesis", "rounds"],
};

const scenarioFrames = [
  "a vertical software company moving from early traction to a durable operating model",
  "a bootstrapped B2B platform whose distribution advantage is beginning to attract competition",
  "a founder-led marketplace balancing liquidity, trust, and operational complexity",
  "a profitable AI product deciding which parts of its early advantage can actually scale",
  "a small software group allocating attention and capital across several promising products",
  "a creator-powered product company converting audience access into repeatable distribution",
];

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function capImpact(value: unknown) {
  const amount =
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(-12, Math.min(12, Math.round(amount)));
}

function cleanImpact(value: unknown): Metrics | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const impact = {} as Metrics;

  for (const key of metricKeys) {
    if (typeof source[key] !== "number" || !Number.isFinite(source[key])) {
      return null;
    }
    impact[key] = capImpact(source[key]);
  }

  const values = metricKeys.map((key) => impact[key]);
  if (!values.some((amount) => amount < 0)) {
    impact.capital = -Math.max(3, Math.abs(impact.capital));
  }
  if (!values.some((amount) => amount > 0)) {
    impact.leverage = Math.max(3, Math.abs(impact.leverage));
  }

  return impact;
}

function decisionScore(impact: Metrics) {
  return metricKeys.reduce((total, key) => total + impact[key], 0);
}

function dominates(first: Metrics, second: Metrics) {
  return (
    metricKeys.every((key) => first[key] >= second[key]) &&
    metricKeys.some((key) => first[key] > second[key])
  );
}

function isBalancedRound(moves: Move[]) {
  const scores = moves.map((move) => decisionScore(move.impact));
  if (Math.max(...scores) - Math.min(...scores) > 10) return false;

  return !moves.some((move, index) =>
    moves.some(
      (other, otherIndex) =>
        index !== otherIndex && dominates(move.impact, other.impact),
    ),
  );
}

function normalizeMove(
  value: unknown,
  roundIndex: number,
  moveIndex: number,
): Move | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const title = cleanText(source.title, 120);
  const detail = cleanText(source.detail, 320);
  const principle = cleanText(source.principle, 72);
  const impact = cleanImpact(source.impact);
  const outcome = cleanText(source.outcome, 420);

  if (!title || !detail || !principle || !impact || !outcome) return null;

  return {
    id: `ai-r${roundIndex + 1}-m${moveIndex + 1}`,
    title,
    detail,
    principle,
    impact,
    outcome,
  };
}

function normalizeRound(value: unknown, roundIndex: number): GameRound | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.moves) || source.moves.length !== 3) return null;

  const title = cleanText(source.title, 110);
  const situation = cleanText(source.situation, 480);
  const pressure = cleanText(source.pressure, 220);
  const moves = source.moves.map((move, moveIndex) =>
    normalizeMove(move, roundIndex, moveIndex),
  );

  if (!title || !situation || !pressure || moves.some((move) => !move)) {
    return null;
  }
  const normalizedMoves = moves as Move[];
  if (!isBalancedRound(normalizedMoves)) return null;

  return {
    code: String(roundIndex + 1).padStart(2, "0"),
    title,
    situation,
    pressure,
    moves: normalizedMoves,
  };
}

function normalizeBoard(value: unknown): GameBoard | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.rounds) || source.rounds.length !== 4) return null;

  const title = cleanText(source.title, 72);
  const thesis = cleanText(source.thesis, 180);
  const rounds = source.rounds.map(normalizeRound);

  if (!title || !thesis || rounds.some((round) => !round)) return null;

  return { title, thesis, rounds: rounds as GameRound[] };
}

function getOutputText(response: OpenAIResponse) {
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "refusal") return null;
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return null;
}

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "anonymous";
  const now = Date.now();
  const current = requestWindow.get(key);

  if (!current || current.resetAt <= now) {
    requestWindow.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function jsonResponse(
  board: GameBoard,
  mode: "ai" | "simulation",
  model?: string,
) {
  return NextResponse.json(
    { board, mode, model: mode === "ai" ? model : undefined },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Origin rejected." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Origin rejected." }, { status: 403 });
    }
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "The king needs a moment before setting another board." },
      {
        status: 429,
        headers: { "Retry-After": String(WINDOW_MS / 1000) },
      },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return jsonResponse(fallbackBoard, "simulation");

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const frame =
    scenarioFrames[Math.floor(Math.random() * scenarioFrames.length)];
  const instructions = [
    "Design one coherent four-round business strategy game called Move The King.",
    "Follow one company as its position evolves. Since all four rounds are generated before play, every later situation must remain plausible after any earlier option.",
    "Make each round difficult for an experienced founder: combine two credible but conflicting truths, incomplete evidence, second-order effects, and a real timing constraint. Avoid textbook dilemmas and direct problem-to-solution matches.",
    "Create exactly three distinct moves. Every visible detail must state both a concrete upside and a concrete risk or opportunity cost with equal rhetorical weight. Never describe one option optimistically and another defensively.",
    "Do not signal the intended winner through words such as safe, reckless, obvious, correct, best, fatal, or doomed. The player should be able to defend any option before consequences are revealed.",
    "Each move must gain at least one metric and lose at least one metric. No move may dominate another across all four metrics. Keep the highest and lowest total decision scores within 10 points.",
    "For each move, write a hidden outcome that explains the causal chain behind its four metric impacts, covering the main gain and the main cost without inventing facts beyond the situation.",
    "Use realistic choices involving product, distribution, people, capital, trust, timing, or control. Avoid trivia, jargon, named real companies, personal data, illegal activity, politics, and financial trading.",
    "Write in sharp English. Title under 8 words; thesis under 22 words; round title under 9 words; situation under 70 words; pressure under 26 words; move title under 8 words; detail under 36 words; principle under 5 words; outcome under 38 words.",
    "Metric impacts are integers from -12 to 12 for capital, trust, momentum, and leverage.",
    "Return only the required structured response.",
  ].join(" ");
  const input = JSON.stringify({
    frame,
    variationNonce: crypto.randomUUID(),
    challengeLevel:
      "Experienced founder. Every option must remain defensible after a careful first read.",
    desiredArc:
      "Four linked positions that escalate from an early advantage to a final durability decision.",
  });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        reasoning: { effort: "medium" },
        max_output_tokens: 6000,
        instructions,
        input,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "move_the_king_board",
            strict: true,
            schema: outputSchema,
          },
        },
      }),
      signal: AbortSignal.timeout(50_000),
    });

    if (!response.ok) return jsonResponse(fallbackBoard, "simulation");

    const payload = (await response.json()) as OpenAIResponse;
    const outputText = getOutputText(payload);
    if (!outputText) return jsonResponse(fallbackBoard, "simulation");

    const board = normalizeBoard(JSON.parse(outputText));
    if (!board) return jsonResponse(fallbackBoard, "simulation");

    return jsonResponse(board, "ai", model);
  } catch {
    return jsonResponse(fallbackBoard, "simulation");
  }
}
