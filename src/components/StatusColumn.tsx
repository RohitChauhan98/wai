'use client';

import React, { DragEvent } from 'react';
import { Container, Task, DraggedItem } from '@/types/workflow';
import { TaskCard } from './TaskCard';

interface StatusColumnProps {
  container: Container;
  draggedItem: React.MutableRefObject<DraggedItem | null>;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, targetContainerId: string) => void;
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

export const StatusColumn: React.FC<StatusColumnProps> = ({
  container,
  draggedItem,
  onDragOver,
  onDrop,
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
  const isDraggedOver = draggedItem.current && draggedItem.current.sourceContainerId !== container.id;

  return (
    <div className="pb-6 p-0 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 shadow-xl">
      <div className="flex-1 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">{container.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-700/50 border border-slate-600/50 px-3 py-1.5 rounded-lg text-slate-200 font-semibold backdrop-blur-sm">
              {container.tasks.length}
            </span>
          </div>
        </div>

        {/* Drop Area */}
        <div
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, container.id)}
          className={`
            h-full min-h-[400px] p-4 border-2 border-dashed rounded-xl mx-4 mb-4
            transition-all duration-300 
            ${isDraggedOver
              ? 'border-blue-400/60 bg-blue-500/10 backdrop-blur-sm'
              : 'border-slate-600/30 hover:border-slate-500/50'
            }
          `}
        >
          {container.tasks.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-center">
              <div className="text-slate-500">
                <div className="text-3xl mb-3 opacity-50">📋</div>
                <div className="text-sm font-medium opacity-70">Drop tasks here</div>
                <div className="text-xs mt-1 opacity-50">Drag and drop to organize</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {container.tasks.map((task) => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  draggedItem={draggedItem}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onAITask={onAITask}
                  onHumanTask={onHumanTask}
                  onHumanInputModal={onHumanInputModal}
                  onShowResult={onShowResult}
                  onCustomPrompt={onCustomPrompt}
                  isSubmitting={isSubmitting}
                  processingTasks={processingTasks}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
