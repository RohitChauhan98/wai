'use client';

import React from 'react';
import { StatusColumn } from './StatusColumn';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useTaskBoard } from '@/hooks/useTaskBoard';
import AIResultsModal from './aiResultModal';
import HumanInputModal from './humanInputModal';

export default function TaskBoard() {
  const {
    workflow,
    containers,
    isModalOpen,
    modalData,
    isHumanModalOpen,
    humanInput,
    isSubmitting,
    processingTasks,
    loading,
    error,
    setIsModalOpen,
    setIsHumanModalOpen,
    setHumanInput,
    handleDrop,
    handleAITask,
    handleHumanTask,
    handleHumanInputSubmit,
    showTaskResult,
    handleCustomPrompt,
    openHumanInputModal
  } = useTaskBoard();

  const {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleContainerDrop
  } = useDragAndDrop();

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, task: any) => {
    handleDragStart(e, task, containers);
  };

  const onDrop = (e: React.DragEvent, targetContainerId: string) => {
    handleContainerDrop(e, targetContainerId, handleDrop);
  };

  const handleHumanInputChange = (value: string) => {
    setHumanInput(value);
  };

  const handleSubmit = () => {
    handleHumanInputSubmit();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading workflow...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">
          {workflow?.title || workflow?.query || "Workflow Board"}
        </h1>
        <p className="text-slate-400 text-sm">
          Organize and track your tasks with drag & drop functionality
        </p>
      </div>
      
      {/* Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {containers.map((container) => (
          <StatusColumn
            key={container.id}
            container={container}
            draggedItem={draggedItem}
            onDragOver={handleDragOver}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragEnd={handleDragEnd}
            onAITask={handleAITask}
            onHumanTask={handleHumanTask}
            onHumanInputModal={openHumanInputModal}
            onShowResult={showTaskResult}
            onCustomPrompt={handleCustomPrompt}
            isSubmitting={isSubmitting}
            processingTasks={processingTasks}
          />
        ))}
      </div>

      <AIResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aiResponse={modalData}
      />

      <HumanInputModal
        isOpen={isHumanModalOpen}
        onClose={() => setIsHumanModalOpen(false)}
        value={humanInput}
        onChange={handleHumanInputChange}
        handleSubmition={handleSubmit}
      />
    </div>
  );
}








