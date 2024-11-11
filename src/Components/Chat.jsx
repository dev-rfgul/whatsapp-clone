import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const ChatBox = ({ currentUser, selectedUser }) => {
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

    return (
        <div className="bg-gray-800 text-white rounded-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
                Chat with {selectedUser.name || "Anonymous User"}
            </h3>
            <div className="flex flex-col space-y-2 h-64 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                {messages.map((msg) => (
                    <div key={msg.id} className={`p-2 rounded-lg ${msg.senderID === currentUser.id ? "bg-blue-600 text-right" : "bg-gray-700 text-left"}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-l-lg bg-gray-700 focus:outline-none"
                />
                <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-600 rounded-r-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
