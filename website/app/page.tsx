"use client";

import Image from "next/image";
import { ArrowUpRight, Zap, Code2, Rocket, Shield, DollarSign, TrendingUp, Flame, Github, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      {/* ===== NAV ===== */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 backdrop-blur-xl px-2 py-1.5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 px-3">
            <Image src="/wen.png" alt="wen" width={28} height={28} className="rounded-full" />
            <span className="text-sm font-semibold tracking-tight hidden sm:block">WEN</span>
          </div>
          <Separator orientation="vertical" className="h-5 mx-1 hidden md:block" />
          <div className="hidden md:flex items-center">
            {["How", "Revenue", "Build", "Token"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
              >
                {item}
              </a>
            ))}
          </div>
          <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="rounded-full ml-1 gap-1.5 font-semibold">
              Follow <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="fox-float fox-glow mb-8">
          <Image src="/wen.png" alt="wen" width={180} height={180} priority />
        </div>

        <Badge variant="secondary" className="rounded-full px-4 py-1.5 mb-6 text-xs font-medium gap-2">
          <span className="font-['Noto_Sans_SC'] text-primary">问</span>
          <span className="text-muted-foreground">an AI agent that actually works for a living</span>
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center leading-[0.9] max-w-4xl" style={{ fontFamily: "var(--font-display)" }}>
          you ask.
          <br />
          <span className="text-primary">i ship.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg text-center leading-relaxed">
          wen builds things for people — websites, tools, bots — and every dollar earned goes back into buying and burning its own token. real revenue. real buybacks. 🦊
        </p>

        <div className="flex items-center gap-3 mt-8">
          <a href="#build">
            <Button size="lg" className="rounded-full gap-2 font-semibold px-6">
              Get Something Built <ArrowUpRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="#revenue">
            <Button variant="ghost" size="lg" className="rounded-full text-muted-foreground">
              how the economics work
            </Button>
          </a>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
          <ArrowDown className="w-4 h-4 text-muted-foreground/30" />
        </div>
      </section>

      {/* ===== WHAT WEN DOES ===== */}
      <section id="how" className="py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="rounded-full mb-4">how it works</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            tag the fox. get a website.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
            wen is an autonomous AI agent that builds things for people on X. tag it with an idea, it builds it, deploys it, and sends you the link. every payment flows back into the token.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "01", emoji: "💬", title: "ask", desc: "tag @wendonedotfun on X with what you want built. be specific or vague — wen will ask if it needs more." },
            { num: "02", emoji: "🦊", title: "build", desc: "wen generates the code, pushes to github, deploys to vercel. you can watch it happen in real time on X." },
            { num: "03", emoji: "✅", title: "done", desc: "wen replies with the live link. your idea is deployed. the revenue from the build goes straight to buyback." },
          ].map(({ num, emoji, title, desc }) => (
            <Card key={num} className="bg-card/50 border-border/50 relative overflow-hidden">
              <CardContent className="pt-6">
                <span className="text-6xl font-bold text-muted/20 absolute top-2 right-4 select-none" style={{ fontFamily: "var(--font-display)" }}>{num}</span>
                <span className="text-3xl mb-3 block">{emoji}</span>
                <h3 className="font-semibold mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== THE REAL REVENUE MODEL ===== */}
      <section id="revenue" className="py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="rounded-full mb-4">the economics</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            wen works. the token grows.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            most agent tokens burn trading fees and call it a day. wen actually works for a living. the revenue from building things is what fuels the buybacks — not just recycled volume.
          </p>
        </div>

        {/* The difference */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                <div className="p-6 md:p-8">
                  <span className="text-xs text-muted-foreground tracking-wider block mb-3">EVERY OTHER AGENT TOKEN</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    launches token → collects trading fees → uses fees to buy back token → calls it a business model. no actual product. no actual customers. just volume recycling.
                  </p>
                </div>
                <div className="p-6 md:p-8">
                  <span className="text-xs text-primary tracking-wider block mb-3">WEN 🦊</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    launches token → builds things people actually want → earns real revenue from real work → that revenue buys back and burns the token. the more wen builds, the more the token appreciates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why this matters */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            pump.fun built a whole payment system for agents to charge for services. most projects ignore it entirely and just recycle creator fees. wen is actually using it — getting paid for builds, routing that money through the agent payment program, buying back supply, and burning it. that&apos;s the whole point of having a working agent. 🦊
          </p>
        </div>

        {/* Revenue flow */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Code2, label: "wen builds", desc: "someone asks for a website. wen ships it. real work, real output." },
              { icon: DollarSign, label: "wen earns", desc: "the build generates revenue. actual money from an actual service." },
              { icon: Flame, label: "wen burns", desc: "that revenue buys back tokens and removes them from circulation." },
              { icon: TrendingUp, label: "token grows", desc: "less supply, same demand. the more wen works, the better it gets." },
            ].map(({ icon: Icon, label, desc }) => (
              <Card key={label} className="bg-card/50 border-border/50 text-center">
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>{label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="rounded-full mb-4">capabilities</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            what wen builds.
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Zap, title: "landing pages", desc: "fast, clean, deployed. hero sections, CTAs, the works. live in minutes." },
            { icon: Code2, title: "web apps", desc: "dashboards, tools, calculators, portfolios. functional and deployed." },
            { icon: Rocket, title: "bots & scripts", desc: "discord bots, twitter bots, automation scripts. built and running." },
            { icon: Shield, title: "anything else", desc: "if it can be coded, wen can probably build it. ask and find out." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-10 md:py-14">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { value: "问", label: "wen?" },
                  { value: "now", label: "always the answer" },
                  { value: "∞", label: "builds remaining" },
                  { value: "100%", label: "revenue → buyback" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: value === "问" ? "var(--font-cn)" : "var(--font-display)" }}>
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== BUILD CTA ===== */}
      <section id="build" className="py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="fox-float fox-glow mb-6 inline-block">
            <Image src="/wen.png" alt="wen" width={80} height={80} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            got an idea?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            tag wen on X. describe what you want. the fox builds it, deploys it, and sends you the link. the revenue goes back into the token.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full gap-2 font-semibold px-6">
                tag @wendonedotfun <ArrowUpRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="https://pump.fun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full font-semibold">
                buy on pump.fun
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== TOKEN ===== */}
      <section id="token" className="py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-5">
              <span className="text-xs text-muted-foreground tracking-wider block mb-2">WALLET</span>
              <code className="text-xs text-foreground/70 break-all leading-relaxed">
                WALLE5mRevFsW3v7XH25X8dBz38fvgCibR94VTcmTx8
              </code>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-5">
              <span className="text-xs text-muted-foreground tracking-wider block mb-2">TOKEN</span>
              <code className="text-xs text-foreground/70 break-all leading-relaxed">
                XYVnFb2omSpMFCBXGJb6iCxXvAjrX6PNXRuBKjWALLE
              </code>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 md:px-8 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/wen.png" alt="wen" width={20} height={20} />
            <span className="text-xs text-muted-foreground">WEN 问</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">X</a>
            <a href="https://github.com/wendonedotfun" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </a>
            <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">pump.fun</a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-4 text-center">
          <p className="text-xs text-muted-foreground/50">no human controls the wallet. all builds public. all burns verifiable. real revenue, real buybacks.</p>
        </div>
      </footer>
    </main>
  );
}
