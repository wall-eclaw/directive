"use client";

import React, { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import SolanaWalletProvider from "@/components/wallet-provider";
import { Loader2, CheckCircle, XCircle, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PaymentStatus = "idle" | "building_tx" | "signing" | "confirming" | "verified" | "error";

function PaymentPageInner() {
  const searchParams = useSearchParams();
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const memo = searchParams.get("memo") || "";
  const amountLamports = searchParams.get("amount") || "0";
  const idea = searchParams.get("idea") || "";
  const startTime = searchParams.get("startTime") || "0";
  const endTime = searchParams.get("endTime") || "0";

  const amountSOL = useMemo(() => {
    const lamports = parseInt(amountLamports, 10);
    if (isNaN(lamports) || lamports <= 0) return 0;
    return lamports / LAMPORTS_PER_SOL;
  }, [amountLamports]);

  const decodedIdea = useMemo(() => {
    try { return decodeURIComponent(idea.replace(/\+/g, " ")); }
    catch { return idea; }
  }, [idea]);

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"wallet" | "qr">("qr");

  const isValidParams = memo && amountSOL > 0 && decodedIdea && startTime !== "0" && endTime !== "0";

  const PAYMENT_ADDRESS = "Andz21US77SB8G1TyWPkfVBCPVrNRZLFJ2XYETcyYJCA";
  const solanaPayUrl = `solana:${PAYMENT_ADDRESS}?amount=${amountSOL}&label=WEN+Build&message=${encodeURIComponent(decodedIdea)}&memo=${memo}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(solanaPayUrl)}`;

  const handlePay = useCallback(async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError("connect your wallet first 🦊");
      return;
    }
    if (!isValidParams) {
      setError("missing payment parameters");
      return;
    }

    setError(null);
    setStatus("building_tx");

    try {
      const createRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          amount: parseInt(amountLamports, 10),
          memo: parseInt(memo, 10),
          startTime: parseInt(startTime, 10),
          endTime: parseInt(endTime, 10),
        }),
      });

      if (!createRes.ok) {
        const errData = await createRes.json().catch(() => ({}));
        throw new Error(errData.error || "failed to create transaction");
      }

      const { transaction: txBase64 } = await createRes.json();
      setStatus("signing");
      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const signed = await signTransaction(tx);

      setStatus("confirming");
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          amount: parseInt(amountLamports, 10),
          memo: parseInt(memo, 10),
          startTime: parseInt(startTime, 10),
          endTime: parseInt(endTime, 10),
        }),
      });

      const { paid } = await verifyRes.json();
      if (!paid) throw new Error("payment verification failed");
      setStatus("verified");
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "something went wrong");
      setStatus("error");
    }
  }, [connected, publicKey, signTransaction, connection, isValidParams, amountLamports, memo, startTime, endTime]);

  const getStatusMessage = () => {
    switch (status) {
      case "building_tx": return "building transaction...";
      case "signing": return "waiting for signature...";
      case "confirming": return "confirming on-chain...";
      case "verified": return "confirmed ✅";
      case "error": return "error";
      default: return "";
    }
  };

  const getProgressWidth = () => {
    switch (status) {
      case "building_tx": return "25%";
      case "signing": return "50%";
      case "confirming": return "75%";
      case "verified": return "100%";
      default: return "0%";
    }
  };

  const isProcessing = status === "building_tx" || status === "signing" || status === "confirming";

  if (!isValidParams) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-lg w-full bg-card/50 border-border/50 text-center">
          <CardContent className="pt-8 pb-8">
            <span className="text-4xl mb-4 block">🦊</span>
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>invalid payment link</h1>
            <p className="text-sm text-muted-foreground mb-6">this link is expired or broken. tag wen for a new one.</p>
            <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full">@wendonedotfun on X</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-lg w-full bg-card/50 border-border/50 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-500 mb-2" style={{ fontFamily: "var(--font-display)" }}>paid ✅</h1>
            <p className="text-sm text-muted-foreground mb-6">wen is building now. watch progress on X 🦊</p>

            <div className="space-y-3 mb-8 text-left">
              <div className="p-3 rounded-lg bg-secondary border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">YOUR IDEA</span>
                <p className="text-sm">&quot;{decodedIdea}&quot;</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">PAID</span>
                <p className="text-lg font-bold text-primary">{amountSOL} SOL</p>
              </div>
            </div>

            <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full gap-2">
                <ExternalLink className="w-4 h-4" /> follow @wendonedotfun
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary tracking-wider">BUILD REQUEST</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>pay wen 🦊</h1>
          <p className="text-sm text-muted-foreground">revenue goes straight to buyback & burn</p>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="mb-6">
              <span className="text-xs text-muted-foreground tracking-wider block mb-2">WEN WILL BUILD</span>
              <div className="p-3 rounded-lg bg-secondary border border-border/50">
                <p className="text-sm">&quot;{decodedIdea}&quot;</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm">build fee</span>
              </div>
              <span className="text-2xl font-bold text-primary">{amountSOL} SOL</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-secondary border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">MEMO</span>
                <span className="text-xs font-mono truncate block">{memo}</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">EXPIRES</span>
                <span className="text-xs font-mono block">
                  <CountdownTimer endTime={parseInt(endTime, 10)} />
                </span>
              </div>
            </div>

            <div className="flex mb-6 rounded-lg overflow-hidden border border-border/50">
              <button
                onClick={() => setPayMethod("qr")}
                className={`flex-1 py-2.5 text-xs tracking-wider font-semibold transition-all ${payMethod === "qr" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                QR CODE
              </button>
              <button
                onClick={() => setPayMethod("wallet")}
                className={`flex-1 py-2.5 text-xs tracking-wider font-semibold transition-all ${payMethod === "wallet" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                WALLET
              </button>
            </div>

            {payMethod === "qr" ? (
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl">
                  <img src={qrUrl} alt="Scan to pay" width={220} height={220} />
                </div>
                <p className="text-xs text-muted-foreground text-center">scan with any solana wallet</p>
                <div className="w-full p-3 rounded-lg bg-secondary border border-border/50">
                  <span className="text-xs text-muted-foreground block mb-1">PAYMENT ADDRESS</span>
                  <code className="text-xs font-mono break-all">{PAYMENT_ADDRESS}</code>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  after paying, reply to wen&apos;s tweet with your tx signature or &quot;paid&quot;
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
                <Button
                  onClick={handlePay}
                  disabled={!connected || isProcessing}
                  className="w-full rounded-full gap-2 font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{getStatusMessage()}</>
                  ) : (
                    <>🦊 pay wen</>
                  )}
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="mb-6">
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: getProgressWidth() }} />
                </div>
                <p className="text-xs text-primary/70 mt-2 text-center animate-pulse">{getStatusMessage()}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground/50 mt-4">
              payment via pump.fun agent payments. revenue → buyback & burn 🦊
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a href="https://x.com/wendonedotfun" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            @wendonedotfun on X
          </a>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTime - now;
      if (diff <= 0) { setTimeLeft("EXPIRED"); return; }
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setTimeLeft(hours > 0
        ? `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
        : `${minutes}m ${seconds.toString().padStart(2, "0")}s`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <>{timeLeft}</>;
}

export default function PayPage() {
  return (
    <SolanaWalletProvider>
      <main className="relative">
        <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-xl px-4 py-2 shadow-lg shadow-black/20">
            <a href="/" className="flex items-center gap-2">
              <Image src="/wen.png" alt="wen" width={24} height={24} />
              <span className="text-sm font-semibold">WEN</span>
            </a>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />
          </div>
        </nav>

        <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-20 text-muted-foreground">loading... 🦊</div>}>
          <PaymentPageInner />
        </Suspense>
      </main>
    </SolanaWalletProvider>
  );
}
