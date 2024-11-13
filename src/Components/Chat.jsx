// import React, { useEffect, useState, useRef } from 'react';
// import { db } from './firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
// import { IoSend, IoClose } from 'react-icons/io5';
// import '../CSS/Chatbox.css';

// const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [animateBg, setAnimateBg] = useState(false);
//     const [typing, setTyping] = useState(false);

//     const imgs = {
//         "user1": "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
//         "user2": "https://cdn-icons-png.flaticon.com/512/1326/1326405.png",
//     };

//     const chatID = [currentUser.id, selectedUser.id].sort().join("_");
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         const messagesRef = collection(db, `Chats/${chatID}/Messages`);
//         const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

//         const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//             const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setMessages(messagesList);
//             setAnimateBg(true);
//             setTimeout(() => setAnimateBg(false), 300);

//             toast.info(`${selectedUser.name} has sent a message!`);
//             if (messagesEndRef.current) {
//                 messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//             }
//         });

//         return unsubscribe;
//     }, [chatID]);

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

//     const handleTyping = () => {
//         if (!typing) {
//             setTyping(true);
//             setTimeout(() => setTyping(false), 1000);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             handleSendMessage();
//         } else {
//             handleTyping();
//         }
//     };

//     const handleEmojiSelect = (emoji) => {
//         setNewMessage(newMessage + emoji.native);
//         setShowEmojiPicker(false);
//     };

//     const handleCloseChat = () => {
//         setIsChatOpen(false);
//     };

//     return (
//         <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-4 w-full max-w-4xl flex flex-col h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[70vh] xl:h-[60vh] mx-auto">
//             <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400">
//                         <img src={imgs[selectedUser.id] || imgs["user1"]} alt="User Avatar" className="object-cover w-full h-full" />
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
//                         className={`flex items-center ${msg.senderID === currentUser.id ? 'self-end' : 'self-start'}`}
//                     >
//                         <img
//                             src={user.image}
//                             alt="Sender Avatar"
//                             className="w-8 h-8 rounded-full mr-2"
//                         />
//                         <div className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id
//                             ? "bg-green-500 text-white rounded-br-none"
//                             : "bg-gray-700 text-gray-300 rounded-bl-none"
//                             }`}
//                         >

//                             <p>{msg.content}</p>
//                         </div>

//                     </div>
//                 ))}
//                 <div ref={messagesEndRef}></div>
//             </div>

//             <div className="flex items-center mt-4">
//                 <input
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebounce } from 'use-debounce';
import { Picker } from 'emoji-mart';
import '../CSS/Chatbox.css';

const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [animateBg, setAnimateBg] = useState(false);
    const [typing, setTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

            toast.info(`${selectedUser.name} has sent a message!`);
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
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

    // Handle typing indicator
    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
            setTimeout(() => setTyping(false), 1000);
        }
    };

    // Handle enter key for sending messages
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        } else {
            handleTyping();
        }
    };

    // Handle emoji select
    const handleEmojiSelect = (emoji) => {
        setNewMessage(newMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    // Handle closing the chat
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    // Fallback default image
    const getImage = (user) => {
        return user.image || 'default-avatar.png'; // Use default image if URL is not available
    };

    const clog = () => {
        console.log(
            "🚀 ~ file: Chat.jsx ~ line 113 ~ ChatBox ~ getImage ~ getImage(selectedUser)",
            getImage(selectedUser)
        )
    }

    return (
        <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-4 w-full max-w-4xl flex flex-col h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[70vh] xl:h-[60vh] mx-auto">
            <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400">
                        <img src={getImage(selectedUser)} alt="User Avatar" className="object-cover w-full h-full" />
                    </div>
                    <h3 className="text-lg font-semibold sm:text-xl text-green-400">
                        {selectedUser.name || "Anonymous User"}
                    </h3>
                </div>
                <button
                    onClick={handleCloseChat}
                    className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                    <IoClose size={22} />
                </button>
            </div>

            <div className={`messages-container flex flex-col space-y-3 h-full overflow-y-auto p-3 rounded-lg shadow-inner mb-4 ${animateBg ? 'bg-animation' : 'bg-gray-800'}`}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-center ${msg.senderID === currentUser.id ? 'self-end' : 'self-start'}`}
                    >
                        <img
                            src={getImage(msg.senderID === currentUser.id ? currentUser : selectedUser)}
                            alt="Sender Avatar"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id
                            ? "bg-green-500 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-300 rounded-bl-none"
                            }`}
                        >
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="flex items-center mt-4">
                <input
                    onClick={clog}
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
                >
                    <IoSend size={24} />
                </button>

            </div>
        </div>
    );
};

export default ChatBox;
