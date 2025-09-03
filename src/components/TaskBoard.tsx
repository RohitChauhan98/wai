'use client'

import React, { useState, DragEvent, useRef, useEffect } from 'react';
import { Clock, User, Calendar, Flag, CheckCircle2, Circle, AlertCircle, CheckCircle, CheckCircleIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AIResultsModal from './aiResultModal';
import HumanInputModal from './humanInputModal';
import { set } from 'date-fns';

interface Container {
    id: string;
    title: string;
    color?: string;
    tasks: any[]
}


const statuses: Container[] = [
    { id: "pending", title: "Pending", color: "bg-gray-700", tasks: [] },
    { id: "in-progress", title: "In Progress", color: "bg-yellow-700", tasks: [] },
    { id: "done", title: "Done", color: "bg-green-700", tasks: [] },
]



export default function TaskBoard() {
    const [workflow, setWorkflow] = useState<any>({
        "workflow_id": "b83730fb-6f81-4fd2-b1db-6b0427716f8e",
        "query": "help me create a 2 week plan for a marketing campain for my company cococola where we analyze the market trends about my brand and my competators and then we will post accordingly and create cretive reply to the competators",
        "created_at": "2024-06-12T10:00:00.000Z",
        "updated_at": "2024-06-12T10:00:00.000Z",
        "status": "active",
        "total_tasks": 7,
        "completed_tasks": 0,
        "estimated_total_duration": 600,
        "tasks": [
            {
                "task_id": "f8394aad-3e4c-492e-8894-8576e5a465c1",
                "type": "human",
                "title": "Define Campaign Objectives and Identify Key Competitors",
                "description": "Clearly articulate the goals of the 2-week campaign and list primary competitors to benchmark against.",
                "priority": 1,
                "estimated_duration": 45,
                "dependencies": [],
                "tools_required": [],
                "ai_prompt": "",
                "human_instructions": "List the specific objectives for the CocaCola marketing campaign and identify at least 3 major competitors.",
                "deliverables": ["Documented campaign objectives", "Competitor list"],
                "status": "pending",
                "assigned_to": "human",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "a31ff65a-4925-4c1e-bf39-bb4e2006e2c2",
                "type": "ai",
                "title": "Scrape and Analyze Social Media Trends (CocaCola and Competitors)",
                "description": "Extract and analyze recent social media conversations, hashtags, and user sentiment about CocaCola and its competitors.",
                "priority": 1,
                "estimated_duration": 120,
                "dependencies": ["f8394aad-3e4c-492e-8894-8576e5a465c1"],
                "tools_required": ["Twitter Scraper"],
                "ai_prompt": "Use the Twitter Scraper to extract recent tweets, top conversations, trending hashtags, and sentiment related to CocaCola and the specified competitors. Provide an exportable dataset and summary report.",
                "human_instructions": "Review the output dataset and summary for relevance.",
                "deliverables": ["Tweet and hashtag dataset", "Sentiment summary report"],
                "status": "pending",
                "assigned_to": "ai",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "219cb8ee-3e84-4b8c-b7d1-bf60a0b45efa",
                "type": "ai",
                "title": "Extract Competitor Campaign Data from LinkedIn",
                "description": "Scrape LinkedIn for recent marketing posts and activities from competitors for insight into their campaign strategies.",
                "priority": 2,
                "estimated_duration": 90,
                "dependencies": ["f8394aad-3e4c-492e-8894-8576e5a465c1"],
                "tools_required": ["LinkedIn Scraper"],
                "ai_prompt": "Use LinkedIn Scraper to gather recent public posts, shares, and campaign materials from competitor company pages.",
                "human_instructions": "Review competitor activities for insight into strategic moves.",
                "deliverables": ["Competitor LinkedIn activity report"],
                "status": "pending",
                "assigned_to": "ai",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "697fc27d-58b5-44ad-8168-e596f2e78dd7",
                "type": "ai",
                "title": "Generate Consolidated Market Trends and Insights Report",
                "description": "Combine data from Twitter and LinkedIn analyses to produce actionable marketing insights.",
                "priority": 1,
                "estimated_duration": 60,
                "dependencies": ["a31ff65a-4925-4c1e-bf39-bb4e2006e2c2", "219cb8ee-3e84-4b8c-b7d1-bf60a0b45efa"],
                "tools_required": ["Excel"],
                "ai_prompt": "Analyze the social media and LinkedIn data to identify actionable market trends, popular topics, campaign gaps, and engagement strategies. Summarize in a clear report.",
                "human_instructions": "Review the insights report for strategic relevance.",
                "deliverables": ["Market insights report (PDF/Excel)"],
                "status": "pending",
                "assigned_to": "ai",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "c378e6a3-350c-47e6-b640-7f112257ed7a",
                "type": "human",
                "title": "Review and Approve Campaign Insights and Proposed Direction",
                "description": "Go through the compiled insights report and confirm/adjust the content strategy direction.",
                "priority": 1,
                "estimated_duration": 60,
                "dependencies": ["697fc27d-58b5-44ad-8168-e596f2e78dd7"],
                "tools_required": [],
                "ai_prompt": "",
                "human_instructions": "Study the report, confirm strategic direction, and note any changes needed before content planning.",
                "deliverables": ["Approved or revised campaign direction notes"],
                "status": "pending",
                "assigned_to": "human",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "be387a84-52ec-4d6f-8dce-654d6a39e45e",
                "type": "ai",
                "title": "Draft Marketing Posts and Creative Competitive Replies",
                "description": "Based on approved strategy, draft engaging marketing posts and creative, brand-appropriate replies to competitors' campaigns.",
                "priority": 2,
                "estimated_duration": 120,
                "dependencies": ["c378e6a3-350c-47e6-b640-7f112257ed7a"],
                "tools_required": ["Excel"],
                "ai_prompt": "Develop a content calendar including draft posts tailored to trending topics and entertaining replies or interactions with competitor brand campaigns, ensuring all tone and messaging fit CocaCola's voice.",
                "human_instructions": "Review drafts for tone, content, and brand alignment.",
                "deliverables": ["Content calendar", "Draft posts", "Suggested creative replies"],
                "status": "pending",
                "assigned_to": "ai",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            },
            {
                "task_id": "6464e9c0-4dc6-4183-9c7d-8c9ae93cc2b6",
                "type": "human",
                "title": "Review, Approve, Schedule and Monitor Campaign Content",
                "description": "Finalize all planned posts and replies, schedule posting times, and assign monitoring responsibility for engagement.",
                "priority": 1,
                "estimated_duration": 105,
                "dependencies": ["be387a84-52ec-4d6f-8dce-654d6a39e45e"],
                "tools_required": [],
                "ai_prompt": "",
                "human_instructions": "Approve final content, coordinate with scheduling tools (outside this flow), and assign team members for real-time engagement monitoring.",
                "deliverables": ["Published content schedule", "Assignment sheet for monitoring"],
                "status": "pending",
                "assigned_to": "human",
                "created_at": "2024-06-12T10:00:00.000Z",
                "completed_at": null
            }
        ]
    });

    const [basedOnStatus, setBasedOnStatus] = useState<Container[]>(statuses);
    const [basedOnDeadline, setBasedOnDeadline] = useState<any>();
    const [basedOnAssignee, setBasedOnAssignee] = useState<any>();
    const [submit, setSubmit] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
    const [humanInput, setHumanInput] = useState<string>('');
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const params = useSearchParams();
    const workflowId = params.get('id');

    const draggedItem = useRef<{ item: any; sourceContainerId: string } | null>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, item: any) => {
        // Find which container this item belongs to
        const sourceContainer = basedOnStatus.find(container =>
            container.tasks.some(i => i.task_id === item.task_id)
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

    const handleDragEnd = () => {
        draggedItem.current = null;
    };

    const getItemTypeColor = (type: any['type']) => {
        switch (type) {
            case 'task':
                return 'bg-blue-900 border-blue-600 text-blue-200';
            case 'human':
                return 'bg-green-900 border-green-600 text-green-200';
            case 'reminder':
                return 'bg-yellow-900 border-yellow-600 text-yellow-200';
            default:
                return 'bg-gray-800 border-gray-600 text-gray-200';
        }
    };

    const updateItemContainer = (item: any, targetContainerId: string) => {
        setBasedOnStatus(prev => {
            return prev.map(container => {
                // Remove from old container
                if (container.id === item.status) {
                    return {
                        ...container,
                        tasks: container.tasks.filter(i => i.task_id !== item.task_id),
                    };
                }

                // Add to target container
                if (container.id === targetContainerId) {
                    return {
                        ...container,
                        tasks: [...container.tasks, { ...item, status: targetContainerId }],
                    };
                }

                // Other containers unchanged
                return container;
            });
        });
    };
    const handleContainerDrop = (e: DragEvent, targetContainerId: string) => {
        e.preventDefault();

        if (!draggedItem.current) return;

        const { item, sourceContainerId } = draggedItem.current;

        //Don't do anything if dropping in the same container


        if (sourceContainerId === targetContainerId) return;

        updateItemContainer(item, targetContainerId);
        saveTaskStatus(item.task_id, targetContainerId);

        draggedItem.current = null;
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/workflow/create?workflow_id=${workflowId}`);
            const data = await response.json();

            console.log("Single Workflow Data: ", data.workflow);

            if (data.workflow) {
                setWorkflow(data.workflow);
            }
        };
        fetchData();
    }, [workflowId])

    async function saveHookResponse(task_id: any, response: any): Promise<boolean> {
        try {
            const res = await fetch('/api/workflow/task/updateTaskResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflow_id: workflow.workflow_id,
                    task_id: task_id,
                    response
                })
            });

            const data = await res.json();
            console.log("Save Hook Response Data: ", data);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    async function saveTaskStatus(task_id: any, status: any): Promise<boolean> {
        try {
            const res = await fetch('/api/workflow/task/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflow_id: workflow.workflow_id,
                    task_id: task_id,
                    status
                })
            });

            const data = await res.json();
            console.log("Task Status Update Data: ", data);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    async function getTaskResponse(task_id: any): Promise<boolean> {
        try {
            const res = await fetch('/api/workflow/task/getTaskResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workflow_id: workflow.workflow_id,
                    task_id: task_id,
                })
            });

            const data = await res.json();
            console.log("Task Status Update Data: ", data);
            setModalData(data.response.data);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }


    const buildFullPrompt = (task: any, forAi: boolean, humanPrompt: string) => {
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
    }

    async function talkToHook(prompt: string, task: any, workflowId: string): Promise<boolean> {
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

            setModalData(data[0].output);

            // Add AI response to chat history
            const aiResponse = {
                type: "ai",
                data: {
                    content: data[0].output || "I received your message.",
                    tool_calls: [],
                    invalid_tool_calls: [],
                    additional_kwargs: {},
                    response_metadata: {}
                }
            };

            return await saveHookResponse(task.task_id, aiResponse);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            const errorResponse = {
                type: "ai",
                data: {
                    content: "Sorry, I encountered an error. Please try again.",
                    tool_calls: [],
                    invalid_tool_calls: [],
                    additional_kwargs: {},
                    response_metadata: {}
                }
            };
            return false;
        }
    }


    const handleAiTask = async (task: any) => {

        //move the task to in-progress container
        updateItemContainer(task, 'in-progress');
        saveTaskStatus(task.task_id, 'in-progress');

        // console.log("Handle Ai Task1", basedOnStatus)
        //send the request to n8n hook
        const prompt = buildFullPrompt(task, true, "");
        let done = await talkToHook(prompt, task, workflow.workflow_id)
        if (done) {
            task.status = 'in-progress';
            //after completion move the task to completed container
            updateItemContainer(task, 'done');
            saveTaskStatus(task.task_id, 'done');
        }

    }

    const moveHumanTasktoInprogress = (task: any) => {
        //move the task to in-progress container
        updateItemContainer(task, 'in-progress');
        saveTaskStatus(task.task_id, 'in-progress');

    }

    function handleHumanInputModal(task: any) {
        setSelectedTask(task);
        setIsHumanModalOpen(true);
    }

    function showTaskResult(task: any) {
        getTaskResponse(task.task_id);
        setIsModalOpen(true);
    }



    useEffect(() => {
        if (submit) {
            handleHumanTask(selectedTask)

        }
    }, [submit])


    const handleHumanTask = async (task: any) => {

        //send the request to n8n hook
        const prompt = buildFullPrompt(task, false, humanInput);
        let done = await talkToHook(prompt, task, workflow.workflow_id)
        if (done) {
            setSubmit(false);
            task.status = 'in-progress';
            //after completion move the task to completed container
            updateItemContainer(task, 'done');
            saveTaskStatus(task.task_id, 'done')
        }
    }



    const DraggableComponent: React.FC<{
        item: any;
    }> = ({ item }) => (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            className={`
            p-3 mb-2 border-2 border-dashed rounded-lg cursor-move transition-all duration-200
            hover:shadow-md hover:scale-105 select-none
            ${getItemTypeColor(item.type)}
            ${draggedItem.current?.item.id === item.id ? '' : 'opacity-50 scale-95'}
          `}
        >
            {/* Header with title and status */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-200 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                    {item.status === 'done' ?
                        <CheckCircleIcon className="w-4 h-4 text-green-400" /> :
                        item.status === 'in-progress' ?
                            <AlertCircle className="w-4 h-4 text-blue-400" /> :
                            <Circle className="w-4 h-4 text-gray-500" />
                    }
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.priority === 1 ? 'bg-red-900 text-red-300' :
                        item.priority === 2 ? 'bg-yellow-900 text-yellow-300' :
                            'bg-blue-900 text-blue-300'
                        }`}>
                        {item.priority === 1 ? 'HIGH' : item.priority === 2 ? 'MED' : 'LOW'}
                    </span>
                </div>
            </div>

            {/* Meta info row */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.estimated_duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="capitalize">{item.assigned_to}</span>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${item.status === 'done' ? 'bg-green-900 text-green-300' :
                    item.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                        'bg-gray-800 text-gray-300'
                    }`}>
                    {item.status}
                </span>
            </div>

            {/* Deliverables */}
            {item.deliverables && item.deliverables.length > 0 && (
                <div className="mb-3 p-2 bg-gray-800 bg-opacity-60 rounded-lg">
                    <div className="flex items-start gap-1">
                        <Flag className="w-3 h-3 mt-0.5 text-orange-400" />
                        <div className="flex-1">
                            <span className="text-xs font-medium text-gray-300">Deliverables:</span>
                            <div className="mt-1 space-y-1">
                                {item.deliverables.map((deliverable: any, index: number) => (
                                    <div key={index} className="flex items-start gap-1">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-xs text-gray-400">{deliverable}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom row with type badge and date */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide ${item.type === 'human' ? 'bg-blue-600 text-white' :
                    item.type === 'ai' ? 'bg-purple-600 text-white' :
                        'bg-gray-600 text-white'
                    }`}>
                    {item.type}
                </span>
            </div>
            {item.type === 'ai' && item.status !== 'done' && <div className='flex justify-end mt-3'>

                <button onClick={() => handleAiTask(item)} className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:scale-95 active:bg-blue-800 transition-transform duration-150'>{item.status == 'pending' ? 'Proceed' : item.status === 'in-progress' ? 'Processing...' : 'Completed'}</button>
            </div>}
            {item.type === 'human' && item.status !== 'done' && <div className='flex justify-end mt-3'>
                <button onClick={() => { item.status == 'pending' ? moveHumanTasktoInprogress(item) : item.status === 'in-progress' ? handleHumanInputModal(item) : null }} className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:scale-95 active:bg-blue-800 transition-transform duration-150'>{item.status == 'pending' ? 'Proceed' : item.status === 'in-progress' ? (submit ? 'Processing...' : 'Write a Note...') : 'Completed'}</button>
            </div>}
            {item.status === 'done' && <div className='flex justify-between mt-3'>
                {item.type === 'ai' && <button onClick={() => {
                    updateItemContainer(item, 'in-progress');
                    saveTaskStatus(item.task_id, 'in-progress');
                    handleHumanInputModal(item);
                }} className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:scale-95 active:bg-blue-800 transition-transform duration-150'>Custom Prompt</button>}

                <button onClick={() => showTaskResult(item)} className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 active:scale-95 active:bg-blue-800 transition-transform duration-150'>Show Result</button>
            </div>}
        </div>
    );

    const DraggableComponent1: React.FC<{
        item: any;
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

    const StatusContainer = ({ container }: { container: Container }) => {


        return (
            <div className={`pb-[60px] p-4 rounded-xl ${container.color}`}>
                <div className="flex-1 h-full">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{container.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-400 px-2 py-1 rounded-full text-black font-bold">
                                {container.tasks.length}
                            </span>
                            {/* <button
                            onClick={() => addNewItem(container.id)}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                            + Add
                        </button> */}
                        </div>
                    </div>

                    <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleContainerDrop(e, container.id)}
                        className={`
          h-full p-3 border-2 border-dashed rounded-xl 
          transition-all duration-200 
          ${draggedItem.current && draggedItem.current.sourceContainerId !== container.id
                                ? `border-blue-400 bg-blue-100`
                                : `${container.color || 'border-gray-300 bg-gray-50'} hover:border-opacity-70`}
        `}
                    >
                        {container.tasks.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-500 text-center">
                                <div>
                                    <div className="text-2xl mb-2">📋</div>
                                    <div className="text-sm text-white">Drop items here</div>
                                </div>
                            </div>
                        ) : (
                            container.tasks.map((task) => (
                                <DraggableComponent
                                    key={task.task_id}
                                    item={task}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };



    useEffect(() => {
        //this useEffect will sort workflow based on status

        const updatedStatuses: any = statuses.map((s) => ({ ...s, tasks: [] }));

        workflow && workflow.tasks.map((task: any) => {
            const container = updatedStatuses.find((s: any) => s.id === task.status);
            if (container) {
                container.tasks = [...container.tasks, task];
            }
        })

        setBasedOnStatus(updatedStatuses);
    }, [workflow])

    useEffect(() => {
        console.log("Submit State:", basedOnStatus)
    }, [submit])


    return (
        <div className="" >
            <div>
                <p className='text-white text-2xl text-center font-medium py-5'>{workflow.title || ""}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 mt-5">
                {basedOnStatus && basedOnStatus.map((statusContainer) => (
                    <StatusContainer
                        key={statusContainer.id}
                        container={statusContainer}
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
                onChange={setHumanInput}
                handleSubmition={setSubmit}
            />
        </div >
    )
}








