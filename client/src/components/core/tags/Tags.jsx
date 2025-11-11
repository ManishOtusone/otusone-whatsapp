import React, { useEffect, useState } from 'react';
import { getRequest } from '../../../services/apiServices';
import toast from 'react-hot-toast';
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import CreateTagForm from './CreateTag';

const TagsTable = () => {
    const [tags, setTags] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editTagData, setEditTagData] = useState(null);

    const fetchTags = async () => {
        try {
            const response = await getRequest(`/tag/all`);
            if (response.status === 200) {
                setTags(response.data?.tags || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load tags');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleCreateTag = () => {
        setEditTagData(null);
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditTagData(null);
    };


    return (
        <div className="p-4 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tags..."
                            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        Quick Guide
                    </button>
                </div>

                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    onClick={handleCreateTag}
                >
                    <FaPlus /> Create Tag
                </button>
            </div>

            {/* Tag Table */}
            <div className="bg-white rounded-md shadow-sm mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Tag Name</th>
                            <th className="py-3 px-4 font-medium">Category</th>
                            <th className="py-3 px-4 font-medium">Customer Journey</th>
                            <th className="py-3 px-4 font-medium">First Message</th>
                            <th className="py-3 px-4 font-medium">Created At</th>
                            <th className="py-3 px-4 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-400 py-6">
                                    No tags found.
                                </td>
                            </tr>
                        ) : (
                            tags.map((tag, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="py-3 px-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tag.status}
                                                onChange={() => { }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full relative transition duration-300">
                                                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition transform duration-300"></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className="text-xs font-medium px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: tag.displayColor.light,
                                                color: tag.displayColor.main,
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4 capitalize">{tag.category || '-'}</td>
                                    <td className="py-3 px-4">{tag.customerJourney ? 'Yes' : '-'}</td>
                                    <td className="py-3 px-4">{tag.firstMessage ? 'Yes' : '-'}</td>
                                    <td className="py-3 px-4">{new Date(tag.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 flex gap-3 justify-center text-gray-600">
                                        <button title="View">
                                            <FaEye className="hover:text-blue-600" />
                                        </button>
                                        <button
                                            title="Edit"
                                            onClick={() => {
                                                setEditTagData(tag);
                                                setShowCreateModal(true);
                                            }}
                                        >
                                            <FaEdit className="hover:text-yellow-500" />
                                        </button>

                                        <button title="Delete">
                                            <FaTrash className="hover:text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-xl relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ×
                        </button>
                        <CreateTagForm
                            onClose={handleCloseModal}
                            onTagCreated={fetchTags}
                            editTagData={editTagData}
                        />

                    </div>
                </div>
            )}
        </div>
    );
};

export default TagsTable;
