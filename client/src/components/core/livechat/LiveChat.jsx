import { useEffect, useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

import io from 'socket.io-client';
import { getRequest, postApplicationJsonRequest } from '../../../services/apiServices';
import moment from 'moment';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'https://otusone-whatsapp.onrender.com');
// const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000');

const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
        const date = moment(msg.createdAt).format('YYYY-MM-DD');
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});
};

const getDateLabel = (date) => {
    const today = moment().startOf('day');
    const msgDate = moment(date);
    if (msgDate.isSame(today, 'day')) return 'Today';
    if (msgDate.isSame(today.clone().subtract(1, 'day'), 'day')) return 'Yesterday';
    return msgDate.format('DD MMM YYYY');
};

// Helper to check if current message is consecutive inbound (within 5 minutes) of previous message
const isConsecutiveInbound = (msgs, idx) => {
    if (idx === 0) return false;
    const prevMsg = msgs[idx - 1];
    const currentMsg = msgs[idx];
    return (
        currentMsg.direction === 'inbound' &&
        prevMsg.direction === 'inbound' &&
        moment(currentMsg.createdAt).diff(moment(prevMsg.createdAt), 'minutes') < 5
    );
};


const LiveChat = ({ contactId }) => {
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const contactIdRef = useRef(contactId);
    const setMessagesRef = useRef(setMessages);
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        contactIdRef.current = contactId;
    }, [contactId]);

    useEffect(() => {
        setMessagesRef.current = setMessages;
    }, [setMessages]);

    useEffect(() => {
        const handleNewMessage = (message) => {
            if (String(message.contactId) === String(contactIdRef.current)) {
                setMessagesRef.current((prev) => [...prev, message]);
            }
        };

        const handleTyping = (data) => {
            if (data.contactId === contactIdRef.current) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('typing', handleTyping);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('typing', handleTyping);
        };
    }, []);

    useEffect(() => {
        if (!contactId) return;

        fetchMessages();
        socket.emit('join_room', contactId);

        return () => {
            socket.emit('leave_room', contactId);
        };
    }, [contactId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const fetchMessages = async () => {
        try {
            const response = await getRequest(`/livechat/messages/${contactId}`);
            if (response.status === 200) {
                const result = response.data?.messages || [];
                setMessages(result);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            setLoading(true)
            const response = await postApplicationJsonRequest('/livechat/send-message', {
                contactId,
                message: newMessage,
            });
            if (response.status === 200) {
                setNewMessage('');
            }
        } catch (error) {
            console.error('Failed to send message', error);
        } finally {
            setLoading(false)
        }
    };

    const handleTyping = () => {
        socket.emit('typing', { contactId });
    };

    const grouped = groupMessagesByDate(messages);

    const handleButtonClick = async (payload) => {
        console.log("payload", payload)
        if (!payload) return;

        const response = await postApplicationJsonRequest('/livechat/send-message', {
            contactId,
            message: payload,
        });

        if (response.status === 200) {
            setNewMessage('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#e5ddd5] bg-opacity-30">
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                {Object.entries(grouped).map(([date, msgs]) => (
                    <div key={date} className="space-y-1">
                        <div className="text-center text-xs text-gray-500 my-2">
                            {getDateLabel(date)}
                        </div>
                        {msgs.map((msg, idx) => {
                            const isInbound = msg.direction === 'inbound';
                            const isSameSenderPrevious = idx > 0 && msgs[idx - 1].direction === msg.direction;
                            const isSameSenderNext = idx < msgs.length - 1 && msgs[idx + 1].direction === msg.direction;

                            return (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`text-sm max-w-[70%] break-words p-2 px-3 relative
                  ${isInbound ? 'bg-white' : 'bg-[#dcf8c6]'}
                  rounded-lg
                  ${isSameSenderPrevious ? 'mt-0.5' : 'mt-2'}
                  ${isSameSenderPrevious && isInbound ? 'rounded-tl-none' : ''}
                  ${isSameSenderPrevious && !isInbound ? 'rounded-tr-none' : ''}
                  ${isSameSenderNext && isInbound ? 'rounded-bl-none' : ''}
                  ${isSameSenderNext && !isInbound ? 'rounded-br-none' : ''}
                `}
                                    >
                                        <div>{msg.message}</div>

                                        {msg.interactiveType && Array.isArray(msg.interactivePayload) && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {msg.interactivePayload.map((btn, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleButtonClick(btn.payload || btn.reply?.id || btn.title)}
                                                        className="bg-[#128C7E] hover:bg-[#075e54] text-white text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {btn.title || btn.text || btn.reply?.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div
                                            className={`text-[10px] mt-0.5 flex justify-end items-center space-x-1 ${isInbound ? 'text-gray-500' : 'text-gray-600'
                                                }`}
                                        >
                                            <span>{moment(msg.createdAt).format('h:mm A')}</span>
                                            {!isInbound && (
                                                <span className={`inline-flex items-center ${msg.status === 'read' ? 'text-blue-500' : 'text-gray-500'}`}>
                                                    {msg.status === 'sent' ? (
                                                        <span>✓</span>
                                                    ) : msg.status === 'delivered' ? (
                                                        <span className="flex">
                                                            <span>✓</span>
                                                            <span className="-ml-0.5">✓</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex text-blue-500">
                                                            <span>✓</span>
                                                            <span className="-ml-0.5">✓</span>
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[70%]">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="p-3 border-t flex items-center bg-white relative">
                <button className="mx-2 text-gray-500" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button className="mr-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                {showEmojiPicker && (
                    <div className="absolute bottom-16 left-3 z-10">
                        <EmojiPicker
                            onEmojiClick={(emojiObject) => {
                                setNewMessage((prev) => prev + emojiObject.emoji);
                                setShowEmojiPicker(false);
                            }}

                            theme="light"
                        />
                    </div>
                )}


                <input
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!isLoading && newMessage.trim()) {
                                sendMessage();
                            }
                        }
                    }}
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                    placeholder="Type a message"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-[#075e54] text-white p-2 rounded-full hover:bg-[#0b7a6e]"
                    disabled={isLoading || !newMessage.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LiveChat;
