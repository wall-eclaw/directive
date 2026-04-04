"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Download,
  RefreshCw,
  Flame,
  Pause,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { MOCK_DECISIONS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

type ActionType = "CLAIM" | "BUYBACK" | "BURN" | "HOLD";

interface Decision {
  id: number;
  timestamp: string;
  action: ActionType;
  amount: string;
  reasoning: string;
}

function getActionIcon(action: ActionType) {
  switch (action) {
    case "CLAIM":
      return <Download className="w-3.5 h-3.5" />;
    case "BUYBACK":
      return <RefreshCw className="w-3.5 h-3.5" />;
    case "BURN":
      return <Flame className="w-3.5 h-3.5" />;
    case "HOLD":
      return <Pause className="w-3.5 h-3.5" />;
  }
}

function getActionColor(action: ActionType) {
  switch (action) {
    case "CLAIM":
      return "#22C55E";
    case "BUYBACK":
      return "#FFBF00";
    case "BURN":
      return "#B7410E";
    case "HOLD":
      return "#71797E";
  }
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function FeedEntry({
  decision,
  index,
  triggered,
}: {
  decision: Decision;
  index: number;
  triggered: boolean;
}) {
  const entryRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!triggered) return;

    const delay = index * 400;
    const timer = setTimeout(() => {
      setIsTyping(true);
      let charIndex = 0;
      const text = decision.reasoning;
      const typeInterval = setInterval(() => {
        charIndex++;
        setDisplayedText(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 20);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [triggered, decision.reasoning, index]);

  const actionColor = getActionColor(decision.action);

  return (
    <div
      ref={entryRef}
      className="border-b border-steel/10 py-3 px-4 hover:bg-wasteland-light/30 transition-colors duration-200"
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Timestamp */}
        <span className="text-xs text-steel/50 font-mono whitespace-nowrap mt-0.5">
          [{formatTimestamp(decision.timestamp)}]
        </span>

        {/* Action badge */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
          style={{
            backgroundColor: `${actionColor}15`,
            color: actionColor,
            border: `1px solid ${actionColor}30`,
          }}
        >
          {getActionIcon(decision.action)}
          <span>{decision.action}</span>
        </div>

        {/* Amount */}
        <span
          className="text-xs font-bold whitespace-nowrap mt-0.5"
          style={{ color: actionColor }}
        >
          {decision.amount}
        </span>

        {/* Reasoning with typewriter */}
        <span ref={textRef} className="text-xs text-green-400/80 flex-1 mt-0.5">
          {displayedText}
          {isTyping && <span className="cursor-blink" />}
        </span>
      </div>
    </div>
  );
}

export default function DecisionFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [decisions] = useState<Decision[]>(
    MOCK_DECISIONS as unknown as Decision[]
  );

  const visibleDecisions = expanded ? decisions : decisions.slice(0, 5);

  useEffect(() => {
    if (!sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => setTriggered(true),
      once: true,
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      <div className="section-divider mb-16" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.3em] text-steel uppercase mb-3 block">
            DECISION LOG
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-green-400 glow-green mb-4">
            LIVE FEED
          </h2>
          <p className="text-steel text-sm max-w-lg mx-auto">
            Watch INUGAMI work in real-time. Every claim, buyback, burn, and
            hold decision — logged and marked.
          </p>
        </div>

        {/* Terminal container */}
        <div className="terminal-feed rounded-xl border border-steel/20 overflow-hidden">
          {/* Terminal header bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-wasteland-dark/80 border-b border-steel/20">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber" />
              <span className="text-xs text-amber font-bold tracking-wider">
                INUGAMI_BUILD_LOG
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500/70">STREAMING</span>
            </div>
          </div>

          {/* System message */}
          <div className="px-4 py-2 border-b border-steel/10 bg-wasteland-dark/40">
            <span className="text-xs text-amber/60">
              {"> "}SYSTEM: Connected to INUGAMI forge. Displaying
              recent operations...
            </span>
          </div>

          {/* Feed entries */}
          <div className="max-h-[500px] overflow-y-auto">
            {visibleDecisions.map((decision, i) => (
              <FeedEntry
                key={decision.id}
                decision={decision}
                index={i}
                triggered={triggered}
              />
            ))}
          </div>

          {/* Expand / collapse */}
          {decisions.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs text-steel hover:text-amber transition-colors border-t border-steel/10 bg-wasteland-dark/30"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
              {expanded ? "SHOW LESS" : `SHOW ${decisions.length - 5} MORE`}
            </button>
          )}

          {/* Terminal footer */}
          <div className="px-4 py-2 border-t border-steel/10 bg-wasteland-dark/60">
            <span className="text-xs text-steel/40">
              {"> "}Awaiting next decision
              <span className="cursor-blink" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
