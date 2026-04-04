import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const RPC_URL =
  process.env.SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const AGENT_TOKEN_MINT = process.env.AGENT_TOKEN_MINT_ADDRESS || "";
const CURRENCY_MINT =
  process.env.CURRENCY_MINT || "So11111111111111111111111111111111111111112";

export interface InvoiceParams {
  userWallet: string;
  currencyMint: string;
  amount: number;
  memo: number;
  startTime: number;
  endTime: number;
}

let pumpAgentInstance: PumpAgent | null = null;

function getPumpAgent(): PumpAgent {
  if (!pumpAgentInstance) {
    if (!AGENT_TOKEN_MINT) {
      throw new Error(
        "AGENT_TOKEN_MINT_ADDRESS environment variable is required"
      );
    }
    const connection = new Connection(RPC_URL, "confirmed");
    const mint = new PublicKey(AGENT_TOKEN_MINT);
    pumpAgentInstance = new PumpAgent(mint, "mainnet", connection);
  }
  return pumpAgentInstance;
}

/**
 * Generate invoice params from a token address (used by the compact service).
 */
export function generateInvoiceParams(
  userWallet: string,
  tokenToAnalyze: string
): InvoiceParams {
  const now = Math.floor(Date.now() / 1000);
  const compactPrice = parseFloat(
    process.env.NEXT_PUBLIC_COMPACT_PRICE || "0.01"
  );

  // Generate a deterministic memo from the token address and timestamp
  const memoValue = tokenToAnalyze
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), Date.now() % 1_000_000);

  return {
    userWallet,
    currencyMint: CURRENCY_MINT,
    amount: Math.floor(compactPrice * LAMPORTS_PER_SOL),
    memo: memoValue,
    startTime: now,
    endTime: now + 600,
  };
}

/**
 * Generate invoice params from direct values (used by the pay page).
 * The amount, memo, startTime, and endTime are passed directly from URL params.
 */
export function generateInvoiceParamsFromDirect(
  userWallet: string,
  amount: number,
  memo: number,
  startTime: number,
  endTime: number
): InvoiceParams {
  return {
    userWallet,
    currencyMint: CURRENCY_MINT,
    amount,
    memo,
    startTime,
    endTime,
  };
}

export async function buildPaymentTransaction(
  userWallet: string,
  invoiceParams: InvoiceParams
): Promise<string> {
  const agent = getPumpAgent();
  const connection = new Connection(RPC_URL, "confirmed");
  const userPubkey = new PublicKey(userWallet);
  const currencyMintPubkey = new PublicKey(invoiceParams.currencyMint);

  const instructions = await agent.buildAcceptPaymentInstructions({
    user: userPubkey,
    currencyMint: currencyMintPubkey,
    amount: invoiceParams.amount,
    memo: invoiceParams.memo,
    startTime: invoiceParams.startTime,
    endTime: invoiceParams.endTime,
  });

  const transaction = new Transaction();
  for (const ix of instructions) {
    transaction.add(ix);
  }

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = userPubkey;

  const serialized = transaction
    .serialize({ requireAllSignatures: false })
    .toString("base64");

  return serialized;
}

export async function verifyPayment(
  userWallet: string,
  invoiceParams: InvoiceParams
): Promise<boolean> {
  const agent = getPumpAgent();

  try {
    const paid = await agent.validateInvoicePayment({
      user: new PublicKey(userWallet),
      currencyMint: new PublicKey(invoiceParams.currencyMint),
      amount: invoiceParams.amount,
      memo: invoiceParams.memo,
      startTime: invoiceParams.startTime,
      endTime: invoiceParams.endTime,
    });
    return paid;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
}
