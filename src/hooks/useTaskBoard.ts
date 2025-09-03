import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Workflow, Task, Container, TaskResponse } from '@/types/workflow';
import { useWorkflowAPI } from './useWorkflowAPI';
import { buildFullPrompt } from '@/utils/taskHelpers';

const INITIAL_STATUSES: Container[] = [
  { id: "pending", title: "📋 To Do", color: "bg-slate-800/50", tasks: [] },
  { id: "in-progress", title: "⚡ In Progress", color: "bg-blue-900/30", tasks: [] },
  { id: "done", title: "✅ Completed", color: "bg-emerald-900/30", tasks: [] },
];

export const useTaskBoard = () => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [containers, setContainers] = useState<Container[]>(INITIAL_STATUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
  const [humanInput, setHumanInput] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingTasks, setProcessingTasks] = useState<Set<string>>(new Set());

  const params = useSearchParams();
  const workflowId = params.get('id');

  const {
    loading,
    error,
    fetchWorkflow,
    saveTaskStatus,
    saveHookResponse,
    getTaskResponse,
    executeAITask
  } = useWorkflowAPI();

  // Fetch workflow data on mount
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId).then(data => {
        if (data) {
          setWorkflow(data);
        }
      });
    }
  }, [workflowId]);

  // Update containers when workflow changes
  useEffect(() => {
    if (workflow) {
      const updatedStatuses: Container[] = INITIAL_STATUSES.map(s => ({ ...s, tasks: [] }));
      
      workflow.tasks.forEach(task => {
        const container = updatedStatuses.find(s => s.id === task.status);
        if (container) {
          container.tasks = [...container.tasks, task];
        }
      });

      setContainers(updatedStatuses);
    }
  }, [workflow]);

  const updateItemContainer = (item: Task, targetContainerId: string) => {
    setContainers(prev => {
      const updatedContainers = prev.map(container => {
        // Remove from all containers first (to handle cases where task might be in wrong container)
        const filteredTasks = container.tasks.filter(i => i.task_id !== item.task_id);
        
        // Add to target container with updated status
        if (container.id === targetContainerId) {
          const updatedTask = { ...item, status: targetContainerId as any };
          return {
            ...container,
            tasks: [...filteredTasks, updatedTask],
          };
        }

        // Other containers just have the task removed
        return {
          ...container,
          tasks: filteredTasks,
        };
      });
      
      return updatedContainers;
    });
  };

  const handleDrop = async (item: Task, targetContainerId: string) => {
    updateItemContainer(item, targetContainerId);
    if (workflow) {
      await saveTaskStatus(workflow.workflow_id, item.task_id, targetContainerId);
    }
  };

  const handleAITask = async (task: Task) => {
    if (!workflow || processingTasks.has(task.task_id)) return;

    // Add task to processing set
    setProcessingTasks(prev => new Set(prev).add(task.task_id));

    try {
      // Move task to in-progress
      updateItemContainer(task, 'in-progress');
      await saveTaskStatus(workflow.workflow_id, task.task_id, 'in-progress');

      // Execute AI task
      const prompt = buildFullPrompt(task, true, "");
      const result = await executeAITask(prompt, workflow.workflow_id);
      
      if (result) {
        const aiResponse: TaskResponse = {
          type: "ai",
          data: {
            content: result,
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: {},
            response_metadata: {}
          }
        };

        await saveHookResponse(workflow.workflow_id, task.task_id, aiResponse);
        
        // Move to done
        updateItemContainer(task, 'done');
        await saveTaskStatus(workflow.workflow_id, task.task_id, 'done');
      }
    } catch (error) {
      console.error('Error processing AI task:', error);
      // Move back to pending on error
      updateItemContainer(task, 'pending');
      await saveTaskStatus(workflow.workflow_id, task.task_id, 'pending');
    } finally {
      // Remove task from processing set
      setProcessingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.task_id);
        return newSet;
      });
    }
  };

  const handleHumanTask = async (task: Task) => {
    if (!workflow) return;

    // Move task to in-progress
    updateItemContainer(task, 'in-progress');
    await saveTaskStatus(workflow.workflow_id, task.task_id, 'in-progress');
  };

  const handleHumanInputSubmit = async () => {
    if (!selectedTask || !workflow || !humanInput.trim()) return;

    setIsSubmitting(true);
    // Add task to processing set
    setProcessingTasks(prev => new Set(prev).add(selectedTask.task_id));
    
    try {
      const prompt = buildFullPrompt(selectedTask, false, humanInput);
      const result = await executeAITask(prompt, workflow.workflow_id);
      
      if (result) {
        const response: TaskResponse = {
          type: "human",
          data: {
            content: result,
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: {},
            response_metadata: {}
          }
        };

        await saveHookResponse(workflow.workflow_id, selectedTask.task_id, response);
        
        // Move to done
        updateItemContainer(selectedTask, 'done');
        await saveTaskStatus(workflow.workflow_id, selectedTask.task_id, 'done');
        
        setHumanInput('');
        setIsHumanModalOpen(false);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error processing human task:', error);
    } finally {
      setIsSubmitting(false);
      // Remove task from processing set
      setProcessingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedTask.task_id);
        return newSet;
      });
    }
  };

  const showTaskResult = async (task: Task) => {
    if (!workflow) return;
    
    const response = await getTaskResponse(workflow.workflow_id, task.task_id);
    setModalData(response);
    setIsModalOpen(true);
  };

  const handleCustomPrompt = (task: Task) => {
    if (!workflow) return;
    
    updateItemContainer(task, 'in-progress');
    saveTaskStatus(workflow.workflow_id, task.task_id, 'in-progress');
    setSelectedTask(task);
    setIsHumanModalOpen(true);
  };

  const openHumanInputModal = (task: Task) => {
    setSelectedTask(task);
    setIsHumanModalOpen(true);
  };

  return {
    workflow,
    containers,
    isModalOpen,
    modalData,
    isHumanModalOpen,
    humanInput,
    selectedTask,
    isSubmitting,
    processingTasks,
    loading,
    error,
    setIsModalOpen,
    setModalData,
    setIsHumanModalOpen,
    setHumanInput,
    handleDrop,
    handleAITask,
    handleHumanTask,
    handleHumanInputSubmit,
    showTaskResult,
    handleCustomPrompt,
    openHumanInputModal
  };
};
