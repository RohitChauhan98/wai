'use client'

import React, { useEffect, useState, useRef } from "react";
import { Plus, Send, User, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function ChatUI() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  function sendPrompt() {
    if (!sessionId || !prompt.trim()) return;

    // Add human message to chat history immediately
    const newHumanMessage = {
      type: "human",
      data: {
        content: prompt,
        additional_kwargs: {},
        response_metadata: {}
      }
    };

    setChatHistory(prev => [...prev, newHumanMessage]);
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    fetch('https://n8n.cruxsphere.com/webhook/ec6a6980-cae1-41bc-9fee-535e6687e6a0t', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({
        query: currentPrompt,
        sessionid: sessionId
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Add AI response to chat history
        const aiResponse = {
          type: "ai",
          data: {
            content: data.response || "I received your message.",
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: {},
            response_metadata: {}
          }
        };
        setChatHistory(prev => [...prev, aiResponse]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
        // Add error message
        const errorResponse = {
          type: "ai",
          data: {
            content: "Sorry, I encountered an error. Please try again.",
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: {},
            response_metadata: {}
          }
        };
        setChatHistory(prev => [...prev, errorResponse]);
      });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const createNewChat = () => {
    const new_session_id = uuidv4();
    localStorage.setItem('session_id', new_session_id);
    setSessionId(new_session_id);
    setChatHistory([]);
  };

  useEffect(() => {
    const session_id = localStorage.getItem('session_id');
    if (session_id) {
      setSessionId(session_id);
    } else {
      const new_session_id = uuidv4();
      localStorage.setItem('session_id', new_session_id);
      setSessionId(new_session_id);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      console.log("sessionID: ", sessionId);
      fetch(`/api/chat/history?sessionid=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setChatHistory(data.messages || []);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [sessionId]);

  useEffect(() => {
    fetch(`/api/chat/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSessions(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold">Launch UI</h1>
          <p className="text-sm text-neutral-400">Enterprise</p>
          <button
            onClick={createNewChat}
            className="mt-3 flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-lg text-sm hover:bg-neutral-700 transition-colors"
          >
            <Plus size={16} /> New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-neutral-500 mb-2">Recent Sessions</p>
          {sessions.map((session: any, i: number) => (
            <div
              key={i}
              onClick={() => setSessionId(session.sessionId)}
              className={`p-2 rounded-md hover:bg-neutral-800 cursor-pointer text-sm transition-colors ${sessionId === session.sessionId ? 'bg-neutral-800' : ''
                }`}
            >
              <div className="truncate">{session.sessionId}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="border-b border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {chatHistory.length > 0 ? 'Chat Session' : 'What can I help with?'}
            </h2>
            {sessionId && (
              <div className="text-sm text-neutral-400">
                Session: {sessionId.slice(0, 8)}...
              </div>
            )}
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6">What can I help with?</h2>
                <p className="text-neutral-400">Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-4 space-y-6">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.type === 'human' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.type === 'human'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-100'
                    }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {formatMessageContent(message.data.content)}
                    </div>
                  </div>

                  {message.type === 'human' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-neutral-800 text-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-neutral-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-neutral-800 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-sm resize-none min-h-[24px] max-h-32"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '24px'
                }}
                onInput={(e: any) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                onClick={sendPrompt}
                disabled={!prompt.trim() || isLoading}
                className="flex-shrink-0 p-2 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-neutral-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}