'use client'

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatUI() {
  const [chats] = useState([
    "Website Development",
    "React Hooks",
    "SEO Optimization",
    "Tailwind CSS Tips",
    "Database Design",
    "Authentication Systems",
    "Performance Optimization",
  ]);

  const router = useRouter();

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold">Launch UI</h1>
          <p className="text-sm text-neutral-400">Enterprise</p>
          <button className="mt-3 flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-lg text-sm hover:bg-neutral-700">
            <Plus size={16} /> New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-neutral-500 mb-2">Older</p>
          {chats.map((chat, i) => (
            <div
              key={i}
              className="p-2 rounded-md hover:bg-neutral-800 cursor-pointer text-sm"
            >
              {chat}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-6">What can I help with?</h2>

        {/* Input */}
        <div className="w-full max-w-2xl px-4">
          <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button onClick={() => router.push('/workflow')} className="ml-2 p-2 hover:bg-neutral-800 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
