// import React, { useState, useEffect } from 'react';
// import { Handle } from 'reactflow';
// import { FiMoreVertical } from 'react-icons/fi';
// import NodeConfigModal from './NodeConfigModal';

// const nodeTypeColors = {
//     sendMessage: 'bg-[#e95c69]',
//     askQuestion: 'bg-[#ff9933]',
//     setCondition: 'bg-[#6d7ed6]',

//     subscribe: 'bg-[#efa244]',
//     updateAttribute: 'bg-[#c5572c]',
//     setTags: 'bg-[#ecdc46]',
//     assignUser: 'bg-[#55dc87]',
//     template: 'bg-[#d897ff]',
//     triggerChatbot: 'bg-[#2f91e8]',
//     aiAssist: 'bg-[#2f91e8]',
//     assignTeam: 'bg-[#ff9933]',
//     unsubscribe: 'bg-[#efa244]',
// };

// const CustomNode = ({ data, id, onEditNode, onDeleteNode }) => {
//     const [showConfig, setShowConfig] = useState(false);
//     const handleEdit = () => setShowConfig(true);

//     const [editing, setEditing] = useState(false);
//     const [description, setDescription] = useState(data.description || '');

//     const colorClass = nodeTypeColors[data.type] || 'bg-gray-300';

//     useEffect(() => {
//         setDescription(data.description || '');
//     }, [data.description]);

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') handleBlur();
//     };


//     const handleCopy = () => {
//         console.log('Copy node', id);
//     };

//     const handleBlur = () => {
//         setEditing(false);
//         const updatedNode = {
//             id,
//             data: {
//                 ...data,
//                 description,
//             },
//         };
//         onEditNode?.(updatedNode);
//     };

//     const handleDelete = () => {
//         onDeleteNode?.(id); 
//     };

//     useEffect(() => {
//         console.log('Render CustomNode', id, { showConfig });
//     }, [showConfig]);

//     return (
//         <div className="relative w-72 rounded-xl border border-gray-300 shadow-md overflow-hidden bg-white">
//             <div className={`flex justify-between items-center px-4 py-2 text-white ${colorClass}`}>
//                 <div className="font-semibold text-sm">{data.label}</div>
//                 <div className="relative group">
//                     <button className="p-1 hover:bg-white/10 rounded">
//                         <FiMoreVertical size={16} />
//                     </button>
//                     <div className="absolute right-0 top-0 hidden group-hover:block bg-white text-gray-700 shadow-lg rounded-md text-sm z-10">
//                         <button onClick={handleEdit} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
//                         <button onClick={handleCopy} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Copy</button>
//                         <button onClick={handleDelete} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500">Delete</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Body */}
//             <div className="px-4 py-3">
//                 {editing ? (
//                     <textarea
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         onBlur={handleBlur}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 text-sm border rounded-md focus:outline-none resize-none overflow-hidden"
//                         placeholder="Step details"
//                         autoFocus
//                         rows={1}
//                         style={{ minHeight: '40px' }}
//                         onInput={(e) => {
//                             e.target.style.height = 'auto';
//                             e.target.style.height = e.target.scrollHeight + 'px';
//                         }}
//                     />
//                 ) : (
//                     <div
//                         className="text-sm text-gray-800 whitespace-pre-wrap min-h-[40px] cursor-text"
//                         onClick={() => setEditing(true)}
//                     >
//                         {description || <span className="text-gray-400">Click to add details...</span>}
//                     </div>
//                 )}

//                 {Array.isArray(data?.buttons) && data.buttons.length > 0 && (
//                     <div className="mt-2 space-y-1">
//                         {data.buttons.map((btn, idx) => (
//                             <div key={idx} className="w-full">
//                                 <button
//                                     className="w-full text-left bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm"
//                                     onClick={() => alert(`Simulate click: ${btn.payload}`)}
//                                 >
//                                     {btn.title}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//             </div>

//             <Handle
//                 type="target"
//                 position="top"
//                 className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !rounded-full cursor-pointer z-20"
//                 style={{ top: -8 }}
//             />
//             <Handle
//                 type="source"
//                 position="bottom"
//                 className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !rounded-full cursor-pointer z-20"
//                 style={{ bottom: -8 }}
//             />

             
//             {showConfig && (
//                 <NodeConfigModal
//                     node={{ id, data }}
//                     onSave={(updatedNode) => {
//                         onEditNode?.(updatedNode); // update in parent
//                         setDescription(updatedNode.data.description || '');
//                     }}
//                     onClose={() => setShowConfig(false)}
//                 />

//             )}


//         </div>
//     );
// };

// export default CustomNode;




import React, { useState, useEffect } from 'react';
import { Handle, useReactFlow } from 'reactflow';
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

const CustomNode = ({ id, data, onEditNode, onDeleteNode }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(data.description || '');

  const { getEdges, getNodes } = useReactFlow();

  const colorClass = nodeTypeColors[data.type] || 'bg-gray-300';

  useEffect(() => {
    setDescription(data.description || '');
  }, [data.description]);

  const getNextNodes = () => {
    const edges = getEdges();
    const nodes = getNodes();
    const connectedIds = edges.filter(e => e.source === id).map(e => e.target);
    return nodes.filter(n => connectedIds.includes(n.id));
  };

  const handleBlur = () => {
    setEditing(false);
    onEditNode?.({
      id,
      data: {
        ...data,
        description,
      },
    });
  };

  return (
    <div className="relative w-72 rounded-xl border border-gray-300 shadow-md bg-white">
      {/* Header */}
      <div className={`flex justify-between items-center px-4 py-2 text-white ${colorClass}`}>
        <div className="font-semibold text-sm">{data.label}</div>
        <div className="relative group">
          <button className="p-1 hover:bg-white/10 rounded">
            <FiMoreVertical size={16} />
          </button>
          <div className="absolute right-0 top-0 hidden group-hover:block bg-white text-gray-700 shadow-lg rounded-md text-sm z-10">
            <button onClick={() => setShowConfig(true)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
            <button onClick={() => onDeleteNode?.(id)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500">Delete</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {editing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="w-full p-2 text-sm border rounded-md resize-none overflow-hidden focus:outline-none"
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

        {/* Show buttons */}
        {Array.isArray(data.buttons) && data.buttons.length > 0 && (
          <div className="mt-2 space-y-1">
            {data.buttons.map((btn, idx) => (
              <div key={idx}>
                <button
                  className="w-full text-left bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  onClick={() => alert(`Simulate: ${btn.payload}`)}
                >
                  {btn.title}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Show connected node IDs dynamically */}
        <div className="mt-3 text-xs text-gray-500">
          <strong>Next Nodes:</strong>
          {getNextNodes().length > 0 ? (
            <ul className="list-disc list-inside">
              {getNextNodes().map((n) => (
                <li key={n.id}>{n.data.label || n.id}</li>
              ))}
            </ul>
          ) : (
            <div>None</div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position="top" className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !rounded-full z-20" style={{ top: -8 }} />
      <Handle type="source" position="bottom" className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !rounded-full z-20" style={{ bottom: -8 }} />

      {/* Modal */}
      {showConfig && (
        <NodeConfigModal
          node={{ id, data }}
          onSave={(updatedNode) => {
            onEditNode?.(updatedNode);
            setDescription(updatedNode.data.description || '');
            setShowConfig(false);
          }}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default CustomNode;
