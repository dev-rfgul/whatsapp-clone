
// import React, { useEffect, useState, useRef } from 'react';
// import { db } from './firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
// import { IoSend, IoClose } from 'react-icons/io5';
// import '../CSS/Chatbox.css';

// const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [animateBg, setAnimateBg] = useState(false);
//     const chatID = [currentUser.id, selectedUser.id].sort().join("_");
//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null); // Reference for the input field

//     // Focus on the input field when the chat is opened
//     useEffect(() => {
//         if (inputRef.current) inputRef.current.focus();
//     }, []);

//     // Listen for messages in real-time
//     useEffect(() => {
//         const messagesRef = collection(db, `Chats/${chatID}/Messages`);
//         const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"), limit(50));

//         const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//             const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setMessages(messagesList);
//             setAnimateBg(true);
//             setTimeout(() => setAnimateBg(false), 300);


//         });

//         return unsubscribe;
//     }, [chatID]);

//     // Handle message sending
//     const handleSendMessage = async () => {
//         if (newMessage.trim() === "") return;

//         const messagesRef = collection(db, `Chats/${chatID}/Messages`);
//         await addDoc(messagesRef, {
//             senderID: currentUser.id,
//             receiverID: selectedUser.id,
//             content: newMessage,
//             timestamp: serverTimestamp(),
//         });

//         setNewMessage("");
//     };


//     // Handle enter key for sending messages
//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             handleSendMessage();
//         }
//     };


//     // Handle closing the chat`
//     const handleCloseChat = () => {
//         setIsChatOpen(false);
//     };

//     // Fallback default image
//     const getImage = (user) => {
//         return user.image || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'; // Use default image if URL is not available
//     };

//     const clog = () => {
//         console.log(
//             "🚀 ~ file: Chat.jsx ~ line 113 ~ ChatBox ~ getImage ~ getImage(selectedUser)",
//             getImage(selectedUser)
//         )
//     }

//     return (
//         <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-4 w-full max-w-4xl flex flex-col h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[70vh] xl:h-[60vh] mx-auto">
//             <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400">
//                         <img src={getImage(selectedUser)} alt="User Avatar" className="object-cover w-full h-full" />
//                     </div>
//                     <h3 className="text-lg font-semibold sm:text-xl text-green-400">
//                         {selectedUser.name || "Anonymous User"}
//                     </h3>
//                 </div>
//                 <button
//                     onClick={handleCloseChat}
//                     className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
//                 >
//                     <IoClose size={22} />
//                 </button>
//             </div>

//             <div className={`messages-container flex flex-col space-y-3 h-full overflow-y-auto p-3 rounded-lg shadow-inner mb-4 ${animateBg ? 'bg-animation' : 'bg-gray-800'}`}>
//                 {messages.map((msg) => (
//                     <div
//                         key={msg.id}
//                         className={`flex items-center ${msg.senderID === currentUser.id ? 'justify-end' : 'justify-start'}`}
//                     >
//                         {/* Conditionally render avatar on the left for receiver, on the right for sender */}
//                         {msg.senderID !== currentUser.id && (
//                             <img
//                                 src={getImage(selectedUser)}
//                                 alt="Sender Avatar"
//                                 className="w-8 h-8 rounded-full mr-2 shadow-lg"
//                             />
//                         )}

//                         <div
//                             className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id
//                                 ? 'bg-green-500 text-white rounded-br-none'
//                                 : 'bg-gray-700 text-gray-300 rounded-bl-none'
//                                 }`}
//                         >
//                             <p>{msg.content}</p>
//                             {msg.time.toLocaleTimeString()}
//                         </div>

//                         {msg.senderID === currentUser.id && (
//                             <img
//                                 src={getImage(currentUser)}
//                                 alt="Receiver Avatar"
//                                 className="w-8 h-8 rounded-full ml-2 shadow-lg"
//                             />
//                         )}
//                     </div>

//                 ))}
//                 <div ref={messagesEndRef}></div>
//             </div>

//             <div className="flex items-center mt-4">
//                 <input
//                     onClick={clog}
//                     ref={inputRef}
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Type a message..."
//                     className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
//                 />
//                 <button
//                     onClick={handleSendMessage}
//                     className="ml-2 p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
//                 >
//                     <IoSend size={24} />
//                 </button>

//             </div>
//         </div>
//     );
// };

// export default ChatBox;


import React, { useEffect, useState, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { IoSend, IoClose } from 'react-icons/io5';
import '../CSS/Chatbox.css';

const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [animateBg, setAnimateBg] = useState(false);
    const chatID = [currentUser.id, selectedUser.id].sort().join("_");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null); // Reference for the input field

    // Focus on the input field when the chat is opened
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // Listen for messages in real-time
    useEffect(() => {
        const messagesRef = collection(db, `Chats/${chatID}/Messages`);
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"), limit(50));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesList);
            setAnimateBg(true);
            setTimeout(() => setAnimateBg(false), 300);
        });

        return unsubscribe;
    }, [chatID]);

    // Handle message sending
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

    // Handle enter key for sending messages
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // Handle closing the chat
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    // Fallback default image
    const getImage = (user) => {
        return user.image || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'; // Use default image if URL is not available
    };

    return (
        <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-2xl p-6 w-full max-w-4xl flex flex-col h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[70vh] xl:h-[60vh] mx-auto transition-all duration-300 ease-in-out">
            <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400 transform transition-all hover:scale-110">
                        <img src={getImage(selectedUser)} alt="User Avatar" className="object-cover w-full h-full" />
                    </div>
                    <h3 className="text-lg font-semibold sm:text-xl text-green-400">{selectedUser.name || "Anonymous User"}</h3>
                </div>
                <button
                    onClick={handleCloseChat}
                    className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                    <IoClose size={24} />
                </button>
            </div>

            <div className={`messages-container flex flex-col space-y-3 h-full overflow-y-auto p-3 rounded-lg shadow-inner mb-4 ${animateBg ? 'bg-animation' : 'bg-gray-800'}`}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-center ${msg.senderID === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        {/* Conditionally render avatar on the left for receiver, on the right for sender */}
                        {msg.senderID !== currentUser.id && (
                            <img
                                src={getImage(selectedUser)}
                                alt="Sender Avatar"
                                className="w-8 h-8 rounded-full mr-2 shadow-lg hover:scale-105 transition-transform duration-200"
                            />
                        )}

                        <div className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id ? 'bg-green-800 text-white rounded-br-none' : 'bg-gray-700 text-gray-300 '}`}>
                            <p>{msg.content}</p>
                            <span className="text-xs text-gray-400">{new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString()}</span>
                        </div>

                        {msg.senderID === currentUser.id && (
                            <img
                                src={getImage(currentUser)}
                                alt="Receiver Avatar"
                                className="w-8 h-8 rounded-full ml-2 shadow-lg hover:scale-105 transition-transform duration-200"
                            />
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="flex items-center mt-4 space-x-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none rounded-full transition-all duration-200 hover:bg-gray-600"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-3 bg-green-500 hover:bg-green-600 rounded-full text-white transition-all duration-200"
                >
                    <IoSend size={24} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
