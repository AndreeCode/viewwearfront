import { NextResponse } from "next/server";
import { getAllGarments } from "@/lib/db";

export async function GET() {
  try {
    const garments = await getAllGarments();
    return NextResponse.json({ garments });
  } catch (error) {
    console.error("Error fetching garments:", error);
    return NextResponse.json({ error: "Error fetching garments" }, { status: 500 });
  }
}
