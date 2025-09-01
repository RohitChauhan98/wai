import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(req: Request) {
  try {

    const client = await clientPromise;
    const db = client.db("n8n");

    const result = await db.collection("workflows").find({}, { projection: { tasks: 0 } }).toArray();

    return NextResponse.json({ workflows: result }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting all workflows:", error);
    return NextResponse.json(
      { error: "Failed to get workflows", details: error.message },
      { status: 500 }
    );
  }
}




