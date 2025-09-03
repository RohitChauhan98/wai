// types/modal.ts
export interface AIResponse {
  title?: string;
  subtitle?: string;
  content: string;
  timestamp?: string;
  model?: string;
}

// components/AIResultsModal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X, Brain, Sparkles, Clock, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiResponse: AIResponse | null;
}

const AIResultsModal: React.FC<AIResultsModalProps> = ({
  isOpen,
  onClose,
  aiResponse,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !aiResponse) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/60 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full max-w-4xl max-h-[90vh] 
          bg-gradient-to-br from-gray-900 via-slate-800 to-gray-800
          rounded-3xl shadow-2xl border border-gray-600/20
          transform transition-all duration-400 ease-out
          ${isOpen 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-75 translate-y-8 opacity-0'
          }
        `}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-800 px-8 py-6">
          {/* Background Pattern */}
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="27" cy="27" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" /> */}
          
          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {aiResponse.title || 'AI Generated Results'}
                  </h2>
                  <p className="text-white/80">
                    {aiResponse.subtitle || 'Powered by artificial intelligence'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Meta Info */}
            <div className="mt-4 flex items-center space-x-4 text-sm text-white/70">
              {aiResponse.model && (
                <div className="flex items-center space-x-1">
                  <Bot className="h-4 w-4" />
                  <span>{aiResponse.model}</span>
                </div>
              )}
              {aiResponse.timestamp && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(aiResponse.timestamp).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>AI Generated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-8 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-6 flex items-center text-3xl font-bold text-gray-100">
                    <div className="mr-3 h-1 w-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-4 mt-8 flex items-center text-2xl font-semibold text-gray-200">
                    <div className="mr-3 h-1 w-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-6 flex items-center text-xl font-semibold text-gray-300">
                    <div className="mr-2 h-1 w-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-gray-400">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 space-y-2">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start">
                    <div className="mr-3 mt-2 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex-shrink-0" />
                    <span className="text-gray-400">{children}</span>
                  </li>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500 bg-indigo-900/30 p-4 my-4 rounded-r-lg">
                    <div className="text-indigo-200">{children}</div>
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-800 px-2 py-1 text-sm font-mono text-gray-200">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="rounded-lg bg-gray-950 p-4 text-white overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-100">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-300">{children}</em>
                ),
                hr: () => (
                  <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-600 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-600 bg-gray-800 px-4 py-2 text-left font-semibold text-gray-100">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-600 px-4 py-2 text-gray-400">
                    {children}
                  </td>
                ),
              }}
            >
              {aiResponse.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-b-3xl bg-gradient-to-r from-gray-800 to-slate-800 px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>AI Response Generated Successfully</span>
            </div>
            {/* <div className="text-xs">
              Powered by Next.js & Tailwind CSS
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultsModal;