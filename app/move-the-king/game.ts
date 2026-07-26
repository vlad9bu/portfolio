export type MetricKey = "capital" | "trust" | "momentum" | "leverage";

export type Metrics = Record<MetricKey, number>;

export type Move = {
  id: string;
  title: string;
  detail: string;
  principle: string;
  impact: Metrics;
};

export type GameRound = {
  code: string;
  title: string;
  situation: string;
  pressure: string;
  moves: Move[];
};

export type CounterMove = {
  counterMove: string;
  why: string;
  kingLine: string;
  signal: MetricKey;
  verdict: "you_advance" | "king_holds" | "board_shifts";
  impact: Metrics;
};

export type TurnHistory = {
  round: number;
  move: string;
  counter: string;
};

export const metricKeys: MetricKey[] = [
  "capital",
  "trust",
  "momentum",
  "leverage",
];

export const initialMetrics: Metrics = {
  capital: 68,
  trust: 61,
  momentum: 48,
  leverage: 37,
};

export const rounds: GameRound[] = [
  {
    code: "01",
    title: "Traction arrived before retention.",
    situation:
      "A focused B2B product reaches $18K MRR in six months. New accounts keep arriving, but monthly logo churn has climbed to 9%. The team wants to celebrate the growth.",
    pressure:
      "The board rewards visible momentum. The product is quietly leaking trust.",
    moves: [
      {
        id: "repair-core",
        title: "Slow acquisition. Repair retention.",
        detail:
          "Put the growth story on hold and spend one cycle fixing activation, onboarding, and the weakest workflow.",
        principle: "Protect the base",
        impact: { capital: -5, trust: 11, momentum: -5, leverage: 7 },
      },
      {
        id: "expand-market",
        title: "Open the next segment.",
        detail:
          "Use current momentum to enter a larger customer segment before competitors notice the category.",
        principle: "Take the window",
        impact: { capital: -9, trust: -3, momentum: 12, leverage: 2 },
      },
      {
        id: "raise-price",
        title: "Raise price. Narrow the promise.",
        detail:
          "Accept fewer customers, increase ARPA, and make the product accountable to a more specific outcome.",
        principle: "Trade volume for quality",
        impact: { capital: 8, trust: 3, momentum: -3, leverage: 6 },
      },
    ],
  },
  {
    code: "02",
    title: "Distribution is getting expensive.",
    situation:
      "Retention is stabilizing, but paid acquisition costs have doubled. One channel still works; everyone else is starting to crowd into it.",
    pressure:
      "You can buy another quarter of growth, or spend that quarter building an advantage you own.",
    moves: [
      {
        id: "own-channel",
        title: "Build a first-party audience.",
        detail:
          "Reduce paid volume and turn content, community, and direct relationships into operating infrastructure.",
        principle: "Own demand",
        impact: { capital: -6, trust: 6, momentum: -4, leverage: 13 },
      },
      {
        id: "buy-demand",
        title: "Buy the remaining inventory.",
        detail:
          "Spend aggressively while the channel is still measurable and convert the surge into market position.",
        principle: "Compress time",
        impact: { capital: -13, trust: 0, momentum: 13, leverage: -5 },
      },
      {
        id: "partner",
        title: "Trade margin for distribution.",
        detail:
          "Give a small number of aligned partners a reason to make the product part of their own business.",
        principle: "Borrow reach",
        impact: { capital: -3, trust: 4, momentum: 7, leverage: 7 },
      },
    ],
  },
  {
    code: "03",
    title: "The founder became the bottleneck.",
    situation:
      "Product, sales, and operating decisions now wait for one person. Quality remains high, but the company can no longer move in parallel.",
    pressure:
      "Every solution consumes either cash, control, or institutional trust.",
    moves: [
      {
        id: "hire-operators",
        title: "Install two strong operators.",
        detail:
          "Spend ahead of certainty, define decision rights, and give away enough control for the system to breathe.",
        principle: "Buy parallelism",
        impact: { capital: -11, trust: 7, momentum: 6, leverage: 10 },
      },
      {
        id: "automate",
        title: "Turn judgment into software.",
        detail:
          "Encode recurring decisions, reporting, and context before adding another layer of management.",
        principle: "Systemize first",
        impact: { capital: -5, trust: -2, momentum: 3, leverage: 13 },
      },
      {
        id: "founder-sprint",
        title: "Carry it for one more quarter.",
        detail:
          "Protect cash and push personally through the bottleneck while the next stage becomes clearer.",
        principle: "Delay the structure",
        impact: { capital: -2, trust: -8, momentum: 11, leverage: -8 },
      },
    ],
  },
  {
    code: "04",
    title: "The model works. The system might not.",
    situation:
      "Revenue is real and the product has advocates, but growth still depends on exceptions, founder energy, and one fragile distribution loop.",
    pressure:
      "The final move is not about optimism. It is about what deserves more time and capital.",
    moves: [
      {
        id: "scale",
        title: "Scale into the uncertainty.",
        detail:
          "Commit capital, hire for the next stage, and use speed to force the operating model to mature.",
        principle: "Earn the category",
        impact: { capital: -13, trust: 5, momentum: 15, leverage: 7 },
      },
      {
        id: "hold",
        title: "Hold the size. Harden the system.",
        detail:
          "Pause expansion until delivery, distribution, and decision-making work without heroic effort.",
        principle: "Make it durable",
        impact: { capital: 8, trust: 6, momentum: -7, leverage: 8 },
      },
      {
        id: "stop",
        title: "Close while the evidence is clean.",
        detail:
          "Return attention and remaining capital to the system instead of forcing an unstable model to scale.",
        principle: "Protect future moves",
        impact: { capital: 12, trust: -2, momentum: -13, leverage: 11 },
      },
    ],
  },
];

