import { useState } from 'react';
import { Workflow, Task, TaskResponse } from '@/types/workflow';

export const useWorkflowAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflow = async (workflowId: string): Promise<Workflow | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflow/create?workflow_id=${workflowId}`);
      const data = await response.json();
      
      if (data.workflow) {
        return data.workflow;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch workflow');
      console.error('Error fetching workflow:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveTaskStatus = async (workflowId: string, taskId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/workflow/task/updateTaskStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          task_id: taskId,
          status
        })
      });

      const data = await res.json();
      console.log("Task Status Update Data: ", data);
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  };

  const saveHookResponse = async (workflowId: string, taskId: string, response: TaskResponse): Promise<boolean> => {
    try {
      const res = await fetch('/api/workflow/task/updateTaskResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          task_id: taskId,
          response
        })
      });

      const data = await res.json();
      console.log("Save Hook Response Data: ", data);
      return true;
    } catch (error) {
      console.error('Error saving hook response:', error);
      return false;
    }
  };

  const getTaskResponse = async (workflowId: string, taskId: string): Promise<any> => {
    try {
      const res = await fetch('/api/workflow/task/getTaskResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          task_id: taskId,
        })
      });

      const data = await res.json();
      console.log("Get Task Response Data: ", data);
      return data.response?.data || null;
    } catch (error) {
      console.error('Error getting task response:', error);
      return null;
    }
  };

  const executeAITask = async (prompt: string, workflowId: string): Promise<string | null> => {
    try {
      const response = await fetch('https://n8n.cruxsphere.com/webhook/ec6a6980-cae1-41bc-9fee-535e6687e6a0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          sessionid: workflowId
        })
      });

      const data = await response.json();
      return data[0]?.output || null;
    } catch (error) {
      console.error('Error executing AI task:', error);
      return null;
    }
  };

  return {
    loading,
    error,
    fetchWorkflow,
    saveTaskStatus,
    saveHookResponse,
    getTaskResponse,
    executeAITask
  };
};
