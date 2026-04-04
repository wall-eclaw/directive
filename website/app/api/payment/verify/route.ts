import { NextRequest, NextResponse } from "next/server";
import {
  verifyPayment,
  generateInvoiceParamsFromDirect,
} from "@/lib/pump-agent";
import type { InvoiceParams } from "@/lib/pump-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet, invoiceParams, amount, memo, startTime, endTime } =
      body;

    if (!userWallet || typeof userWallet !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid userWallet" },
        { status: 400 }
      );
    }

    let resolvedParams: InvoiceParams;

    // If direct params are provided (from pay page), build invoiceParams
    if (
      typeof amount === "number" &&
      typeof memo === "number" &&
      typeof startTime === "number" &&
      typeof endTime === "number"
    ) {
      resolvedParams = generateInvoiceParamsFromDirect(
        userWallet,
        amount,
        memo,
        startTime,
        endTime
      );
    } else if (invoiceParams && typeof invoiceParams === "object") {
      // Legacy: compact service flow passes invoiceParams directly
      resolvedParams = invoiceParams as InvoiceParams;
    } else {
      return NextResponse.json(
        {
          error:
            "Missing required parameters. Provide either (amount, memo, startTime, endTime) or invoiceParams.",
        },
        { status: 400 }
      );
    }

    const paid = await verifyPayment(userWallet, resolvedParams);

    return NextResponse.json({ paid });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
