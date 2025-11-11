import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WhatsAppButtonLinkGenerator = () => {
    const navigate = useNavigate();
    const handleWhatsButtonGenerator = () => {
        navigate("widget")
    }
    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow mt-10 text-center">
            <h2 className="text-lg font-semibold mb-4">Free WhatsApp Button Link Generator</h2>
            <button
                onClick={handleWhatsButtonGenerator}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
                Generate Link
            </button>
        </div>
    );
};

export default WhatsAppButtonLinkGenerator;
