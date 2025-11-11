import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getRequest, postApplicationJsonRequest } from '../../../services/apiServices';
import CreatableSelect from 'react-select/creatable';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateTagForm = ({ onClose, onTagCreated, editTagData }) => {
    const navigate = useNavigate()
    const [tagName, setTagName] = useState('');
    const [tagCategories, setTagCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [customerJourney, setCustomerJourney] = useState(false);
    const [firstMessage, setFirstMessage] = useState(false);

    useEffect(() => {
        if (editTagData) {
            setTagName(editTagData.name || '');
            setCategory({ value: editTagData.category, label: editTagData.category });
            setCustomerJourney(editTagData.customerJourney || false);
            setFirstMessage(editTagData.firstMessage || false);
        }
    }, [editTagData]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: tagName,
            category: category?.value || '',
            customerJourney,
            firstMessage,
        };

        try {
            let response;
            if (editTagData) {
                response = await postApplicationJsonRequest(`/tag/update/${editTagData._id}`, formData);
            } else {
                response = await postApplicationJsonRequest(`/tag/create-new`, formData);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(response.data?.message || (editTagData ? "Tag updated" : "Tag created"));
                onTagCreated();
                onClose();
            }
        } catch (error) {
            console.log("error", error);
            toast.error(error?.response?.data?.message || "Failed to save tag.");
        }
    };


    const getTagCategories = async () => {
        try {
            const response = await getRequest(`/tag/categories`);
            if (response.status === 200) {
                const result = response.data?.categories || [];
                const options = result.map((cat) => ({
                    value: cat,
                    label: cat,
                }));
                setTagCategories(options);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to load tag categories');
        }
    };

    useEffect(() => {
        getTagCategories();
    }, []);

    const goBack = () => {
        onClose()
    }
    return (
        <div>
            <div className="bg-white shadow-md p-4 rounded-md mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3" onClick={goBack}>
                    <button className="text-gray-700 hover:text-black transition">
                        <FaArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Tag</h2>
                </div>
            </div>

            <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-md mt-6">
                <h2 className="text-lg font-medium text-gray-600 mb-4">
                    {editTagData ? 'Edit Tag' : 'Create New'}
                </h2>


                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 mb-1">Tag Name</label>
                        <input
                            type="text"
                            placeholder="Pick something that describes your contact."
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Category</label>
                        <CreatableSelect
                            isClearable
                            placeholder="Select one or create new"
                            value={category}
                            onChange={(selectedOption) => setCategory(selectedOption)}
                            options={tagCategories}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Customer Journey</span>
                        <button
                            type="button"
                            onClick={() => setCustomerJourney((prev) => !prev)}
                            className="text-green-600 text-xl focus:outline-none"
                        >
                            {customerJourney ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">First Message</span>
                        <button
                            type="button"
                            onClick={() => setFirstMessage((prev) => !prev)}
                            className="text-green-600 text-xl focus:outline-none"
                        >
                            {firstMessage ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>

    );
};

export default CreateTagForm;
