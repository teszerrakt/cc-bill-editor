import { NextResponse } from "next/server";

// Utils
import { parsePDF } from "@/lib/pdf-parser";

// Types
import type { IssuingBanks } from "@/lib/pdf-parser/factories";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const issuingBank = formData.get("bank") as IssuingBanks;

  if (!issuingBank) {
    return NextResponse.json({ error: "No bank selected" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transactions = await parsePDF(buffer, issuingBank);

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
