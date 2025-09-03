import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { workflow_id, task_id } = body;

        console.log("Getting Task Response: ", body);

        const client = await clientPromise;
        const db = client.db('n8n');

        // Get the task response from the database
        const workflow = await db.collection('workflows').findOne({ workflow_id });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        const task = workflow.tasks.find((task: any) => task.task_id === task_id);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const response = task.response;

        return NextResponse.json({ message: 'Task response retrieved successfully', response });
    } catch (error) {
        console.error('Error retrieving task response:', error);
        return NextResponse.json({ error: 'Failed to retrieve task response' }, { status: 500 });
    }
}