import { NextResponse } from "next/server";
import { sendBookingNotifyTest } from "@/lib/booking-email";

export const dynamic = "force-dynamic";

const TEST_TOKEN = "ppr-mail-test-20260928";

export async function GET(request: Request) {
  const token = request.headers.get("x-test-token");
  if (token !== TEST_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        missingKey: false,
        status: 401,
        name: "unauthorized",
        message: "missing or invalid test token",
        id: null,
      },
      { status: 401 },
    );
  }

  const result = await sendBookingNotifyTest();
  return NextResponse.json(result);
}
