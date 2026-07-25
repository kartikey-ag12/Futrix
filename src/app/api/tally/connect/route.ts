import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { companyName, serverUrl = "http://localhost:9000" } = await req.json();

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cookieOptions = { path: "/", httpOnly: true, maxAge: 30 * 24 * 60 * 60 };

    cookieStore.set("tally_company_name", companyName, cookieOptions);
    cookieStore.set("tally_server_url", serverUrl, cookieOptions);
    cookieStore.set("tally_connected", "true", cookieOptions);

    return NextResponse.json({
      status: "success",
      message: `Successfully connected to TallyPrime company: ${companyName}`,
      connection: {
        companyName,
        serverUrl,
        connectedAt: new Date().toISOString(),
        status: "Active",
      },
    });
  } catch (error: any) {
    console.error("Tally Connect Error:", error);
    return NextResponse.json({ error: "Failed to establish connection to Tally" }, { status: 500 });
  }
}
