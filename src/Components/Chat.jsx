import React, { useEffect, useRef, useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { IoSend } from 'react-icons/io5';

const ChatBox = ({ currentUser, selectedUser }) => {

    const imgs = {
        "1": "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
        "2": "https://cdn-icons-png.flaticon.com/512/1326/1326405.png",
        "3": "https://cdn-icons-png.flaticon.com/512/3940/3940403.png",
        "4": "https://cdn-icons-png.flaticon.com/512/6997/6997674.png",
        "5": "https://cdn-icons-png.flaticon.com/512/236/236832.png",
        "6": "https://cdn-icons-png.flaticon.com/512/1326/1326377.png",
        "7": "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
        "8": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        "9": "https://cdn-icons-png.flaticon.com/512/3940/3940417.png",
    };

    const randomImg = () => {
        const randomKey = (Math.floor(Math.random() * 9) + 1).toString();
        return imgs[randomKey];
    };

    // Example usage:
    const imageUrl = randomImg();
    console.log(imageUrl); // Logs a random image URL from the imgs object

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Unique chat ID based on user IDs (sorted to ensure consistency)
    const chatID = [currentUser.id, selectedUser.id].sort().join("_");

    // Reference for the message container
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, `Chats/${chatID}/Messages`);
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesList);
        });

        return unsubscribe; // Unsubscribe when component unmounts
    }, [chatID]);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const messagesRef = collection(db, `Chats/${chatID}/Messages`);
        await addDoc(messagesRef, {
            senderID: currentUser.id,
            receiverID: selectedUser.id,
            content: newMessage,
            timestamp: serverTimestamp(),
        });

        setNewMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="bg-gray-900 text-white rounded-lg p-4 w-full max-w-md flex flex-col h-[80vh]">
            {/* Chat Header */}
            <div className="flex items-center border-b border-gray-700 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-500 rounded-full">
                        <img src={imageUrl} alt="" /></div>
                    <h3 className="text-lg font-semibold">
                        {selectedUser.name || "Anonymous User"}
                    </h3>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex flex-col space-y-2 h-full overflow-y-auto p-2 bg-gray-800 rounded-lg">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-xs p-2 rounded-lg text-sm shadow-md ${msg.senderID === currentUser.id
                            ? "bg-green-500 text-white self-end rounded-br-none"
                            : "bg-gray-300 text-gray-900 self-start rounded-bl-none"
                            }`}
                    >
                        <p>{msg.content}</p>
                    </div>
                ))}
                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="mt-4 flex items-center bg-gray-700 rounded-lg p-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-green-500 rounded-full text-white hover:bg-green-600"
                >
                    <IoSend size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
