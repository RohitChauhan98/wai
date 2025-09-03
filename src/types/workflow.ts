export interface Task {
  task_id: string;
  type: 'human' | 'ai';
  title: string;
  description: string;
  priority: number;
  estimated_duration: number;
  dependencies: string[];
  tools_required: string[];
  ai_prompt: string;
  human_instructions: string;
  deliverables: string[];
  status: 'pending' | 'in-progress' | 'done';
  assigned_to: string;
  created_at: string;
  completed_at: string | null;
}

export interface Workflow {
  workflow_id: string;
  query: string;
  title?: string;
  created_at: string;
  updated_at: string;
  status: string;
  total_tasks: number;
  completed_tasks: number;
  estimated_total_duration: number;
  tasks: Task[];
}

export interface Container {
  id: string;
  title: string;
  color?: string;
  tasks: Task[];
}

export interface DraggedItem {
  item: Task;
  sourceContainerId: string;
}

export interface TaskResponse {
  type: string;
  data: {
    content: string;
    tool_calls: any[];
    invalid_tool_calls: any[];
    additional_kwargs: any;
    response_metadata: any;
  };
}
