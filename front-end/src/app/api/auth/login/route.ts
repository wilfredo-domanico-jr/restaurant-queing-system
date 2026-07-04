import { NextRequest, NextResponse } from "next/server";

// Server-side calls run inside the Next.js server process, which in Docker
// is a different container than the browser — API_INTERNAL_URL lets it
// reach the backend by its container/service name instead of "localhost".
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.text();

  const backendRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!backendRes.ok) {
    const error = await backendRes.text();
    return NextResponse.json(
      { message: error || "Login failed" },
      { status: backendRes.status },
    );
  }

  const json = await backendRes.json();
  const token: string = json.data.token;
  const expiresAt: string = json.data.expiresAt;

  const res = NextResponse.json({ message: "Login successful" });

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  return res;
}
