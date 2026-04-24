import { NextResponse } from "next/server";

/**
 * VNPAY IPN webhook handler
 * Receives payment notifications from VNPAY gateway
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // TODO: Verify VNPAY secure hash and process IPN
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

  return NextResponse.json({
    RspCode: "00",
    Message: "Confirm Success",
  });
}
