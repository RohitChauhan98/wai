import { useRef, DragEvent } from 'react';
import { Task, DraggedItem, Container } from '@/types/workflow';

export const useDragAndDrop = () => {
  const draggedItem = useRef<DraggedItem | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: Task, containers: Container[]) => {
    const sourceContainer = containers.find(container =>
      container.tasks.some(i => i.task_id === item.task_id)
    );

    if (!sourceContainer) return;

    draggedItem.current = { item, sourceContainerId: sourceContainer.id };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.task_id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    draggedItem.current = null;
  };

  const handleContainerDrop = (
    e: DragEvent, 
    targetContainerId: string,
    onDrop: (item: Task, targetContainerId: string) => void
  ) => {
    e.preventDefault();

    if (!draggedItem.current) return;

    const { item, sourceContainerId } = draggedItem.current;

    // Don't do anything if dropping in the same container
    if (sourceContainerId === targetContainerId) return;

    onDrop(item, targetContainerId);
    draggedItem.current = null;
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleContainerDrop
  };
};
