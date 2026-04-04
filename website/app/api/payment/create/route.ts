import { NextRequest, NextResponse } from "next/server";
import {
  generateInvoiceParams,
  generateInvoiceParamsFromDirect,
  buildPaymentTransaction,
} from "@/lib/pump-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet, tokenToAnalyze, amount, memo, startTime, endTime } =
      body;

    if (!userWallet || typeof userWallet !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid userWallet" },
        { status: 400 }
      );
    }

    let invoiceParams;

    // If direct params are provided (from pay page), use them
    if (
      typeof amount === "number" &&
      typeof memo === "number" &&
      typeof startTime === "number" &&
      typeof endTime === "number"
    ) {
      invoiceParams = generateInvoiceParamsFromDirect(
        userWallet,
        amount,
        memo,
        startTime,
        endTime
      );
    } else if (tokenToAnalyze && typeof tokenToAnalyze === "string") {
      // Legacy: compact service flow
      invoiceParams = generateInvoiceParams(userWallet, tokenToAnalyze);
    } else {
      return NextResponse.json(
        {
          error:
            "Missing required parameters. Provide either (amount, memo, startTime, endTime) or tokenToAnalyze.",
        },
        { status: 400 }
      );
    }

    const transaction = await buildPaymentTransaction(
      userWallet,
      invoiceParams
    );

    return NextResponse.json({
      transaction,
      invoiceParams,
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment transaction",
      },
      { status: 500 }
    );
  }
}
