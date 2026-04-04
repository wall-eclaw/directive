"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Flame,
  Coins,
  Wallet,
  Clock,
  Brain,
  Recycle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  icon: React.ReactNode;
  color: string;
}

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  triggered,
}: {
  value: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  triggered: boolean;
}) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!triggered || hasAnimated.current || !counterRef.current) return;
    hasAnimated.current = true;

    const counter = { val: 0 };
    gsap.to(counter, {
      val: value,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          const formatted =
            decimals > 0
              ? counter.val.toFixed(decimals)
              : Math.floor(counter.val).toLocaleString();
          counterRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });
  }, [triggered, value, prefix, suffix, decimals]);

  return (
    <span ref={counterRef} className="text-3xl md:text-4xl font-bold">
      {prefix}0{suffix}
    </span>
  );
}

function GaugeBar({
  percentage,
  color,
  triggered,
}: {
  percentage: number;
  color: string;
  triggered: boolean;
}) {
  return (
    <div className="w-full h-1.5 bg-wasteland-dark rounded-full mt-3 overflow-hidden">
      <div
        className="h-full rounded-full gauge-fill"
        style={{
          width: triggered ? `${percentage}%` : "0%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [stats, setStats] = useState({
    totalBurned: 4283291,
    totalClaimed: 847.32,
    solBalance: 12.45,
    decisionsCount: 15847,
    uptime: 99.7,
    trashProcessed: 2341,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Use mock data on error
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => setTriggered(true),
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const statItems: StatItem[] = [
    {
      label: "TOKENS COMPACTED",
      value: stats.totalBurned,
      suffix: "",
      icon: <Flame className="w-6 h-6" />,
      color: "#B7410E",
    },
    {
      label: "SOL CLAIMED",
      value: stats.totalClaimed,
      suffix: " SOL",
      decimals: 2,
      icon: <Coins className="w-6 h-6" />,
      color: "#FFBF00",
    },
    {
      label: "SOL BALANCE",
      value: stats.solBalance,
      suffix: " SOL",
      decimals: 2,
      icon: <Wallet className="w-6 h-6" />,
      color: "#C2B280",
    },
    {
      label: "DECISIONS MADE",
      value: stats.decisionsCount,
      suffix: "",
      icon: <Brain className="w-6 h-6" />,
      color: "#71797E",
    },
    {
      label: "UPTIME",
      value: stats.uptime,
      suffix: "%",
      decimals: 1,
      icon: <Clock className="w-6 h-6" />,
      color: "#22C55E",
    },
    {
      label: "TRASH PROCESSED",
      value: stats.trashProcessed,
      suffix: "",
      icon: <Recycle className="w-6 h-6" />,
      color: "#8E5522",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      {/* Section divider */}
      <div className="section-divider mb-16" />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <span className="text-xs tracking-[0.3em] text-steel uppercase mb-3 block">
          SYSTEM DIAGNOSTICS
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-amber glow-amber mb-4">
          OPERATIONAL STATUS
        </h2>
        <p className="text-steel text-sm max-w-lg mx-auto">
          Real-time metrics from INUGAMI&apos;s autonomous operations on the
          Solana blockchain.
        </p>
      </div>

      {/* Stats grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-glow industrial-border rounded-lg p-6 bg-wasteland-light/50 backdrop-blur-sm transition-all duration-300 hover:bg-wasteland-light/70"
            style={{
              opacity: triggered ? 1 : 0,
              transform: triggered ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
            }}
          >
            {/* Icon and label */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-md"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <span className="text-xs tracking-[0.2em] text-steel uppercase">
                {stat.label}
              </span>
            </div>

            {/* Counter */}
            <div style={{ color: stat.color }}>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                decimals={stat.decimals}
                triggered={triggered}
              />
            </div>

            {/* Gauge */}
            <GaugeBar
              percentage={Math.min(
                ((stat.value /
                  (stat.label === "UPTIME"
                    ? 100
                    : stat.label === "SOL BALANCE"
                      ? 50
                      : stat.label === "SOL CLAIMED"
                        ? 2000
                        : stat.label === "DECISIONS MADE"
                          ? 50000
                          : stat.label === "TRASH PROCESSED"
                            ? 10000
                            : 10000000)) *
                  100),
                100
              )}
              color={stat.color}
              triggered={triggered}
            />

            {/* Decorative corner dots */}
            <div
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-50"
              style={{ backgroundColor: stat.color }}
            />
            <div
              className="absolute bottom-2 left-2 w-1 h-1 rounded-full opacity-30"
              style={{ backgroundColor: stat.color }}
            />
          </div>
        ))}
      </div>

      {/* Bottom status line */}
      <div className="max-w-6xl mx-auto mt-8 flex items-center justify-center gap-3 text-xs text-steel">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>ALL SYSTEMS OPERATIONAL</span>
        <span className="text-steel/30">|</span>
        <span className="text-amber/50">LAST UPDATE: LIVE</span>
      </div>
    </section>
  );
}
