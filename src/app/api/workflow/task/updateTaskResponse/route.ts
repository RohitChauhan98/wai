import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { workflow_id, task_id, response } = body;

        console.log("Updating Task Response: ", body);

        const client = await clientPromise;
        const db = client.db('n8n');

        // Update the task response in the database
        const workflow = await db.collection('workflows').findOne({ workflow_id });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        const task = workflow.tasks.find((task: any) => task.task_id === task_id);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        task.response = response;

        await db.collection('workflows').updateOne({ workflow_id }, { $set: { tasks: workflow.tasks } });

        return NextResponse.json({ message: 'Task response updated successfully' });
    } catch (error) {
        console.error('Error updating task response:', error);
        return NextResponse.json({ error: 'Failed to update task response' }, { status: 500 });
    }
}