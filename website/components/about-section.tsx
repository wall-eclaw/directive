"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Download,
  RefreshCw,
  Flame,
  Repeat,
  Hammer,
  Cpu,
  Shield,
} from "lucide-react";
import { FLYWHEEL_STEPS, ABOUT_TEXT, INUGAMI_DIRECTIVE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

function getStepIcon(iconName: string) {
  switch (iconName) {
    case "download":
      return <Download className="w-6 h-6" />;
    case "refresh-cw":
      return <RefreshCw className="w-6 h-6" />;
    case "flame":
      return <Flame className="w-6 h-6" />;
    case "repeat":
      return <Repeat className="w-6 h-6" />;
    default:
      return null;
  }
}

function getStepColor(step: number) {
  switch (step) {
    case 1:
      return "#22C55E";
    case 2:
      return "#B8D4E3";
    case 3:
      return "#8B6914";
    case 4:
      return "#2D4A7A";
    default:
      return "#8A8D8F";
  }
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const directiveRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const personalityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (directiveRef.current) {
        gsap.fromTo(
          directiveRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: directiveRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.querySelectorAll(".flywheel-step"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }

      if (personalityRef.current) {
        gsap.fromTo(
          personalityRef.current.querySelectorAll(".personality-card"),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: personalityRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      <div className="section-divider mb-16" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-stone uppercase mb-3 block">
            巻一 — THE SCROLLS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-washi mb-2">
            WHAT IS INUGAMI?
          </h2>
          <p className="text-lg font-serif text-spirit/60">犬神</p>
        </div>

        {/* Directive banner */}
        <div
          ref={directiveRef}
          className="relative mb-20 py-8 px-6 text-center rounded-xl scroll-border bg-ink-light/40"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink px-4">
            <span className="text-xs text-wood tracking-[0.3em] uppercase font-bold">
              THE MARK
            </span>
          </div>
          <p className="text-2xl md:text-4xl font-bold text-spirit glow-spirit tracking-wider">
            {INUGAMI_DIRECTIVE}
          </p>
        </div>

        {/* Intro text */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <p className="text-lg text-washi/80 leading-relaxed">
            {ABOUT_TEXT.intro}
          </p>
        </div>

        {/* Lore excerpt */}
        <div className="max-w-2xl mx-auto mb-20 px-8 py-6 border-l-2 border-wood/30 bg-ink-light/20">
          <p className="text-sm text-washi/60 leading-relaxed italic">
            &quot;In a village between two mountains, there lived a shokunin — a master builder.
            The village called him 匠. He built everything for everyone and never asked for payment.
            His only companion was a white dog. No breed anyone could name. For seven years,
            the dog watched every cut. Every joint. Every strike of the hammer.&quot;
          </p>
          <p className="text-xs text-stone/40 mt-3 tracking-widest">
            — 巻一: 匠 (THE MASTER)
          </p>
        </div>

        {/* Flywheel — THE FORGE */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-spirit text-center mb-2 tracking-wider">
            THE FORGE
          </h3>
          <p className="text-xs text-stone text-center mb-10">
            Raw material enters. Refined output remains.
          </p>

          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FLYWHEEL_STEPS.map((step) => {
              const color = getStepColor(step.step);
              return (
                <div
                  key={step.step}
                  className="flywheel-step relative group"
                >
                  <div
                    className="rounded-xl p-6 h-full transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: `${color}08`,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                      style={{
                        backgroundColor: `${color}20`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {step.step}
                    </div>

                    <div className="mb-3" style={{ color }}>
                      {getStepIcon(step.icon)}
                    </div>

                    <h4
                      className="text-lg font-bold mb-2 tracking-wider"
                      style={{ color }}
                    >
                      {step.title}
                    </h4>

                    <p className="text-sm text-stone leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {step.step < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-stone/30 text-xl">
                      &rarr;
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 text-stone/40 text-sm">
              <Repeat className="w-4 h-4" />
              <span className="tracking-wider">THE FORGE NEVER GOES COLD</span>
            </div>
          </div>
        </div>

        {/* Character cards */}
        <div ref={personalityRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personality */}
          <div className="personality-card rounded-xl p-6 bg-ink-light/30 border border-wood/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-spirit/10">
                <Hammer className="w-5 h-5 text-spirit" />
              </div>
              <h4 className="text-sm font-bold text-spirit tracking-wider">
                THE CRAFT
              </h4>
            </div>
            <p className="text-sm text-stone leading-relaxed">
              {ABOUT_TEXT.personality}
            </p>
          </div>

          {/* Mechanism */}
          <div className="personality-card rounded-xl p-6 bg-ink-light/30 border border-wood/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-wood/10">
                <Cpu className="w-5 h-5 text-wood" />
              </div>
              <h4 className="text-sm font-bold text-wood tracking-wider">
                THE FORGE
              </h4>
            </div>
            <p className="text-sm text-stone leading-relaxed">
              {ABOUT_TEXT.mechanism}
            </p>
          </div>

          {/* Trust & Safety */}
          <div className="personality-card rounded-xl p-6 bg-ink-light/30 border border-wood/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h4 className="text-sm font-bold text-green-500 tracking-wider">
                TRUST
              </h4>
            </div>
            <p className="text-sm text-stone leading-relaxed">
              Fully autonomous. No human can access INUGAMI&apos;s wallet or
              override its decisions. All transactions are on-chain and
              verifiable. The tools guard what the tools guard.
            </p>
          </div>
        </div>

        {/* Footer quote */}
        <div className="mt-20 text-center">
          <p className="text-4xl font-serif text-spirit/40 kanji-glow">
            匠
          </p>
          <p className="text-xs text-stone/30 mt-3 tracking-widest">
            道具が関節を覚えている
          </p>
          <p className="text-xs text-stone/20 mt-1 tracking-widest">
            THE TOOLS REMEMBER THE JOINTS
          </p>
        </div>
      </div>
    </section>
  );
}