export function clampMetric(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyImpact(metrics: Metrics, impact: Metrics): Metrics {
  return metricKeys.reduce(
    (next, key) => {
      next[key] = clampMetric(metrics[key] + impact[key]);
      return next;
    },
    { ...metrics },
  );
}

export function findMove(round: number, moveId: string) {
  return rounds[round]?.moves.find((move) => move.id === moveId);
}

const localCounters: Record<string, Omit<CounterMove, "signal">> = {
  "repair-core": {
    counterMove: "The market re-labels your pause as weakness.",
    why:
      "A faster competitor absorbs the demand you stopped buying. Your product gets stronger, but the category narrative moves without you.",
    kingLine: "A better base is only useful if the market still remembers it.",
    verdict: "board_shifts",
    impact: { capital: -2, trust: 4, momentum: -8, leverage: 3 },
  },
  "expand-market": {
    counterMove: "Complexity enters through the new segment.",
    why:
      "Larger accounts ask for exceptions, procurement support, and workflows the product was never designed to carry.",
    kingLine: "You gained surface area. I gained attack vectors.",
    verdict: "king_holds",
    impact: { capital: -7, trust: -7, momentum: 3, leverage: -3 },
  },
  "raise-price": {
    counterMove: "The middle of the market disappears.",
    why:
      "The new promise attracts better customers, but the old acquisition loop no longer converts at the same rate.",
    kingLine: "A sharper position cuts both ways.",
    verdict: "you_advance",
    impact: { capital: 2, trust: 2, momentum: -5, leverage: 3 },
  },
  "own-channel": {
    counterMove: "The audience grows slower than the burn.",
    why:
      "Owned distribution compounds, but not on the schedule of your operating costs. The company must survive the gap.",
    kingLine: "Compounding is patient. Payroll is not.",
    verdict: "board_shifts",
    impact: { capital: -8, trust: 3, momentum: -5, leverage: 5 },
  },
  "buy-demand": {
    counterMove: "The auction learns your appetite.",
    why:
      "The channel prices in your aggression. Volume rises immediately, but every future customer becomes more expensive.",
    kingLine: "You bought speed. I moved the price.",
    verdict: "king_holds",
    impact: { capital: -9, trust: 0, momentum: 4, leverage: -6 },
  },
  partner: {
    counterMove: "Your partners learn where the margin lives.",
    why:
      "Distribution expands, then the strongest partners ask for exclusivity and a larger share of the economics.",
    kingLine: "Borrowed reach always sends an invoice.",
    verdict: "board_shifts",
    impact: { capital: -4, trust: -2, momentum: 3, leverage: -4 },
  },
  "hire-operators": {
    counterMove: "Decision rights collide before they compound.",
    why:
      "The hires are capable, but the company has not yet made authority legible. Two weeks of speed disappear into one month of alignment.",
    kingLine: "A title is not an operating system.",
    verdict: "board_shifts",
    impact: { capital: -6, trust: -3, momentum: -4, leverage: 3 },
  },
  automate: {
    counterMove: "The software preserves yesterday's judgment.",
    why:
      "Automation removes repeated work, but it also hardens assumptions that still need founder-level revision.",
    kingLine: "You encoded the map while the territory moved.",
    verdict: "king_holds",
    impact: { capital: -3, trust: -4, momentum: -2, leverage: 2 },
  },
  "founder-sprint": {
    counterMove: "The organization learns to wait.",
    why:
      "The quarter lands, but every team internalizes the founder as the final integration layer.",
    kingLine: "Heroics solve the deadline and preserve the bottleneck.",
    verdict: "king_holds",
    impact: { capital: 1, trust: -7, momentum: 3, leverage: -8 },
  },
  scale: {
    counterMove: "Exceptions scale faster than revenue.",
    why:
      "The growth is real, but each new account multiplies the hidden operating variance you chose not to remove.",
    kingLine: "Speed enlarges whatever already exists.",
    verdict: "king_holds",
    impact: { capital: -10, trust: -6, momentum: 5, leverage: -5 },
  },
  hold: {
    counterMove: "A competitor takes the visible lead.",
    why:
      "Your system becomes more durable while the market rewards the company that kept announcing momentum.",
    kingLine: "You may own the machine. They may own the story.",
    verdict: "board_shifts",
    impact: { capital: 3, trust: 4, momentum: -7, leverage: 4 },
  },
  stop: {
    counterMove: "The market questions the retreat.",
    why:
      "You preserve capital and attention, but the decision creates a temporary trust cost with people who only saw the revenue.",
    kingLine: "A clean exit still leaves a shadow.",
    verdict: "you_advance",
    impact: { capital: 4, trust: -5, momentum: -5, leverage: 6 },
  },
};

export function getLocalCounter(
  round: number,
  moveId: string,
  metrics: Metrics,
): CounterMove {
  const fallback = localCounters[moveId] ?? localCounters[rounds[round].moves[0].id];
  const weakest = metricKeys.reduce((current, key) =>
    metrics[key] < metrics[current] ? key : current,
  );

  return {
    ...fallback,
    signal: weakest,
  };
}

export function gameResult(metrics: Metrics) {
  const average =
    metricKeys.reduce((total, key) => total + metrics[key], 0) /
    metricKeys.length;
  const floor = Math.min(...metricKeys.map((key) => metrics[key]));

  if (floor <= 12 || metrics.capital <= 8) {
    return {
      state: "king_holds",
      eyebrow: "The king holds",
      title: "The company moved faster than the system.",
      detail:
        "You created momentum, but left one structural weakness exposed long enough for the board to collapse around it.",
    };
  }

  if (average >= 61 && metrics.leverage >= 52 && metrics.trust >= 48) {
    return {
      state: "you_advance",
      eyebrow: "The king has no durable move",
      title: "You protected the system.",
      detail:
        "The individual choices were imperfect. The operating system remained strong enough to preserve future moves.",
    };
  }

  return {
    state: "board_shifts",
    eyebrow: "The board remains open",
    title: "You survived without resolving the position.",
    detail:
      "The company can keep playing, but its next move must turn temporary momentum into durable leverage.",
  };
}
