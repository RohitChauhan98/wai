'use client'

import React, { useEffect, useState } from 'react';
import { Search, Play, Edit3, Package, Shield, BarChart3, Headphones, FileText, Target, Database, Smartphone, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

// interface Workflow {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   status: 'active' | 'inactive' | 'draft';
//   iconBg: string;
// }

// const workflows: Workflow[] = [
//   {
//     id: 1,
//     title: "User Onboarding",
//     description: "Automated email sequence for new user registration and welcome process",
//     icon: <Users className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-blue-500/20"
//   },
//   {
//     id: 2,
//     title: "Invoice Processing",
//     description: "Automatically process and validate incoming invoices from suppliers",
//     icon: <FileText className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-purple-500/20"
//   },
//   {
//     id: 3,
//     title: "Lead Qualification",
//     description: "Score and categorize leads based on engagement and demographics",
//     icon: <Target className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-green-500/20"
//   },
//   {
//     id: 4,
//     title: "Backup System",
//     description: "Daily automated backup of critical system data and databases",
//     icon: <Database className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-orange-500/20"
//   },
//   {
//     id: 5,
//     title: "Social Media Posts",
//     description: "Schedule and publish content across multiple social media platforms",
//     icon: <Smartphone className="w-6 h-6" />,
//     status: "draft",
//     iconBg: "bg-pink-500/20"
//   },
//   {
//     id: 6,
//     title: "Inventory Alert",
//     description: "Monitor stock levels and send alerts when items are running low",
//     icon: <Package className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-cyan-500/20"
//   },
//   {
//     id: 7,
//     title: "Customer Support",
//     description: "Route support tickets to appropriate team members based on priority",
//     icon: <Headphones className="w-6 h-6" />,
//     status: "inactive",
//     iconBg: "bg-lime-500/20"
//   },
//   {
//     id: 8,
//     title: "Report Generation",
//     description: "Generate weekly performance reports and send to stakeholders",
//     icon: <BarChart3 className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-indigo-500/20"
//   },
//   {
//     id: 9,
//     title: "Security Scan",
//     description: "Perform regular security scans and vulnerability assessments",
//     icon: <Shield className="w-6 h-6" />,
//     status: "active",
//     iconBg: "bg-red-500/20"
//   }
// ];

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([]);

  const router = useRouter();

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
    
//     const filtered = workflows.filter(workflow =>
//       workflow.title.toLowerCase().includes(term) ||
//       workflow.description.toLowerCase().includes(term)
//     );
//     setFilteredWorkflows(filtered);
//   };

  const openWorkflow = (id: number) => {
    console.log(`Opening workflow ${id}`);
    router.push(`/workflow/task-board?id=${id}`);
  };

  const runWorkflow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Running workflow ${id}`);
    // Add your workflow execution logic here
  };

  const editWorkflow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Editing workflow ${id}`);
    // Add your workflow editing logic here
  };

  useEffect(()=>{
    const fetchWorkflows = async () => {
      const response = await fetch('/api/workflow');
      const data = await response.json();
      console.log("All WorkFlows: ", data.workflows);
      setFilteredWorkflows(data.workflows);
    };

    fetchWorkflows();
  },[])
  

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Workflows
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage and monitor your automated workflows with precision and control
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
            //   onChange={handleSearch}
              placeholder="Search workflows..."
              className="w-full pl-12 pr-6 py-4 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 focus:scale-105"
            />
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => openWorkflow(workflow.workflow_id)}
              className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-gray-800/50 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-white/10"
            >
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              
              {/* Icon */}
              {/* <div className={`w-16 h-16 rounded-2xl ${workflow.iconBg} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {workflow.icon}
              </div> */}

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {workflow.title || 'Untitled Workflow'}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                {workflow.query.length > 200 ? workflow.query.slice(0, 100) + '...' : workflow.queryS}
              </p>

              {/* Status */}
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider ${getStatusStyles(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => runWorkflow(workflow.id, e)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                <button
                  onClick={(e) => editWorkflow(workflow.id, e)}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white border border-gray-600/50 hover:border-gray-500/50 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-20">🔍</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No workflows found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsPage;