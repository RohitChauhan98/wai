// components/TextareaModal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TextareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  handleSubmition: (value: boolean) => void;
}

const HumanInputModal: React.FC<TextareaModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  handleSubmition
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setTimeout(() => textareaRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Enter Prompt for Ai</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-black">
          <textarea
            ref={textareaRef}
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your text here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className='p-6 flex justify-end'>
            <button onClick={() => {handleSubmition(true); onClose();}} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default HumanInputModal;