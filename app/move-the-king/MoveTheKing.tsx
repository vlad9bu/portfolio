"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addRoundScore,
  applyImpact,
  fallbackBoard,
  gameResult,
  getLocalKingChoice,
  getRoundOutcome,
  initialDuelScore,
  initialMetrics,
  metricKeys,
  type DuelScore,
  type GameBoard,
  type KingChoice,
  type Metrics,
  type RoundOutcome,
  type TurnHistory,
} from "./game";
import styles from "./move-the-king.module.css";

type Phase =
  | "intro"
  | "generating"
  | "turn"
  | "thinking"
  | "counter"
  | "complete";
type HelpPhase = "open" | "closing" | "closed" | "opening";

type KingChoiceResponse = {
  choice: KingChoice;
  mode: "ai" | "simulation";
  model?: string;
};

type BoardResponse = {
  board: GameBoard;
  mode: "ai" | "simulation";
  model?: string;
};

type GameTurnHistory = TurnHistory & {
  youScore: number;
  kingScore: number;
};

const metricLabels: Record<keyof Metrics, string> = {
  capital: "Capital",
  trust: "Trust",
  momentum: "Momentum",
  leverage: "Leverage",
};

function formatImpact(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function MetricBoard({ metrics }: { metrics: Metrics }) {
  return (
    <div
      className={styles.metricBoard}
      aria-label="Company metrics along your decision path"
    >
      {metricKeys.map((key) => (
        <div className={styles.metric} key={key}>
          <span>
            <small>{metricLabels[key]}</small>
            <strong>{metrics[key]}</strong>
          </span>
          <i aria-hidden="true">
            <b style={{ width: `${metrics[key]}%` }} />
          </i>
        </div>
      ))}
    </div>
  );
}

function ImpactList({ impact }: { impact: Metrics }) {
  return (
    <div className={styles.impactList} aria-label="Impact on company metrics">
      {metricKeys.map((key) => (
        <span data-positive={impact[key] > 0 ? "true" : "false"} key={key}>
          <small>{metricLabels[key]}</small>
          <strong>{formatImpact(impact[key])}</strong>
        </span>
      ))}
    </div>
  );
}

function DuelBoard({
  score,
  roundsPlayed,
}: {
  score: DuelScore;
  roundsPlayed: number;
}) {
  return (
    <div
      className={styles.duelBoard}
      aria-label={`Cumulative score: you ${score.you}, King ${score.king}`}
    >
      <div className={styles.duelSide} data-side="you">
        <small>You</small>
        <strong>{formatImpact(score.you)}</strong>
        <span>Cumulative points</span>
      </div>
      <div className={styles.duelVs}>
        <strong>VS</strong>
        <small>{roundsPlayed} / 4 resolved</small>
      </div>
      <div className={styles.duelSide} data-side="king">
        <small>The King</small>
        <strong>{formatImpact(score.king)}</strong>
        <span>Cumulative points</span>
      </div>
    </div>
  );
}

export default function MoveTheKing() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [gameBoard, setGameBoard] = useState<GameBoard>(fallbackBoard);
  const [roundIndex, setRoundIndex] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [kingChoice, setKingChoice] = useState<KingChoice | null>(null);
  const [history, setHistory] = useState<GameTurnHistory[]>([]);
  const [duelScore, setDuelScore] = useState<DuelScore>(initialDuelScore);
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null);
  const [engine, setEngine] = useState<"ai" | "simulation" | null>(null);
  const [boardEngine, setBoardEngine] = useState<
    "ai" | "simulation" | null
  >(null);
  const [lastPlayerImpact, setLastPlayerImpact] = useState<Metrics | null>(null);
  const [helpPhase, setHelpPhase] = useState<HelpPhase>("open");
  const [helpPulse, setHelpPulse] = useState(false);
  const helpPanelRef = useRef<HTMLDivElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const helpCloseRef = useRef<HTMLButtonElement>(null);
  const helpTimerRef = useRef<number | null>(null);

  const round = gameBoard.rounds[roundIndex] ?? fallbackBoard.rounds[0];
  const selectedMove = useMemo(
    () => round.moves.find((move) => move.id === selectedMoveId) ?? null,
    [round, selectedMoveId],
  );
  const kingMove = useMemo(
    () =>
      round.moves.find((move) => move.id === kingChoice?.moveId) ?? null,
    [kingChoice, round],
  );
  const result = gameResult(metrics, duelScore);

  const setGenieOffset = () => {
    const panel = helpPanelRef.current;
    const button = helpButtonRef.current;
    if (!panel || !button) return;

    const panelRect = panel.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const x =
      buttonRect.left +
      buttonRect.width / 2 -
      (panelRect.left + panelRect.width / 2);
    const y =
      buttonRect.top +
      buttonRect.height / 2 -
      (panelRect.top + panelRect.height / 2);

    panel.style.setProperty("--genie-x", `${x}px`);
    panel.style.setProperty("--genie-y", `${y}px`);
  };

  useLayoutEffect(() => {
    if (helpPhase !== "opening") return;
    setGenieOffset();
  }, [helpPhase]);

  const closeHelp = () => {
    if (helpPhase === "closing" || helpPhase === "closed") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHelpPhase("closed");
      helpButtonRef.current?.focus();
      return;
    }

    setGenieOffset();
    setHelpPhase("closing");
    helpTimerRef.current = window.setTimeout(() => {
      setHelpPhase("closed");
      setHelpPulse(true);
      helpButtonRef.current?.focus();
      helpTimerRef.current = window.setTimeout(
        () => setHelpPulse(false),
        1150,
      );
    }, 720);
  };

  const openHelp = () => {
    if (helpPhase !== "closed") return;
    setHelpPulse(false);
    setHelpPhase("opening");
    helpTimerRef.current = window.setTimeout(() => {
      setHelpPhase("open");
    }, 680);
  };

  useEffect(() => {
    if (helpPhase === "closed") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (helpPhase === "open") helpCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [helpPhase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && helpPhase === "open") closeHelp();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(
    () => () => {
      if (helpTimerRef.current) window.clearTimeout(helpTimerRef.current);
    },
    [],
  );

  const startGame = async () => {
    setRoundIndex(0);
    setMetrics(initialMetrics);
    setSelectedMoveId(null);
    setKingChoice(null);
    setHistory([]);
    setDuelScore(initialDuelScore);
    setRoundOutcome(null);
    setEngine(null);
    setBoardEngine(null);
    setLastPlayerImpact(null);
    setPhase("generating");

    const minimumBoardTime = new Promise((resolve) =>
      window.setTimeout(resolve, 950),
    );
    let response: BoardResponse = {
      board: fallbackBoard,
      mode: "simulation",
    };

    try {
      const boardRequest = fetch("/api/move-the-king/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }).then(async (result) => {
        if (!result.ok) throw new Error("The king could not set the board.");
        return (await result.json()) as BoardResponse;
      });
      response = await boardRequest;
    } catch {
      // The original board remains available if AI generation is unavailable.
    }

    await minimumBoardTime;
    setGameBoard(response.board);
    setBoardEngine(response.mode);
    setPhase("turn");
  };

  const makeMove = async () => {
    if (!selectedMove || phase !== "turn") return;

    const metricsAfterMove = applyImpact(metrics, selectedMove.impact);
    const minimumThinkingTime = new Promise((resolve) =>
      window.setTimeout(resolve, 900),
    );

    setLastPlayerImpact(selectedMove.impact);
    setPhase("thinking");

    let response: KingChoiceResponse = {
      choice: getLocalKingChoice(roundIndex, round.moves, metrics),
      mode: "simulation",
    };

    try {
      const request = fetch("/api/move-the-king", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundIndex,
          round: {
            title: round.title,
            situation: round.situation,
            pressure: round.pressure,
            options: round.moves.map(({ id, title, detail, principle }) => ({
              id,
              title,
              detail,
              principle,
            })),
          },
          metrics,
          history,
        }),
      }).then(async (result) => {
        if (!result.ok) throw new Error("The king declined the move.");
        return (await result.json()) as KingChoiceResponse;
      });

      response = await request;
    } catch {
      // The local strategy engine keeps the game playable if the AI is absent.
    }

    await minimumThinkingTime;

    const chosenKingMove =
      round.moves.find((move) => move.id === response.choice.moveId) ??
      round.moves[0];
    const outcome = getRoundOutcome(
      selectedMove.impact,
      chosenKingMove.impact,
    );
    setKingChoice({ ...response.choice, moveId: chosenKingMove.id });
    setEngine(response.mode);
    setMetrics(metricsAfterMove);
    setRoundOutcome(outcome);
    setDuelScore((current) => addRoundScore(current, outcome));
    setHistory((current) => [
      ...current,
      {
        round: roundIndex,
        userMove: selectedMove.title,
        kingMove: chosenKingMove.title,
        youScore: outcome.youScore,
        kingScore: outcome.kingScore,
      },
    ]);
    setPhase("counter");
  };

  const continueGame = () => {
    if (roundIndex === gameBoard.rounds.length - 1) {
      setPhase("complete");
      return;
    }

    setRoundIndex((current) => current + 1);
    setSelectedMoveId(null);
    setKingChoice(null);
    setLastPlayerImpact(null);
    setRoundOutcome(null);
    setPhase("turn");
  };

  return (
    <main className={`${styles.game} game-page`} data-phase={phase}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Back to Vlad Budko">
          VB
        </Link>
        <span>Move The King</span>
        <div>
          <small>
            {phase === "intro"
              ? "Business logic game"
              : phase === "generating"
                ? "New board"
                : "Position"}
          </small>
          <strong>
            {phase === "intro"
              ? "AI / 01"
              : phase === "generating"
                ? "AI / …"
                : `${String(
                    Math.min(roundIndex + 1, gameBoard.rounds.length),
                  ).padStart(2, "0")} / ${String(
                    gameBoard.rounds.length,
                  ).padStart(2, "0")}`}
          </strong>
        </div>
      </header>

      {phase === "intro" && (
        <section className={styles.intro}>
          <div className={styles.introCopy}>
            <p>
              <span>Strategy experiment</span>
              <span>Four moves</span>
            </p>
            <h1>
              Move
              <br />
              The King.
            </h1>
            <div className={styles.introText}>
              <p>
                You and the King face the same company and the same four
                unstable positions. Choose independently, reveal both
                decisions, and see whose judgment creates the stronger result.
              </p>
              <button type="button" onClick={startGame}>
                Enter the board
                <span aria-hidden="true">↘</span>
              </button>
            </div>
          </div>
          <div className={styles.kingStage} aria-hidden="true">
            <div className={styles.kingGrid} />
            <span className={styles.kingPiece}>♚</span>
            <p>The opponent does not need your plan. Only your position.</p>
          </div>
        </section>
      )}

      {phase === "generating" && (
        <section className={styles.generating} aria-live="polite" aria-busy>
          <div className={styles.generatingPiece} aria-hidden="true">
            ♚
          </div>
          <div className={styles.generatingCopy}>
            <span>New game / new position</span>
            <h1>The King is setting the board.</h1>
            <p>
              Building four linked business situations and twelve imperfect
              moves. A fresh position for this run.
            </p>
            <i aria-hidden="true" />
          </div>
        </section>
      )}

      {["turn", "thinking", "counter"].includes(phase) && (
        <>
          <DuelBoard score={duelScore} roundsPlayed={history.length} />
          <MetricBoard metrics={metrics} />

          <section className={styles.position}>
            <aside className={styles.positionRail}>
              <span>{round.code}</span>
              <p>Current position</p>
              <strong>{round.title}</strong>
              <small>{round.pressure}</small>
            </aside>

            <div className={styles.board}>
              <div className={styles.situation}>
                <p>Board state / {round.code}</p>
                <h2>{round.situation}</h2>
              </div>

              {phase === "turn" && (
                <div className={styles.moves}>
                  <div className={styles.movesHeader}>
                    <span>Your move</span>
                    <small>Choose one position. You cannot undo it.</small>
                  </div>
                  <div className={styles.moveGrid}>
                    {round.moves.map((move, index) => {
                      const selected = selectedMoveId === move.id;
                      return (
                        <button
                          aria-pressed={selected}
                          className={styles.move}
                          data-selected={selected ? "true" : "false"}
                          key={move.id}
                          onClick={() => setSelectedMoveId(move.id)}
                          type="button"
                        >
                          <span>0{index + 1}</span>
                          <small>{move.principle}</small>
                          <strong>{move.title}</strong>
                          <p>{move.detail}</p>
                          <b aria-hidden="true">{selected ? "●" : "○"}</b>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.commitRow}>
                    <span>
                      {selectedMove
                        ? selectedMove.principle
                        : "No move selected"}
                    </span>
                    <button
                      disabled={!selectedMove}
                      onClick={makeMove}
                      type="button"
                    >
                      Commit move
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              )}

              {phase === "thinking" && (
                <div
                  className={styles.thinking}
                  aria-live="polite"
                  aria-busy="true"
                >
                  <span className={styles.thinkingKing} aria-hidden="true">
                    ♚
                  </span>
                  <div>
                    <small>The board is changing</small>
                    <h2>The King is choosing independently.</h2>
                    <p>
                      Same situation. Same company metrics. No access to your
                      choice or the hidden consequences.
                    </p>
                    <i aria-hidden="true" />
                  </div>
                </div>
              )}

              {phase === "counter" &&
                selectedMove &&
                kingChoice &&
                kingMove && (
                <div className={styles.counter} aria-live="polite">
                  <div className={styles.counterTitle}>
                    <span>The King chose</span>
                    <small>
                      {engine === "ai" ? "AI opponent" : "Strategy simulation"}
                    </small>
                    <h2>{kingMove.title}</h2>
                  </div>
                  <div className={styles.counterBody}>
                    <p>{kingChoice.why}</p>
                    <blockquote>“{kingChoice.kingLine}”</blockquote>
                    {lastPlayerImpact && roundOutcome && (
                      <div className={styles.exchange}>
                        <div className={styles.exchangeSide}>
                          <span>Your decision</span>
                          <strong className={styles.exchangeChoice}>
                            {selectedMove.title}
                          </strong>
                          <ImpactList impact={lastPlayerImpact} />
                          <div className={styles.decisionTotal}>
                            <small>Decision score</small>
                            <strong>
                              {formatImpact(roundOutcome.youScore)}
                            </strong>
                          </div>
                        </div>
                        <div className={styles.exchangeVs} aria-hidden="true">
                          <span>VS</span>
                        </div>
                        <div className={styles.exchangeSide}>
                          <span>King&apos;s decision</span>
                          <strong className={styles.exchangeChoice}>
                            {kingMove.title}
                          </strong>
                          <ImpactList impact={kingMove.impact} />
                          <div className={styles.decisionTotal}>
                            <small>Decision score</small>
                            <strong>
                              {formatImpact(roundOutcome.kingScore)}
                            </strong>
                          </div>
                        </div>
                        <div className={styles.roundResult}>
                          <div className={styles.roundResultTitle}>
                            <span>Round {round.code} / decision result</span>
                            <strong data-winner={roundOutcome.winner}>
                              {roundOutcome.winner === "even"
                                ? "Even round"
                                : roundOutcome.winner === "you"
                                  ? "Round to you"
                                  : "Round to the King"}
                            </strong>
                          </div>
                          <div className={styles.roundPoints}>
                            <span>
                              You{" "}
                              <strong>
                                {formatImpact(roundOutcome.youScore)}
                              </strong>
                            </span>
                            <small>
                              Decision score = Capital + Trust + Momentum +
                              Leverage. Higher total wins the round.
                            </small>
                            <span>
                              King{" "}
                              <strong>
                                {formatImpact(roundOutcome.kingScore)}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <button type="button" onClick={continueGame}>
                      {roundIndex === gameBoard.rounds.length - 1
                        ? "Resolve the board"
                        : "Next position"}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {phase === "complete" && (
        <section className={styles.complete}>
          <div className={styles.completeMark} aria-hidden="true">
            ♚
          </div>
          <div className={styles.completeCopy}>
            <span>{result.eyebrow}</span>
            <h1>{result.title}</h1>
            <p>{result.detail}</p>
            <DuelBoard score={duelScore} roundsPlayed={history.length} />
            <MetricBoard metrics={metrics} />
            <div className={styles.completeActions}>
              <button onClick={startGame} type="button">
                Play another board
              </button>
              <Link href="/">Return to profile</Link>
            </div>
          </div>
          <div className={styles.moveRecord}>
            <span>Move record</span>
            {history.map((turn) => (
              <article key={turn.round}>
                <small>0{turn.round + 1}</small>
                <p>{turn.userMove}</p>
                <strong>{turn.kingMove}</strong>
                <span>
                  You {formatImpact(turn.youScore)} / King{" "}
                  {formatImpact(turn.kingScore)}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <button
        aria-expanded={helpPhase !== "closed"}
        aria-label="Open how to play"
        className={styles.helpButton}
        data-pulse={helpPulse ? "true" : "false"}
        onClick={openHelp}
        ref={helpButtonRef}
        type="button"
      >
        <span aria-hidden="true">?</span>
        <strong>How to play</strong>
      </button>

      {helpPhase !== "closed" && (
        <div
          className={styles.helpOverlay}
          data-state={helpPhase}
          role="presentation"
        >
          <div
            aria-labelledby="how-to-play-title"
            aria-modal="true"
            className={styles.helpPanel}
            data-state={helpPhase}
            ref={helpPanelRef}
            role="dialog"
          >
            <div className={styles.helpTop}>
              <span>Before the first move</span>
              <button
                aria-label="Close how to play"
                onClick={closeHelp}
                ref={helpCloseRef}
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className={styles.helpIntro}>
              <small>Move The King / rules</small>
              <h2 id="how-to-play-title">How to play.</h2>
              <p>
                One company, one position, two decision-makers. You and the
                King choose independently; the better judgment wins.
              </p>
            </div>
            <ol className={styles.helpSteps}>
              <li>
                <span>01</span>
                <div>
                  <strong>Read the position</strong>
                  <p>Notice the pressure behind the obvious opportunity.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Choose one move</strong>
                  <p>
                    Every option trades Capital, Trust, Momentum, and Leverage.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Compare the decisions</strong>
                  <p>
                    The AI King chooses independently from the same options. It
                    cannot see your choice or the hidden consequences.
                  </p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>Build the stronger score</strong>
                  <p>
                    Each decision score is Capital + Trust + Momentum +
                    Leverage. Round scores accumulate across all four
                    positions; the company itself follows your path.
                  </p>
                </div>
              </li>
            </ol>
            <div className={styles.helpFoot}>
              <span>Close this guide any time.</span>
              <strong>
                It lives here
                <span aria-hidden="true">↘</span>
              </strong>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <span>Vlad Budko / 2026</span>
        <span>
          {boardEngine === "ai" || engine === "ai"
            ? "Board & opponent: GPT-5.4 mini"
            : "Board & opponent: local strategy engine"}
        </span>
        <Link href="/">Exit game</Link>
      </footer>
    </main>
  );
}
