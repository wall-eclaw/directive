import { NextResponse } from "next/server";

export async function GET() {
  const stats = {
    totalBurned: 4283291,
    totalClaimed: 847.32,
    solBalance: 12.45,
    decisionsCount: 15847,
    uptime: 99.7,
    trashProcessed: 2341,
  };

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
