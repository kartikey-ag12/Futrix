import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("futrix_auth_token")?.value;
  const email = cookieStore.get("futrix_user_email")?.value;
  const name = cookieStore.get("futrix_user_name")?.value;
  const company = cookieStore.get("futrix_company_name")?.value;

  if (!token || !email) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      name: name || "Futrix User",
      email: email,
      company: company || "Acme Corp",
    },
  });
}
