// components/TextareaModal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TextareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  handleSubmition: () => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleClose = () => {
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await handleSubmition();
      // Reset submitting state after successful submission
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting:', error);
      setIsSubmitting(false);
    }
  };

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
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
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
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
        className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-100">Enter Custom Prompt</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            ref={textareaRef}
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe what you want the AI to do with this task..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none text-slate-100 placeholder-slate-400 backdrop-blur-sm"
          />
        </div>

        <div className='p-6 pt-0 flex justify-end gap-3'>
            <button 
              onClick={handleClose}
              className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !value.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              {isSubmitting ? 'Processing...' : 'Submit'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HumanInputModal;