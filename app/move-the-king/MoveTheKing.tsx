"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  applyImpact,
  gameResult,
  getLocalCounter,
  initialMetrics,
  metricKeys,
  rounds,
  type CounterMove,
  type Metrics,
  type TurnHistory,
} from "./game";
import styles from "./move-the-king.module.css";

type Phase = "intro" | "turn" | "thinking" | "counter" | "complete";

type CounterResponse = {
  counter: CounterMove;
  mode: "ai" | "simulation";
  model?: string;
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
    <div className={styles.metricBoard} aria-label="Company metrics">
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

export default function MoveTheKing() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [counter, setCounter] = useState<CounterMove | null>(null);
  const [history, setHistory] = useState<TurnHistory[]>([]);
  const [engine, setEngine] = useState<"ai" | "simulation" | null>(null);
  const [lastPlayerImpact, setLastPlayerImpact] = useState<Metrics | null>(null);

  const round = rounds[roundIndex];
  const selectedMove = useMemo(
    () => round.moves.find((move) => move.id === selectedMoveId) ?? null,
    [round, selectedMoveId],
  );
  const result = gameResult(metrics);

  const startGame = () => {
    setRoundIndex(0);
    setMetrics(initialMetrics);
    setSelectedMoveId(null);
    setCounter(null);
    setHistory([]);
    setEngine(null);
    setLastPlayerImpact(null);
    setPhase("turn");
  };

  const makeMove = async () => {
    if (!selectedMove || phase !== "turn") return;

    const metricsAfterMove = applyImpact(metrics, selectedMove.impact);
    const minimumThinkingTime = new Promise((resolve) =>
      window.setTimeout(resolve, 900),
    );

    setLastPlayerImpact(selectedMove.impact);
    setMetrics(metricsAfterMove);
    setPhase("thinking");

    let response: CounterResponse = {
      counter: getLocalCounter(roundIndex, selectedMove.id, metricsAfterMove),
      mode: "simulation",
    };

    try {
      const request = fetch("/api/move-the-king", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round: roundIndex,
          moveId: selectedMove.id,
          metrics: metricsAfterMove,
          history,
        }),
      }).then(async (result) => {
        if (!result.ok) throw new Error("The king declined the move.");
        return (await result.json()) as CounterResponse;
      });

      response = await request;
    } catch {
      // The local strategy engine keeps the game playable if the AI is absent.
    }

    await minimumThinkingTime;

    const metricsAfterCounter = applyImpact(
      metricsAfterMove,
      response.counter.impact,
    );
    setCounter(response.counter);
    setEngine(response.mode);
    setMetrics(metricsAfterCounter);
    setHistory((current) => [
      ...current,
      {
        round: roundIndex,
        move: selectedMove.title,
        counter: response.counter.counterMove,
      },
    ]);
    setPhase("counter");
  };

  const continueGame = () => {
    if (roundIndex === rounds.length - 1) {
      setPhase("complete");
      return;
    }

    setRoundIndex((current) => current + 1);
    setSelectedMoveId(null);
    setCounter(null);
    setLastPlayerImpact(null);
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
          <small>{phase === "intro" ? "Business logic game" : "Position"}</small>
          <strong>
            {phase === "intro"
              ? "AI / 01"
              : `${String(Math.min(roundIndex + 1, rounds.length)).padStart(
                  2,
                  "0",
                )} / ${String(rounds.length).padStart(2, "0")}`}
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
                Build a company through four unstable positions. Every choice
                creates a trade-off. The King reads the board and moves against
                the weakness you leave exposed.
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

      {phase !== "intro" && phase !== "complete" && (
        <>
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
                    <h2>The King is reading your position.</h2>
                    <p>
                      Looking for the second-order cost, not the obvious
                      outcome.
                    </p>
                    <i aria-hidden="true" />
                  </div>
                </div>
              )}

              {phase === "counter" && counter && (
                <div className={styles.counter} aria-live="polite">
                  <div className={styles.counterTitle}>
                    <span>The King moves</span>
                    <small>
                      {engine === "ai" ? "AI opponent" : "Strategy simulation"}
                    </small>
                    <h2>{counter.counterMove}</h2>
                  </div>
                  <div className={styles.counterBody}>
                    <p>{counter.why}</p>
                    <blockquote>“{counter.kingLine}”</blockquote>
                    {lastPlayerImpact && (
                      <div className={styles.exchange}>
                        <div>
                          <span>Your move</span>
                          <ImpactList impact={lastPlayerImpact} />
                        </div>
                        <div>
                          <span>King&apos;s counter</span>
                          <ImpactList impact={counter.impact} />
                        </div>
                      </div>
                    )}
                    <button type="button" onClick={continueGame}>
                      {roundIndex === rounds.length - 1
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
                <p>{turn.move}</p>
                <strong>{turn.counter}</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <span>Vlad Budko / 2026</span>
        <span>
          {engine === "ai"
            ? "Opponent: GPT-5.4 mini"
            : "Opponent: local strategy engine"}
        </span>
        <Link href="/">Exit game</Link>
      </footer>
    </main>
  );
}
