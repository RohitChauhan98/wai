import TaskBoard from "@/components/TaskBoard";

export default function WorkflowPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <TaskBoard />
                </div>
            </div>
        </div>
    );
}