import { Task } from '@/types/workflow';

export const getItemTypeColor = (type: Task['type']) => {
  switch (type) {
    case 'human':
      return 'bg-slate-800/80 backdrop-blur-sm border-emerald-500/30 text-slate-100 shadow-lg shadow-emerald-500/10';
    case 'ai':
      return 'bg-slate-800/80 backdrop-blur-sm border-violet-500/30 text-slate-100 shadow-lg shadow-violet-500/10';
    default:
      return 'bg-slate-800/80 backdrop-blur-sm border-slate-600/30 text-slate-100 shadow-lg';
  }
};

export const getPriorityColor = (priority: number) => {
  if (priority === 1) return 'bg-red-500/20 text-red-300 border border-red-500/30';
  if (priority === 2) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
  return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
};

export const getPriorityLabel = (priority: number) => {
  if (priority === 1) return 'HIGH';
  if (priority === 2) return 'MED';
  return 'LOW';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'human':
      return 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25';
    case 'ai':
      return 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25';
    default:
      return 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-lg';
  }
};

export const buildFullPrompt = (task: Task, forAi: boolean, humanPrompt: string) => {
  if (forAi) {
    return `
    Task Title: ${task.title}

    Description:
    ${task.description}

    AI Prompt:
    ${task.ai_prompt}

    Human Instructions:
    ${task.human_instructions}

    Deliverables:
    ${task.deliverables.join(', ')}
    `.trim();
  } else {
    return `
    Task Title: ${task.title}

    Description:
    ${task.description}

    Human Prompt:
    ${humanPrompt}

    Human Instructions:
    ${task.human_instructions}

    Deliverables:
    ${task.deliverables.join(', ')}
    `.trim();
  }
};
