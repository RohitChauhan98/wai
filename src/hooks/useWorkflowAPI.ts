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

  const getTaskResponse = async (workflowId: string, taskId: string): Promise<string | null> => {
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

      // Check if response is ok
      if (!res.ok) {
        console.error(`HTTP error! status: ${res.status}`);
        return null;
      }

      // Check if response has content
      const text = await res.text();
      if (!text) {
        console.error('Empty response from getTaskResponse API');
        return null;
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response from getTaskResponse:', text);
        return null;
      }

      console.log("Get Task Response Data: ", data);
      return data.response?.data || null;
    } catch (error) {
      console.error('Error getting task response:', error);
      return null;
    }
  };  const executeAITask = async (prompt: string, workflowId: string): Promise<string | null> => {
    try {
      console.log('Executing AI task with prompt:', prompt);
      console.log('Workflow ID:', workflowId);
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://n8n.cruxsphere.com/webhook/ec6a6980-cae1-41bc-9fee-535e6687e6a0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          sessionid: workflowId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return null;
      }

      // Check if response has content
      const text = await response.text();
      console.log('Raw response text:', text);
      
      if (!text) {
        console.error('Empty response from API');
        return null;
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', text);
        console.error('Parse error:', parseError);
        return null;
      }

      const result = data[0]?.output || data.output || data.result || null;
      console.log('Extracted result:', result);
      
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('AI task request timed out');
      } else {
        console.error('Error executing AI task:', error);
      }
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
