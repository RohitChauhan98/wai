'use client';

import React, { DragEvent } from 'react';
import { Clock, User, Calendar, Flag, CheckCircleIcon, Circle, AlertCircle } from 'lucide-react';
import { Task, DraggedItem } from '@/types/workflow';
import { 
  getItemTypeColor, 
  getPriorityColor, 
  getPriorityLabel, 
  getStatusColor, 
  getTypeColor 
} from '@/utils/taskHelpers';

interface TaskCardProps {
  task: Task;
  draggedItem: React.MutableRefObject<DraggedItem | null>;
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: () => void;
  onAITask: (task: Task) => void;
  onHumanTask: (task: Task) => void;
  onHumanInputModal: (task: Task) => void;
  onShowResult: (task: Task) => void;
  onCustomPrompt: (task: Task) => void;
  isSubmitting?: boolean;
  processingTasks: Set<string>;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  draggedItem,
  onDragStart,
  onDragEnd,
  onAITask,
  onHumanTask,
  onHumanInputModal,
  onShowResult,
  onCustomPrompt,
  isSubmitting = false,
  processingTasks
}) => {
  const isProcessing = processingTasks.has(task.task_id);
  
  const renderStatusIcon = () => {
    if (isProcessing) {
      return (
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      );
    }
    
    switch (task.status) {
      case 'done':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderActionButtons = () => {
    if (task.status === 'done') {
      return (
        <div className='flex justify-between mt-4 gap-2 relative z-10'>
          {task.type === 'ai' && (
            <button 
              onClick={() => onCustomPrompt(task)} 
              className='bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex-1 mr-1'
            >
              Custom Prompt
            </button>
          )}
          <button 
            onClick={() => onShowResult(task)} 
            className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex-1'
          >
            Show Result
          </button>
        </div>
      );
    }

    if (task.type === 'ai') {
      return (
        <div className='flex justify-end mt-4 relative z-10'>
          <button 
            onClick={() => onAITask(task)} 
            className='bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-slate-600 disabled:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100'
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 
             task.status === 'pending' ? 'Proceed' : 
             task.status === 'in-progress' ? 'Ready' : 'Completed'}
          </button>
        </div>
      );
    }

    if (task.type === 'human') {
      return (
        <div className='flex justify-end mt-4 relative z-10'>
          <button 
            onClick={() => {
              if (task.status === 'pending') {
                onHumanTask(task);
              } else if (task.status === 'in-progress') {
                onHumanInputModal(task);
              }
            }} 
            className='bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-600 disabled:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:hover:scale-100'
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 
             task.status === 'pending' ? 'Proceed' : 
             task.status === 'in-progress' ? 'Write a Note...' : 'Completed'}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`
        p-4 mb-3 border border-slate-700/50 rounded-xl cursor-move transition-all duration-300
        hover:shadow-xl hover:shadow-black/25 hover:scale-[1.02] hover:border-slate-600/70 select-none
        ${getItemTypeColor(task.type)}
        ${draggedItem.current?.item.task_id === task.task_id ? 'scale-105 shadow-xl' : ''}
        ${isProcessing ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-slate-900' : ''}
        group relative overflow-hidden
      `}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
      
      {/* Header with title and status */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1 mr-3">
          <h3 className="font-semibold text-slate-100 text-sm mb-2 leading-tight">{task.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed opacity-90">{task.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {renderStatusIcon()}
          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityColor(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>
      </div>

      {/* Meta info row */}
      <div className="flex items-center justify-between text-xs mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{task.estimated_duration}min</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <User className="w-3.5 h-3.5" />
            <span className="capitalize font-medium">{task.assigned_to}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
          isProcessing 
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse' 
            : getStatusColor(task.status)
        }`}>
          {isProcessing ? 'processing' : task.status}
        </span>
      </div>

      {/* Deliverables */}
      {task.deliverables && task.deliverables.length > 0 && (
        <div className="mb-4 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 relative z-10">
          <div className="flex items-start gap-2">
            <Flag className="w-3.5 h-3.5 mt-0.5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-200 mb-2 block">Deliverables:</span>
              <div className="space-y-1.5">
                {task.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-xs text-slate-300 leading-relaxed">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom row with type badge and date */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium">{new Date(task.created_at).toLocaleDateString()}</span>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wide ${getTypeColor(task.type)}`}>
          {task.type}
        </span>
      </div>

      {/* Action buttons */}
      {renderActionButtons()}
    </div>
  );
};
