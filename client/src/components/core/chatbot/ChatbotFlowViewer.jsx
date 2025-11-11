import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
    addEdge, useNodesState, useEdgesState, Controls, Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import { getRequest, patchRequest, postApplicationJsonRequest } from '../../../services/apiServices';
import { useNavigate, useParams } from 'react-router-dom';
import { DndProvider, useDrop } from 'react-dnd';

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
                id: `${item.type}-${+new Date()}`,
                type: 'custom',
                position,
                data: {
                    label: item.label || item.type,
                    description: item.description || '',
                    type: item.type,
                    
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

const ChatbotFlowViewer = () => {
    const { chatbotId } = useParams();
    const navigate = useNavigate()
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [chatbotData, setChatbotData] = useState()
    const [loading, setLoading] = useState(true);

    const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), []);
    const handleBack = () => {
        navigate(-1)
    }

    const handleNodeEdit = useCallback(updatedNode => {
        setNodes(prev => prev.map(n => (n.id === updatedNode.id ? { ...n, data: updatedNode.data } : n)));
    }, [setNodes]);

    const handleDeleteNode = id => setNodes(nds => nds.filter(n => n.id !== id));

    const customNodeTypes = useMemo(() => ({
        custom: props => <CustomNode {...props} onEditNode={handleNodeEdit} onDeleteNode={handleDeleteNode} />,
    }), [handleNodeEdit]);

    useEffect(() => {
        const fetchChatbot = async () => {
            try {
                const res = await getRequest(`/meta-chatbot/${chatbotId}`);
                if (res.status === 200) {
                    const { chatbot } = res.data;
                    setChatbotData(chatbot);
                    const mappedNodes = chatbot.nodes.map(n => ({
                        id: n.id,
                        type: 'custom',
                        position: n.position,
                        data: {
                            label: n.data.label,
                            description: n.data.description,
                            type: n.data.type,
                            field: n.data.inputs,
                            nodeType: n.type,
                            buttons: n.data.buttons || [],
                        }
                    }));
                    setNodes(mappedNodes);
                    setEdges(chatbot.edges);
                } else {
                    toast.error('Failed to load chatbot.');
                }
            } catch (err) {
                console.error(err);
                toast.error('Error loading chatbot.');
            } finally {
                setLoading(false);
            }
        };
        fetchChatbot();
    }, [chatbotId, setNodes, setEdges]);

    const handleSave = async () => {

        try {
            const payload = {
                id: chatbotId,
                name: chatbotData.name || 'My Chatbot Flow',
                type: 'flow',
                nodes: nodes.map(n => ({
                    id: n.id,
                    type: n.data.type,
                    label: n.data.label,
                    description: n.data.description,
                    field: n.data.field,
                    buttons: n.data.buttons || [],
                    position: n.position,
                })),
                edges,
            };
            const response = await patchRequest(`/meta-chatbot/save-changes/${chatbotId}`, payload);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data?.message || 'Chatbot updated!');
                navigate(-1)
            } else {
                toast.error('Update failed.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error saving chatbot.');
        }
    };

    if (loading) return <div className="p-8">Loading chatbot flow...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <DndProvider backend={HTML5Backend}>
                <Sidebar onAddNode={node => {
                    if (!reactFlowInstance || !reactFlowWrapper.current) return;
                    const bounds = reactFlowWrapper.current.getBoundingClientRect();
                    const pos = reactFlowInstance.project({ x: bounds.width / 2, y: bounds.height / 2 });
                    setNodes(nds => [...nds, {
                        id: `${node.type}-${+new Date()}`,
                        type: 'custom',
                        position: pos,
                        data: { label: node.label, description: node.description, type: node.type },
                    }]);
                }} />
                <FlowDropWrapper
                    reactFlowWrapper={reactFlowWrapper}
                    reactFlowInstance={reactFlowInstance}
                    setNodes={setNodes}
                >
                    <div className="relative">
                        <div className='absolute top-4 right-4 z-50'>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 mr-2"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleBack}
                                className="z-50 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                            >
                                Back
                            </button>
                        </div>

                        <div className="px-6 py-4 bg-white shadow">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🧠 Edit Chatbot Flow:</span>
                                <input
                                    type="text"
                                    value={chatbotData?.name || ''}
                                    onChange={(e) => setChatbotData(prev => ({ ...prev, name: e.target.value }))}
                                    className="text-2xl font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>
                    </div>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        nodeTypes={customNodeTypes}
                        fitView
                    >
                        <Background color="#eee" gap={16} />
                        <Controls />
                    </ReactFlow>
                </FlowDropWrapper>
            </DndProvider>
        </div>
    );
};

export default ChatbotFlowViewer;
