import React from 'react';
import { useDrag } from 'react-dnd';

const nodeTypes = [
    {
        type: 'sendMessage',
        label: 'Send a message',
        description: 'With no response required from visitor',
        color: 'bg-[#e95c69]',
    },
    {
        type: 'askQuestion',
        label: 'Ask a question',
        description: 'Ask question and store user input in variable',
        color: 'bg-[#ff9933]',
    },
    {
        type: 'setCondition',
        label: 'Set a condition',
        description: 'Send message(s) based on logical condition(s)',
        color: 'bg-[#6d7ed6]',
    },
];

const operations = [
    { type: 'aiAssist', label: 'AI Assist', icon: '🤖' },
    { type: 'subscribe', label: 'Subscribe', icon: '🔔' },
    { type: 'unsubscribe', label: 'Unsubscribe', icon: '🚫' },
    { type: 'updateAttribute', label: 'Update Attribute', icon: '✏️' },
    { type: 'setTags', label: 'Set Tags', icon: '🏷️' },
    { type: 'assignTeam', label: 'Assign Team', icon: '👥' },
    { type: 'assignUser', label: 'Assign User', icon: '🧍' },
    { type: 'triggerChatbot', label: 'Trigger Chatbot', icon: '⚡' },
    { type: 'updateStatus', label: 'Update Chat Status', icon: '✅' },
    { type: 'template', label: 'Template', icon: '📄' },
    { type: 'webhook', label: 'Webhook', icon: '📄' },
    { type: 'whatsAppFlows', label: 'WhatsApp Flows', icon: '📄' },
];

const SidebarItem = ({ node, onAddNode }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'node',
        item:node,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`cursor-pointer mb-4 p-4 rounded-lg shadow-md transition-all hover:scale-[1.02] text-white ${node.color}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={() => onAddNode(node)

            }
        >
            <div className="font-semibold text-base">{node.label}</div>
            <div className="text-sm opacity-80">{node.description}</div>
        </div>
    );
};

const OperationItem = ({ node, onAddNode }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'node',
        item: node,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className="flex items-center gap-2 px-3 py-2 mb-2 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-all"
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={() => onAddNode(node)}
        >
            <span className="text-xl">{node.icon}</span>
            <span className="text-gray-800 font-medium">{node.label}</span>
            <div className="text-sm opacity-80">{node.description}</div>
        </div>
    );
};

const Sidebar = ({ onAddNode }) => {
    return (
        <aside className="bg-gray-100 h-full w-72 p-5 overflow-y-auto shadow-inner border-r">
            <h2 className="text-lg font-bold mb-4">Components</h2>
            {nodeTypes.map((node, idx) => (
                <SidebarItem key={idx} node={node} onAddNode={onAddNode} />
            ))}

            <h2 className="text-lg font-bold mt-6 mb-3">Operations</h2>
            <div className="space-y-2">
                {operations.map((op, idx) => (
                    <OperationItem key={idx} node={op} onAddNode={onAddNode} />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
