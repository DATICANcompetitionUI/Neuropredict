import { NextResponse } from "next/server";

// In production (Netlify), set BACKEND_URL env var to your Render URL
// e.g. BACKEND_URL=https://neuropredict-backend.onrender.com
// In local dev, it falls back to localhost:8000
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[PROXY] Backend error:", res.status, errorText);
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[PROXY] Prediction success, risk_score:", data.risk_score);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROXY] Connection failed:", error);
    return NextResponse.json(
      {
        error: "Cannot connect to prediction server. Please try again later.",
      },
      { status: 503 }
    );
  }
}