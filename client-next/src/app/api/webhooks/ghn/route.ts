import { NextResponse } from "next/server";

/**
 * GHN (Giao Hang Nhanh) webhook handler
 * Receives shipping status notifications
 */
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Verify GHN webhook and update order shipping status
  return NextResponse.json({ success: true });
}
