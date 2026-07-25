import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password, company, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const maxAge = 60 * 60 * 24 * 30; // 30 days

    cookieStore.set("futrix_auth_token", `token_signup_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });

    cookieStore.set("futrix_user_email", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });

    cookieStore.set("futrix_user_name", name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });

    if (company) {
      cookieStore.set("futrix_company_name", company, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Account created successfully! Welcome to Futrix.",
      user: {
        name,
        email,
        company: company || "My Enterprise",
        role: role || "Owner",
      },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}
