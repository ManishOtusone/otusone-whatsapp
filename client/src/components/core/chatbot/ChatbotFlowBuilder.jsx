import React, { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
    addEdge, useNodesState, useEdgesState, Controls, Background,
    getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import { postApplicationJsonRequest } from '../../../services/apiServices';
import Sidebar from './Sidebar';

// Custom button connection edge
const ButtonConnectionEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    return (
        <path
            id={id}
            style={style}
            className="react-flow__edge-path stroke-[3] stroke-green-500"
            d={edgePath}
            markerEnd={markerEnd}
        />
    );
};

// Wrapper for drag-and-drop functionality
const FlowDropWrapper = ({ reactFlowWrapper, reactFlowInstance, setNodes, children }) => {
    const localRef = useRef(null);

    const [, drop] = useDrop(() => ({
        accept: 'node',
        drop: (item, monitor) => {
            if (!reactFlowWrapper.current || !reactFlowInstance) return;

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) return;

            const position = reactFlowInstance.project({
                x: clientOffset.x - reactFlowBounds.left,
                y: clientOffset.y - reactFlowBounds.top,
            });

            const newNode = {
                id: `${item.type}-${Date.now()}`,
                type: 'custom',
                position,
                data: {
                    label: item.label || item.type,
                    description: item.description || '',
                    type: item.type,
                    buttons: item.type === 'sendMessage' ? [
                        {
                            title: 'Start',
                            payload: 'START_FLOW',
                            type: 'postback',
                            nextNodeId: ''
                        }
                    ] : [],
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
    }));

    React.useEffect(() => {
        if (localRef.current) {
            reactFlowWrapper.current = localRef.current;
            drop(localRef.current);
        }
    }, [drop]);

    return (
        <div className="flex-1 h-full" ref={localRef}>
            {children}
        </div>
    );
};

// Main Flow Builder Component
const ChatbotFlowBuilder = ({ chatbotName, setActiveTab, setStartBuilder }) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // Button connection state
    const [connectionState, setConnectionState] = useState({
        isConnecting: false,
        sourceNodeId: null,
        buttonIndex: null
    });

    // Edge types configuration
    const edgeTypes = useMemo(() => ({
        buttonConnection: ButtonConnectionEdge,
        default: ButtonConnectionEdge // Use same style for regular edges
    }), []);

    // Node types configuration
    const nodeTypes = useMemo(() => ({
        custom: (nodeProps) => (
            <CustomNode
                {...nodeProps}
                onEditNode={handleNodeEdit}
                onDeleteNode={handleDeleteNode}
                connectionState={connectionState}
                setConnectionState={setConnectionState}
            />
        )
    }), [connectionState]);

    const onConnect = useCallback((params) => {
        if (params.sourceHandle?.startsWith('button-')) {
            const parts = params.sourceHandle.split('-');
            const buttonIndex = parts.pop();  // Last part is always button index
            const sourceNodeId = parts.slice(1).join('-'); // All parts except "button"

            setNodes(nodes => nodes.map(node => {
                if (node.id === sourceNodeId) {
                    const updatedButtons = [...node.data.buttons];
                    updatedButtons[buttonIndex] = {
                        ...updatedButtons[buttonIndex],
                        nextNodeId: params.target
                    };
                    return {
                        ...node,
                        data: { ...node.data, buttons: updatedButtons }
                    };
                }
                return node;
            }));

            const newEdge = {
                ...params,
                id: `btn-edge-${sourceNodeId}-${buttonIndex}-${params.target}`,
                type: "buttonConnection",
                animated: true,
                data: {
                    buttonIndex: parseInt(buttonIndex),
                    sourceNode: sourceNodeId
                }
            };
            setEdges(eds => addEdge(newEdge, eds));
        } else {
            setEdges(eds => addEdge(params, eds));
        }
        setConnectionState({ isConnecting: false });
    }, []);

    // Add node to flow
    const addNodeByClick = (node) => {
        if (!reactFlowInstance || !reactFlowWrapper.current) return;

        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const position = reactFlowInstance.project({
            x: centerX,
            y: centerY,
        });

        const newNode = {
            id: `${node.type}-${Date.now()}`,
            type: 'custom',
            position,
            data: {
                label: node.label || node.type,
                description: node.description || '',
                type: node.type,
                buttons: node.type === 'sendMessage' ? [
                    {
                        title: 'Start',
                        payload: 'START_FLOW',
                        type: 'postback',
                        nextNodeId: ""
                    }
                ] : [],
            },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    // Delete a node
    const handleDeleteNode = (id) => {
        // Remove connected edges
        setEdges(edges => edges.filter(
            edge => edge.source !== id && edge.target !== id
        ));

        // Remove the node
        setNodes((nds) => nds.filter((node) => node.id !== id));
    };

    // Save chatbot configuration
    const handleSaveChatbot = async () => {
        const chatbotData = {
            name: chatbotName || 'My Chatbot Flow',
            description: 'Auto-generated chatbot from builder',
            type: 'flow',
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.data.type,
                label: node.data.label,
                description: node.data.description || '',
                field: node.data.field || null,
                buttons: node.data.buttons?.map(btn => ({
                    title: btn.title,
                    payload: btn.payload,
                    type: btn.type,
                    nextNodeId: btn.nextNodeId || null
                })) || [],
                position: node.position,
            })),
            edges: edges.map(edge => ({
                source: edge.source,
                target: edge.target,
                type: edge.type,
                id: edge.id,
                data: edge.data
            })),
            metadata: {
                tags: ['builder'],
                category: 'custom',
                isPublic: false,
                status: 'active'
            },
            triggers: {
                onStart: { message: 'Welcome to our chatbot!' }
            }
        };

        try {
            const response = await postApplicationJsonRequest(`/meta-chatbot/save`, chatbotData)
            if (response.status === 201) {
                const result = response?.data;
                toast.success('Chatbot saved successfully!');
                console.log('Saved chatbot:', result?.chatbot);
                setActiveTab('all');
                setStartBuilder(false)
            } else {
                toast.error(`Error: ${response?.data?.message}`);
            }
        } catch (error) {
            console.error('Error saving chatbot:', error);
            toast.error('Failed to save chatbot. See console for details.');
        }
    };

    // Edit node handler
    const handleNodeEdit = useCallback((updatedNode) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === updatedNode.id ? { ...node, data: updatedNode.data } : node
            )
        );
    }, [setNodes]);

    console.log("nodes", nodes)

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen overflow-hidden bg-gray-100">
                <Sidebar onAddNode={addNodeByClick} />

                <FlowDropWrapper
                    reactFlowWrapper={reactFlowWrapper}
                    reactFlowInstance={reactFlowInstance}
                    setNodes={setNodes}
                >
                    <div className='relative h-full w-full'>
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={handleSaveChatbot}
                                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            >
                                Save Chatbot
                            </button>
                        </div>

                        <div className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded shadow">
                            <h1 className="text-xl font-semibold">
                                🧠 Chatbot Builder: <span className="text-blue-600">{chatbotName}</span>
                            </h1>
                        </div>

                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            fitView
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* Arrow marker definition */}
                            <defs>
                                <marker
                                    id="button-arrow"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="3"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <path d="M0,0 L0,6 L9,3 z" fill="green" />
                                </marker>
                                <marker
                                    id="default-arrow"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="3"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <path d="M0,0 L0,6 L9,3 z" fill="#555" />
                                </marker>
                            </defs>

                            <Background color="#f0f2f5" gap={20} />
                            <Controls />
                        </ReactFlow>
                    </div>
                </FlowDropWrapper>
            </div>
        </DndProvider>
    );
};

export default ChatbotFlowBuilder;