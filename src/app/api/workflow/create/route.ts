import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ensure workflow_id or generate one
    const workflow = {
      ...body,
      _id: new ObjectId(), // MongoDB internal id
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: body.status || "active",
    };

    const client = await clientPromise;
    const db = client.db("n8n");

    const result = await db.collection("workflows").insertOne(workflow);

    return NextResponse.json(
      { message: "Workflow created successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow", details: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("n8n");

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflow_id");

    if (!workflowId) {
      return NextResponse.json(
        { error: "workflow_id is required" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("workflows")
      .findOne({ workflow_id: workflowId });

    if (!result) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workflow: result }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting workflow:", error);
    return NextResponse.json(
      { error: "Failed to get workflow", details: error.message },
      { status: 500 }
    );
  }
}

