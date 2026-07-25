import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("futrix_auth_token");
  cookieStore.delete("futrix_user_email");
  cookieStore.delete("futrix_user_name");
  cookieStore.delete("futrix_company_name");

  return NextResponse.json({ status: "success", message: "Logged out successfully" });
}
