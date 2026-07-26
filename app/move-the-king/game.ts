export type MetricKey = "capital" | "trust" | "momentum" | "leverage";

export type Metrics = Record<MetricKey, number>;

export type DuelScore = {
  you: number;
  king: number;
};

export type RoundOutcome = {
  youScore: number;
  kingScore: number;
  margin: number;
  winner: "you" | "king" | "even";
};

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

export type GameBoard = {
  title: string;
  thesis: string;
  rounds: GameRound[];
};

export type PublicMove = Pick<Move, "id" | "title" | "detail" | "principle">;

export type KingChoice = {
  moveId: string;
  why: string;
  kingLine: string;
};

export type TurnHistory = {
  round: number;
  userMove: string;
  kingMove: string;
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

export const initialDuelScore: DuelScore = {
  you: 0,
  king: 0,
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

export const fallbackBoard: GameBoard = {
  title: "The durable company",
  thesis:
    "Four positions about growth, control, distribution, and what deserves another move.",
  rounds,
};

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

export function getRoundOutcome(
  playerImpact: Metrics,
  kingImpact: Metrics,
): RoundOutcome {
  const youScore = metricKeys.reduce(
    (total, key) => total + playerImpact[key],
    0,
  );
  const kingScore = metricKeys.reduce(
    (total, key) => total + kingImpact[key],
    0,
  );

  return {
    youScore,
    kingScore,
    margin: Math.abs(youScore - kingScore),
    winner:
      youScore === kingScore ? "even" : youScore > kingScore ? "you" : "king",
  };
}

export function addRoundScore(
  score: DuelScore,
  outcome: RoundOutcome,
): DuelScore {
  return {
    you: score.you + outcome.youScore,
    king: score.king + outcome.kingScore,
  };
}

export function getLocalKingChoice(
  roundIndex: number,
  options: PublicMove[],
  metrics: Metrics,
): KingChoice {
  if (options.length === 0) {
    throw new Error("The King needs at least one available move.");
  }

  const source = [
    roundIndex,
    ...metricKeys.map((key) => metrics[key]),
    ...options.map((option) => option.title),
  ].join("|");
  const hash = Array.from(source).reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
  const move = options[hash % options.length] ?? options[0]!;

  return {
    moveId: move.id,
    why:
      `I chose “${move.title}” because it is the strongest response to the visible position from the information available.`,
    kingLine: `${move.principle} is the move I would back.`,
  };
}

export function gameResult(metrics: Metrics, score: DuelScore) {
  const floor = Math.min(...metricKeys.map((key) => metrics[key]));
  const strongest = metricKeys.reduce((current, key) =>
    metrics[key] > metrics[current] ? key : current,
  );
  const weakest = metricKeys.reduce((current, key) =>
    metrics[key] < metrics[current] ? key : current,
  );
  const label = (key: MetricKey) =>
    key.charAt(0).toUpperCase() + key.slice(1);

  if (floor <= 12 || metrics.capital <= 8) {
    return {
      state: "king_holds",
      winner: "king" as const,
      eyebrow: "Winner / The King",
      title: "The King held the board.",
      detail:
        `${label(weakest)} fell to ${metrics[weakest]} along your path. The company crossed its survival floor, so the King wins regardless of the decision score.`,
    };
  }

  if (score.you > score.king) {
    return {
      state: "you_advance",
      winner: "you" as const,
      eyebrow: "Winner / You",
      title: "You moved the King.",
      detail:
        `You won ${score.you} to ${score.king}. Across four decisions, your choices created more total value than the King’s alternatives. ${label(strongest)} finished strongest at ${metrics[strongest]}.`,
    };
  }

  if (score.king > score.you) {
    return {
      state: "king_holds",
      winner: "king" as const,
      eyebrow: "Winner / The King",
      title: "The King held the board.",
      detail:
        `The King won ${score.king} to ${score.you}. The King’s four alternative decisions produced the stronger combined result, while ${label(weakest)} finished weakest along your path at ${metrics[weakest]}.`,
    };
  }

  return {
    state: "board_shifts",
    winner: "even" as const,
    eyebrow: "The board remains open",
    title: "Neither side resolved the position.",
    detail:
      `The score finished ${score.you} to ${score.king}. Your four decisions and the King’s four alternatives created the same total result.`,
  };
}
