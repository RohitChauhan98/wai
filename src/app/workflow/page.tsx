import TaskBoard from "@/components/TaskBoard";

export default function WorkflowPage() {
   


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Task Board
                    </h1>
                </header>
                <TaskBoard />
            </div>
        </div>
    );
}