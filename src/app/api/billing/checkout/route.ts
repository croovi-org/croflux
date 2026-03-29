import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan") ?? "unknown";

  return NextResponse.json({
    ok: true,
    message: `Checkout stub ready for ${plan}.`,
  });
}
