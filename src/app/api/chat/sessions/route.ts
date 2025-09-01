import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("n8n");

        const sessions = await db
            .collection("chat_history")
            .find({}, { projection: { sessionId: 1, _id: 0 } })
            .toArray();

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat history" },
            { status: 500 }
        );
    }
}
