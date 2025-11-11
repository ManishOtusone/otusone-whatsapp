import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { FiMoreVertical } from 'react-icons/fi';
import NodeConfigModal from './NodeConfigModal';

const nodeTypeColors = {
    sendMessage: 'bg-[#e95c69]',
    askQuestion: 'bg-[#ff9933]',
    setCondition: 'bg-[#6d7ed6]',
    subscribe: 'bg-[#efa244]',
    updateAttribute: 'bg-[#c5572c]',
    setTags: 'bg-[#ecdc46]',
    assignUser: 'bg-[#55dc87]',
    template: 'bg-[#d897ff]',
    triggerChatbot: 'bg-[#2f91e8]',
    aiAssist: 'bg-[#2f91e8]',
    assignTeam: 'bg-[#ff9933]',
    unsubscribe: 'bg-[#efa244]',
};

const CustomNode = ({ 
    data, 
    id, 
    onEditNode, 
    onDeleteNode,
    connectionState,
    setConnectionState
}) => {
    const [showConfig, setShowConfig] = useState(false);
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(data.description || '');
    const [hoveredButton, setHoveredButton] = useState(null);
    
    const colorClass = nodeTypeColors[data.type] || 'bg-gray-300';

    console.log("data",)

    useEffect(() => {
        setDescription(data.description || '');
    }, [data.description]);

    const handleEdit = () => setShowConfig(true);
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleBlur();
    };

    const handleBlur = () => {
        setEditing(false);
        const updatedNode = {
            id,
            data: {
                ...data,
                description,
            },
        };
        onEditNode?.(updatedNode);
    };

    // Start button connection process
    const startButtonConnection = (buttonIndex) => {
        setConnectionState({
            isConnecting: true,
            sourceNodeId: id,
            buttonIndex
        });
    };

    // Reset connection state
    const resetConnection = () => {
        setConnectionState({
            isConnecting: false,
            sourceNodeId: null,
            buttonIndex: null
        });
    };

    return (
        <div className="relative w-72 rounded-xl border border-gray-300 shadow-md overflow-hidden bg-white">
            <div className={`flex justify-between items-center px-4 py-2 text-white ${colorClass}`}>
                <div className="font-semibold text-sm">{data.label}</div>
                <div className="relative group">
                    <button className="p-1 hover:bg-white/10 rounded">
                        <FiMoreVertical size={16} />
                    </button>
                    <div className="absolute right-0 top-0 hidden group-hover:block bg-white text-gray-700 shadow-lg rounded-md text-sm z-10">
                        <button onClick={handleEdit} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                        <button onClick={() => onDeleteNode?.(id)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500">Delete</button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3">
                {editing ? (
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full p-2 text-sm border rounded-md focus:outline-none resize-none overflow-hidden"
                        placeholder="Step details"
                        autoFocus
                        rows={1}
                        style={{ minHeight: '40px' }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                ) : (
                    <div
                        className="text-sm text-gray-800 whitespace-pre-wrap min-h-[40px] cursor-text"
                        onClick={() => setEditing(true)}
                    >
                        {description || <span className="text-gray-400">Click to add details...</span>}
                    </div>
                )}

                {Array.isArray(data?.buttons) && data.buttons.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {data.buttons.map((btn, idx) => {
                            const isConnected = !!btn.nextNodeId;
                            const isActiveConnection = (
                                connectionState?.isConnecting && 
                                connectionState.sourceNodeId === id && 
                                connectionState.buttonIndex === idx
                            );
                            
                            return (
                                <div 
                                    key={idx} 
                                    className="w-full relative"
                                    onMouseEnter={() => setHoveredButton(idx)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                >
                                    <button
                                        className={`w-full text-left bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm ${
                                            isActiveConnection ? 'ring-2 ring-yellow-400' : ''
                                        }`}
                                        onClick={() => alert(`Simulate click: ${btn.payload}`)}
                                    >
                                        {btn.title}
                                    </button>
                                    
                                    {/* Connection handle that appears on hover */}
                                    {(hoveredButton === idx || isActiveConnection) && (
                                        <div className="absolute -right-2 top-1/2 transform -translate-x-1/2">
                                            <Handle
                                                type="source"
                                                position="right"
                                                id={`button-${id}-${idx}`}
                                                className={`!w-4 !h-4 !bg-green-500 !border-2 !border-white !rounded-full cursor-pointer z-20 ${
                                                    isActiveConnection ? '!bg-yellow-500 animate-pulse' : ''
                                                }`}
                                                onConnect={resetConnection}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Connection indicator */}
                                    {isConnected && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center z-20">
                                            <div className="text-xs text-white font-bold">
                                                {idx + 1}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Handle
                type="target"
                position="top"
                className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !rounded-full cursor-pointer z-20"
                style={{ top: -8 }}
            />
            
            <Handle
                type="source"
                position="bottom"
                id="node-source"
                className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !rounded-full cursor-pointer z-20"
                style={{ bottom: -8 }}
            />
             
            {showConfig && (
                <NodeConfigModal
                    node={{ id, data }}
                    onSave={(updatedNode) => {
                        onEditNode?.(updatedNode);
                        setDescription(updatedNode.data.description || '');
                    }}
                    onClose={() => setShowConfig(false)}
                />
            )}
        </div>
    );
};

export default CustomNode;