import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    console.log("Buffer:", buffer);
    // const data = await parse(Buffer.from(buffer));

    // This is a placeholder for the actual parsing logic
    // You'll need to implement custom logic to extract the relevant information
    const transactions = [
      {
        date: "2023-05-01",
        bank: "Example Bank",
        category: "Groceries",
        amount: 50.0,
      },
      {
        date: "2023-05-02",
        bank: "Example Bank",
        category: "Entertainment",
        amount: 30.0,
      },
      // Add more dummy transactions as needed
    ];

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
