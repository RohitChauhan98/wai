'use client';

import React, { useState, DragEvent, useRef } from 'react';

interface DraggableItem {
  id: string;
  content: string;
  type: 'task' | 'note' | 'reminder';
}

interface Container {
  id: string;
  title: string;
  items: DraggableItem[];
  color?: string;
}

const DragDropPage: React.FC = () => {
  // You can easily modify this array to add/remove containers
  const [containers, setContainers] = useState<Container[]>([
    {
      id: 'container-1',
      title: 'To Do',
      color: 'border-red-300 bg-red-50',
      items: [
        { id: '1', content: 'Complete project documentation', type: 'task' },
        { id: '2', content: 'Review code changes', type: 'task' },
        { id: '3', content: 'Meeting at 3 PM', type: 'reminder' },
      ]
    },
    {
      id: 'container-2',
      title: 'In Progress',
      color: 'border-yellow-300 bg-yellow-50',
      items: [
        { id: '4', content: 'Remember to buy groceries', type: 'note' },
        { id: '5', content: 'Deploy to production', type: 'task' },
      ]
    },
    {
      id: 'container-3',
      title: 'Completed',
      color: 'border-green-300 bg-green-50',
      items: [
        { id: '6', content: 'Update dependencies', type: 'task' },
      ]
    },
    {
      id: 'container-4',
      title: 'Archived',
      color: 'border-gray-300 bg-gray-50',
      items: []
    }
  ]);

  const draggedItem = useRef<{ item: DraggableItem; sourceContainerId: string } | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: DraggableItem) => {
    // Find which container this item belongs to
    const sourceContainer = containers.find(container => 
      container.items.some(i => i.id === item.id)
    );
    
    if (!sourceContainer) return;

    draggedItem.current = { item, sourceContainerId: sourceContainer.id };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleContainerDrop = (e: DragEvent, targetContainerId: string) => {
    e.preventDefault();
    
    if (!draggedItem.current) return;

    const { item, sourceContainerId } = draggedItem.current;

    // Don't do anything if dropping in the same container
    if (sourceContainerId === targetContainerId) {
      draggedItem.current = null;
      return;
    }

    setContainers(prevContainers => {
      return prevContainers.map(container => {
        if (container.id === sourceContainerId) {
          // Remove item from source container
          return {
            ...container,
            items: container.items.filter(i => i.id !== item.id)
          };
        } else if (container.id === targetContainerId) {
          // Add item to target container
          return {
            ...container,
            items: [...container.items, item]
          };
        }
        return container;
      });
    });

    draggedItem.current = null;
  };

  const handleDragEnd = () => {
    draggedItem.current = null;
  };

  const getItemTypeColor = (type: DraggableItem['type']) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'note':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'reminder':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Function to add a new container (for demonstration)
  const addNewContainer = () => {
    const newContainer: Container = {
      id: `container-${Date.now()}`,
      title: `Container ${containers.length + 1}`,
      color: 'border-purple-300 bg-purple-50',
      items: []
    };
    setContainers(prev => [...prev, newContainer]);
  };

  // Function to add a new item to a specific container
  const addNewItem = (containerId: string) => {
    const newItem: DraggableItem = {
      id: `item-${Date.now()}`,
      content: `New item ${Date.now()}`,
      type: 'task'
    };

    setContainers(prevContainers => {
      return prevContainers.map(container => {
        if (container.id === containerId) {
          return {
            ...container,
            items: [...container.items, newItem]
          };
        }
        return container;
      });
    });
  };

  const DraggableComponent: React.FC<{ 
    item: DraggableItem; 
  }> = ({ item }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item)}
      onDragEnd={handleDragEnd}
      className={`
        p-3 mb-2 border-2 border-dashed rounded-lg cursor-move transition-all duration-200
        hover:shadow-md hover:scale-105 select-none
        ${getItemTypeColor(item.type)}
        ${draggedItem.current?.item.id === item.id ? 'opacity-50 scale-95' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{item.content}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 uppercase tracking-wide">
          {item.type}
        </span>
      </div>
    </div>
  );

  const DropContainer: React.FC<{
    container: Container;
  }> = ({ container }) => (
    <div className="flex-1 min-w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">{container.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            {container.items.length}
          </span>
          <button
            onClick={() => addNewItem(container.id)}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
      
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleContainerDrop(e, container.id)}
        className={`
          min-h-80 p-3 border-2 border-dashed rounded-xl 
          transition-all duration-200 
          ${draggedItem.current && draggedItem.current.sourceContainerId !== container.id 
            ? `border-blue-400 bg-blue-100` 
            : `${container.color || 'border-gray-300 bg-gray-50'} hover:border-opacity-70`}
        `}
      >
        {container.items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-center">
            <div>
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm">Drop items here</div>
            </div>
          </div>
        ) : (
          container.items.map((item) => (
            <DraggableComponent
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Multi-Container Drag & Drop
          </h1>
          <p className="text-gray-600 mb-4">
            Drag components between any container - scalable for unlimited containers!
          </p>
          <button
            onClick={addNewContainer}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            + Add New Container
          </button>
        </header>

        {/* Dynamic container grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {containers.map((container) => (
            <DropContainer
              key={container.id}
              container={container}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center gap-4 px-6 py-3 bg-white rounded-lg shadow-sm border">
            {containers.map((container, index) => (
              <React.Fragment key={container.id}>
                <div className="text-sm text-gray-600">
                  <strong>{container.title}:</strong> {container.items.length} items
                </div>
                {index < containers.length - 1 && (
                  <div className="w-1 h-4 bg-gray-300 rounded"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p>
            <strong>Instructions:</strong> Drag any item between containers. 
            Use "Add New Container" to create more containers dynamically. 
            Use the "+ Add" button in each container to add new items.
            Containers automatically adapt to different screen sizes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragDropPage;