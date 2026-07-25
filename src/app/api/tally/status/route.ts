import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const companyName = cookieStore.get("tally_company_name")?.value || null;
    const isConnected = cookieStore.get("tally_connected")?.value === "true";

    return NextResponse.json({
      connected: isConnected && !!companyName,
      companyName: isConnected ? companyName : null,
      serverUrl: cookieStore.get("tally_server_url")?.value || "http://localhost:9000",
    });
  } catch (error) {
    return NextResponse.json({ connected: false, companyName: null });
  }
}
