import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { postApplicationJsonRequest } from '../../services/apiServices';
import { QRCodeCanvas } from 'qrcode.react';

const WhatsAppLinkGenerator = () => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);
 const [showResult, setShowResult] = useState(false);
    const generateLink = async () => {
        // const encodedMessage = encodeURIComponent(message);
        try {
            const payload = {
                phone, message
            }
            const response = await postApplicationJsonRequest(`/wa-link/create-wa-link`, payload);
            if (response.status === 201) {
                const link = response.data.shortLink
                setGeneratedLink(link);
                setCopied(false);
                setShowResult(true);
            }
        } catch (error) {
            toast.error("We are unable to generate the link right now. Please try again after some time")
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
    };

    const downloadQRCode = () => {
        const svg = document.getElementById("qrcode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "whatsapp-qr.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };


    const closeResult = () => {
        setGeneratedLink('');
        setShowResult(false);
        setCopied(false);
    };
    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow mt-10 text-center">
            <h2 className="text-lg font-semibold mb-4">Free WhatsApp Link Generator</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter WhatsApp number (e.g., 919876543210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            <div className="mb-4">
                <textarea
                    placeholder="Custom message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            <button
                onClick={generateLink}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
                Generate Link
            </button>

            {showResult && generatedLink && (
                <div className="mt-6 p-4 border rounded shadow-md bg-gray-50">
                    <p className="text-md font-semibold mb-2">Here is your WhatsApp short link</p>
                    <a
                        href={generatedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline"
                    >
                        {generatedLink}
                    </a>

                    <div className="mt-4 flex justify-center">
                
                        <div className="flex justify-center">
                            <QRCodeCanvas value={generatedLink} size={100} />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>

                        <button
                            onClick={downloadQRCode}
                            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Download QR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppLinkGenerator;
