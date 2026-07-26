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
  outcome: string;
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

export type GameTurnRecord = {
  round: number;
  situation: string;
  pressure: string;
  userMove: Move;
  kingMove: Move;
  youScore: number;
  kingScore: number;
};

export type GameConclusion = {
  headline: string;
  overview: string;
  userPattern: string;
  kingPattern: string;
  turningPoint: string;
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
          "Pause acquisition for one cycle to rebuild activation; churn may fall, but competitors get a clean quarter to own the category narrative.",
        principle: "Protect the base",
        impact: { capital: -5, trust: 10, momentum: -5, leverage: 7 },
        outcome:
          "The pause buys trust and turns onboarding into reusable leverage. It also consumes cash without replacing the visible momentum surrendered during the repair cycle.",
      },
      {
        id: "expand-market",
        title: "Open the next segment.",
        detail:
          "Enter larger accounts while demand is hot; contract size rises, but custom requirements arrive before retention is stable.",
        principle: "Take the window",
        impact: { capital: -8, trust: -3, momentum: 12, leverage: 3 },
        outcome:
          "Larger accounts extend the growth curve and create some negotiating leverage. Sales effort and product exceptions spend capital while exposing an already fragile customer promise.",
      },
      {
        id: "raise-price",
        title: "Raise price. Narrow the promise.",
        detail:
          "Use higher ARPA to fund a narrower promise; focus improves, but the middle of the existing funnel may stop converting.",
        principle: "Trade volume for quality",
        impact: { capital: 7, trust: 3, momentum: -4, leverage: 5 },
        outcome:
          "Higher revenue per account improves capital and sharpens the product promise. The narrower market slows near-term momentum even as focus makes future delivery more repeatable.",
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
          "Redirect spend into content and community; owned demand may compound, but it must survive a slow start while paid volume disappears.",
        principle: "Own demand",
        impact: { capital: -6, trust: 6, momentum: -4, leverage: 12 },
        outcome:
          "Direct relationships increase trust and create durable distribution leverage. The audience compounds slowly, so the company funds the transition while accepting a visible loss of momentum.",
      },
      {
        id: "buy-demand",
        title: "Buy the remaining inventory.",
        detail:
          "Defend share with aggressive spend while attribution still works; volume arrives now, but the auction learns exactly how much growth is worth to you.",
        principle: "Compress time",
        impact: { capital: -10, trust: 2, momentum: 12, leverage: -3 },
        outcome:
          "Immediate reach restores momentum and repeated exposure adds modest trust. The spend drains capital and teaches the channel to price against you, reducing control over future acquisition.",
      },
      {
        id: "partner",
        title: "Trade margin for distribution.",
        detail:
          "Let aligned partners carry the product into their workflows; reach grows faster, but margin and part of the customer relationship move outside the company.",
        principle: "Borrow reach",
        impact: { capital: -5, trust: 3, momentum: 8, leverage: 4 },
        outcome:
          "Partner access creates momentum and some distribution leverage without building an audience first. Shared economics cost capital, and borrowed relationships limit how much trust the company owns directly.",
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
          "Hire two senior operators and grant real authority; work can run in parallel, but cash and decision clarity are committed before the structure is proven.",
        principle: "Buy parallelism",
        impact: { capital: -10, trust: 6, momentum: 5, leverage: 9 },
        outcome:
          "Clear ownership restores organizational trust, momentum, and parallel execution. Senior capacity is expensive, and the company pays before knowing whether authority boundaries will actually hold.",
      },
      {
        id: "automate",
        title: "Turn judgment into software.",
        detail:
          "Encode recurring decisions before adding management; throughput improves cheaply, but today’s founder assumptions may harden into tomorrow’s operating system.",
        principle: "Systemize first",
        impact: { capital: -5, trust: -3, momentum: 4, leverage: 11 },
        outcome:
          "Automation creates strong leverage and releases some operating speed with limited spend. Encoding unsettled judgment reduces trust when edge cases expose rules the organization never agreed on.",
      },
      {
        id: "founder-sprint",
        title: "Carry it for one more quarter.",
        detail:
          "Keep cash and personally carry the next quarter; deadlines land, but every successful rescue teaches the team to wait for the founder again.",
        principle: "Delay the structure",
        impact: { capital: -2, trust: -6, momentum: 10, leverage: -2 },
        outcome:
          "Founder effort protects the quarter’s momentum without a large cash commitment. The rescue weakens institutional trust and preserves the founder as the integration layer instead of creating leverage.",
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
          "Commit capital to capture the category before it closes; scale may force maturity, but it also multiplies every exception the current system still hides.",
        principle: "Earn the category",
        impact: { capital: -12, trust: 3, momentum: 12, leverage: 7 },
        outcome:
          "Commitment creates category momentum and enough scale to improve operating leverage. Capital absorbs the unresolved exceptions, while trust improves only modestly because delivery is still being proven.",
      },
      {
        id: "hold",
        title: "Hold the size. Harden the system.",
        detail:
          "Pause expansion until delivery works without heroics; durability improves, but competitors gain time to define the market while you stop announcing growth.",
        principle: "Make it durable",
        impact: { capital: 7, trust: 5, momentum: -6, leverage: 8 },
        outcome:
          "A controlled pause preserves capital, earns delivery trust, and converts repeated work into leverage. The price is lost market momentum during a window competitors can use.",
      },
      {
        id: "stop",
        title: "Close while the evidence is clean.",
        detail:
          "Return capital and attention before instability compounds; optionality survives, but customers and the team absorb the cost of a deliberate retreat.",
        principle: "Protect future moves",
        impact: { capital: 10, trust: -3, momentum: -10, leverage: 9 },
        outcome:
          "Closing preserves capital and management leverage for the next opportunity. The retreat ends momentum immediately and charges trust with people who experienced a working product, not the unstable system behind it.",
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

export function getLocalConclusion(
  history: GameTurnRecord[],
  score: DuelScore,
  metrics: Metrics,
): GameConclusion {
  const decisive = history.reduce<GameTurnRecord | null>((current, turn) => {
    if (!current) return turn;
    const currentGap = Math.abs(current.youScore - current.kingScore);
    const nextGap = Math.abs(turn.youScore - turn.kingScore);
    return nextGap > currentGap ? turn : current;
  }, null);
  const userWins = history.filter(
    (turn) => turn.youScore > turn.kingScore,
  ).length;
  const kingWins = history.filter(
    (turn) => turn.kingScore > turn.youScore,
  ).length;
  const ties = history.length - userWins - kingWins;
  const weakest = metricKeys.reduce((current, key) =>
    metrics[key] < metrics[current] ? key : current,
  );
  const weakestLabel =
    weakest.charAt(0).toUpperCase() + weakest.slice(1);
  const result =
    score.you === score.king
      ? "The score tied because neither side compounded a lasting advantage."
      : score.you > score.king
        ? "Your choices produced the stronger combined trade-offs."
        : "The King produced the stronger combined trade-offs.";

  return {
    headline:
      score.you === score.king
        ? "Same score. Different routes."
        : score.you > score.king
          ? "Your trade-offs compounded better."
          : "The King gave away less.",
    overview:
      `${result} Your path finished with ${weakestLabel} as its lowest metric at ${metrics[weakest]}.`,
    userPattern:
      `You won ${userWins} round${userWins === 1 ? "" : "s"}, tied ${ties}, and scored ${score.you} overall. The largest gap shows where your visible upside carried the highest hidden cost.`,
    kingPattern:
      `The King won ${kingWins} round${kingWins === 1 ? "" : "s"}, tied ${ties}, and scored ${score.king}. Its edge came from choosing the cleaner total trade-off, not from damaging your company.`,
    turningPoint: decisive
      ? `Round ${String(decisive.round + 1).padStart(2, "0")}: “${decisive.userMove.title}” scored ${decisive.youScore}, while “${decisive.kingMove.title}” scored ${decisive.kingScore}.`
      : "No single round separated the two decision paths.",
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
