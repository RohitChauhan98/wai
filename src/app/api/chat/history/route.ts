import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(request: Request) {
    try {
        console.log("getting Requests:::")
        const client = await clientPromise;
        const db = client.db("n8n");
        console.log("DB Connection Established");
        const url = new URL(request.url);
        const sessionId = url.searchParams.get("sessionid");
        // const sessionId = "123123123";
        const chatHistory = await db
            .collection("chat_history")
            .findOne({ sessionId: sessionId });

        console.log("Chat History:------", chatHistory);

        return NextResponse.json(chatHistory);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
    }
}