"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, Transaction } from "@solana/web3.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Zap, Loader2, CheckCircle, XCircle, Box } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type AnalysisStatus = "idle" | "paying" | "verifying" | "analyzing" | "complete" | "error";

interface AnalysisResult {
  verdict: "TRASH" | "GEM" | "MEH";
  confidence: number;
  summary: string;
  details: string[];
}

const MOCK_RESULTS: Record<string, AnalysisResult> = {
  TRASH: {
    verdict: "TRASH",
    confidence: 94,
    summary: "The joints are wrong. Would not hold. Noise.",
    details: [
      "Liquidity pool: DANGEROUSLY LOW",
      "Top 10 holders own 87% of supply",
      "Contract: unverified, suspicious mint authority",
      "Social signals: bot activity detected",
      "Verdict: Bad timber. Not worth building on.",
    ],
  },
  GEM: {
    verdict: "GEM",
    confidence: 78,
    summary: "Good joints. Solid structure. Worth examining further.",
    details: [
      "Liquidity pool: HEALTHY",
      "Distribution: well-spread among holders",
      "Contract: verified, mint authority renounced",
      "Community: organic growth patterns detected",
      "Verdict: Good timber. The craft approves. 匠",
    ],
  },
  MEH: {
    verdict: "MEH",
    confidence: 52,
    summary: "Inconclusive. The wood is green. Needs seasoning.",
    details: [
      "Liquidity pool: MODERATE",
      "Distribution: concentrated but not alarming",
      "Contract: verified but has admin keys",
      "Activity: mixed signals",
      "Verdict: Set aside. Watch. Decide later.",
    ],
  },
};

export default function CompactService() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [tokenAddress, setTokenAddress] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const compactPrice = process.env.NEXT_PUBLIC_COMPACT_PRICE || "0.01";

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".animate-in"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, []);

  const handleCompact = useCallback(async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!tokenAddress || tokenAddress.length < 32) {
      setError("Please enter a valid Solana token address.");
      return;
    }

    setError(null);
    setResult(null);
    setStatus("paying");

    try {
      const createRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          tokenToAnalyze: tokenAddress,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create payment transaction");
      }

      const { transaction: txBase64, invoiceParams } = await createRes.json();

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          "https://api.mainnet-beta.solana.com",
        "confirmed"
      );

      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const signed = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(
        signed.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("verifying");

      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          invoiceParams,
        }),
      });

      const { paid } = await verifyRes.json();

      if (!paid) {
        throw new Error("Payment verification failed");
      }

      setStatus("analyzing");

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Pick a mock result based on the token address hash
      const hash = tokenAddress
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0);
      const verdicts: Array<"TRASH" | "GEM" | "MEH"> = [
        "TRASH",
        "GEM",
        "MEH",
      ];
      const verdict = verdicts[hash % 3];
      setResult(MOCK_RESULTS[verdict]);
      setStatus("complete");
    } catch (err) {
      console.error("Compact error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setStatus("error");
    }
  }, [connected, publicKey, signTransaction, tokenAddress]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRASH":
        return "#B7410E";
      case "GEM":
        return "#FFBF00";
      case "MEH":
        return "#71797E";
      default:
        return "#C2B280";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "paying":
        return "PROCESSING PAYMENT...";
      case "verifying":
        return "VERIFYING TRANSACTION...";
      case "analyzing":
        return "INUGAMI IS EVALUATING...";
      case "complete":
        return "ANALYSIS COMPLETE";
      case "error":
        return "ERROR ENCOUNTERED";
      default:
        return "";
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 px-4">
      <div className="section-divider mb-16" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in">
          <span className="text-xs tracking-[0.3em] text-steel uppercase mb-3 block">
            SERVICE MODULE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-indigo glow-indigo mb-4">
            EVALUATE A TOKEN
          </h2>
          <p className="text-stone text-sm max-w-lg mx-auto">
            Submit any Solana token for INUGAMI&apos;s evaluation. A craftsman&apos;s
            eye on the joints — good timber or noise.
          </p>
        </div>

        {/* Compact form */}
        <div
          ref={formRef}
          className="animate-in industrial-border rounded-xl p-8 bg-wasteland-light/30 backdrop-blur-sm"
        >
          {/* Price banner */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-steel/20">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-amber" />
              <span className="text-sm text-sand">COMPACTION FEE</span>
            </div>
            <span className="text-lg font-bold text-amber glow-amber">
              {compactPrice} SOL
            </span>
          </div>

          {/* Token input */}
          <div className="mb-6">
            <label className="block text-xs tracking-[0.2em] text-steel uppercase mb-2">
              TOKEN ADDRESS
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter Solana token mint address..."
                className="w-full bg-wasteland-dark border border-steel/20 rounded-lg py-3 pl-12 pr-4 text-sand placeholder:text-steel/40 focus:outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/20 transition-all font-mono text-sm"
                disabled={status !== "idle" && status !== "complete" && status !== "error"}
              />
            </div>
          </div>

          {/* Wallet + Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-shrink-0">
              <WalletMultiButton />
            </div>

            <button
              onClick={handleCompact}
              disabled={
                !connected ||
                !tokenAddress ||
                (status !== "idle" && status !== "complete" && status !== "error")
              }
              className="compact-btn flex-1 flex items-center justify-center gap-2 bg-rust hover:bg-rust-light disabled:bg-steel/20 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
            >
              {status === "paying" ||
              status === "verifying" ||
              status === "analyzing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {getStatusText()}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  COMPACT THIS TRASH
                </>
              )}
            </button>
          </div>

          {/* Status indicator */}
          {status !== "idle" && (
            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm">
                {(status === "paying" ||
                  status === "verifying" ||
                  status === "analyzing") && (
                  <div className="flex items-center gap-2 text-amber">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="animate-pulse">{getStatusText()}</span>
                  </div>
                )}
                {status === "complete" && (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>{getStatusText()}</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-4 h-4" />
                    <span>{getStatusText()}</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {(status === "paying" ||
                status === "verifying" ||
                status === "analyzing") && (
                <div className="mt-3 w-full h-1 bg-wasteland-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber rounded-full transition-all duration-1000"
                    style={{
                      width:
                        status === "paying"
                          ? "33%"
                          : status === "verifying"
                            ? "66%"
                            : "90%",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Analysis result */}
          {result && (
            <div
              className="rounded-lg p-6 border transition-all duration-500"
              style={{
                borderColor: `${getVerdictColor(result.verdict)}40`,
                backgroundColor: `${getVerdictColor(result.verdict)}08`,
              }}
            >
              {/* Verdict header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getVerdictColor(result.verdict) }}
                  >
                    {result.verdict === "TRASH" && "🗑️"}
                    {result.verdict === "GEM" && "💎"}
                    {result.verdict === "MEH" && "🤷"}
                  </span>
                  <span
                    className="text-xl font-bold tracking-wider"
                    style={{ color: getVerdictColor(result.verdict) }}
                  >
                    VERDICT: {result.verdict}
                  </span>
                </div>
                <span className="text-sm text-steel">
                  {result.confidence}% confidence
                </span>
              </div>

              {/* Summary */}
              <p className="text-sand text-sm mb-4 italic">
                &quot;{result.summary}&quot;
              </p>

              {/* Details */}
              <div className="space-y-2">
                {result.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-steel"
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: getVerdictColor(result.verdict),
                      }}
                    />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-steel/50 mt-6 animate-in">
          INUGAMI&apos;s evaluation is for entertainment purposes only. Not
          financial advice. INUGAMI is a 犬神.
        </p>
      </div>
    </section>
  );
}
