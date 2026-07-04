import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function proxy(req: NextRequest, path: string[]) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const targetUrl = `${API_URL}/admin/${path.join("/")}${req.nextUrl.search}`;

  const backendRes = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  });

  const text = await backendRes.text();

  return new NextResponse(text, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
