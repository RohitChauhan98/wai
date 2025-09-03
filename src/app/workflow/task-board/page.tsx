import TaskBoard from "@/components/TaskBoard";

export default function WorkflowPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-800 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Task Board
                    </h1>
                </header>
                <TaskBoard />
            </div>
        </div>
    );
}