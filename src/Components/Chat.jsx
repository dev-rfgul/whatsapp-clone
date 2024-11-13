// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { db } from './firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
// import { IoSend, IoClose } from 'react-icons/io5';
// import '../CSS/Chatbox.css'; // Import a CSS file for animations

// const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
//     const imgs = {
//         "1": "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
//         "2": "https://cdn-icons-png.flaticon.com/512/1326/1326405.png",
//         "3": "https://cdn-icons-png.flaticon.com/512/3940/3940403.png",
//         "4": "https://cdn-icons-png.flaticon.com/512/6997/6997674.png",
//         "5": "https://cdn-icons-png.flaticon.com/512/236/236832.png",
//         "6": "https://cdn-icons-png.flaticon.com/512/1326/1326377.png",
//         "7": "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
//         "8": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//         "9": "https://cdn-icons-png.flaticon.com/512/3940/3940417.png",
//     };

//     const randomImg = useMemo(() => {
//         const randomKey = (Math.floor(Math.random() * 9) + 1).toString();
//         return imgs[randomKey];
//     }, []);

//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [animateBg, setAnimateBg] = useState(false);

//     const chatID = [currentUser.id, selectedUser.id].sort().join("_");
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         const messagesRef = collection(db, `Chats/${chatID}/Messages`);
//         const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

//         const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//             const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setMessages(messagesList);
//             setAnimateBg(true);
//             setTimeout(() => setAnimateBg(false), 300); // Reset animation after 300ms
//         });

//         return unsubscribe;
//     }, [chatID]);

//     useEffect(() => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [messages]);

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

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             handleSendMessage();
//         }
//     };

//     const handleCloseChat = () => {
//         setIsChatOpen(false);
//     };

//     return (
//         <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-4 w-full max-w-full flex flex-col h-[80vh] sm:h-[90vh] md:h-[80vh] lg:h-[70vh] xl:h-[60vh]">
//             {/* Chat Header */}
//             <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
//                 <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400">
//                         <img src={randomImg} alt="User Avatar" className="object-cover w-full h-full" />
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

//             {/* Messages Container */}
//             <div className={`messages-container flex flex-col space-y-3 h-full overflow-y-auto p-3 rounded-lg shadow-inner mb-4 ${animateBg ? 'bg-animation' : 'bg-gray-800'}`}>
//                 {messages.map((msg) => (
//                     <div
//                         key={msg.id}
//                         className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id
//                             ? "bg-green-500 text-white self-end rounded-br-none"
//                             : "bg-gray-700 text-gray-300 self-start rounded-bl-none"
//                             }`}
//                     >
//                         <p>{msg.content}</p>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef}></div>
//             </div>

//             {/* Message Input */}
//             <div className="mt-4 flex items-center bg-gray-700 rounded-full p-3 shadow-lg">
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
//                     className="ml-2 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-transform transform hover:scale-105"
//                 >
//                     <IoSend size={20} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatBox;

import React, { useEffect, useState, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { IoSend, IoClose } from 'react-icons/io5';
import { Picker } from 'emoji-mart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebounce } from 'use-debounce'; // For search debounce
import '../CSS/Chatbox.css'; // Import a CSS file for animations

const ChatBox = ({ currentUser, selectedUser, setIsChatOpen }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [animateBg, setAnimateBg] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typing, setTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500); // Debounced search query

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

    const randomImg = (Math.floor(Math.random() * 9) + 1).toString();

    const chatID = [currentUser.id, selectedUser.id].sort().join("_");
    const messagesEndRef = useRef(null);

    // Fetch chat messages
    useEffect(() => {
        const messagesRef = collection(db, `Chats/${chatID}/Messages`);
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesList);
            setAnimateBg(true);
            setTimeout(() => setAnimateBg(false), 300);

            // Notify user if a new message is added
            toast.info(`${selectedUser.name} has sent a  message!`);

            // Scroll to the latest message
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        });

        return unsubscribe;
    }, [chatID]);

    // Handle sending message
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

    // Handle typing state
    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
            // Reset typing status after 1 second
            setTimeout(() => setTyping(false), 1000);
        }
    };

    // Handle keydown event
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        } else {
            handleTyping();
        }
    };



    // Handle emoji selection
    const handleEmojiSelect = (emoji) => {
        setNewMessage(newMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    // Handle closing the chat
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };



    return (
        <div className="chat-box bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-4 w-full max-w-4xl flex flex-col h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[70vh] xl:h-[60vh] mx-auto">
            {/* Chat Header */}
            <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full overflow-hidden shadow-lg border-2 border-green-400">
                        <img src={imgs[randomImg]} alt="User Avatar" className="object-cover w-full h-full" />
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



            {/* Messages Container */}
            <div className={`messages-container flex flex-col space-y-3 h-full overflow-y-auto p-3 rounded-lg shadow-inner mb-4 ${animateBg ? 'bg-animation' : 'bg-gray-800'}`}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-xs p-3 rounded-lg text-sm shadow-lg ${msg.senderID === currentUser.id
                            ? "bg-green-500 text-white self-end rounded-br-none"
                            : "bg-gray-700 text-gray-300 self-start rounded-bl-none"
                            }`}
                    >
                        <p>{msg.content}</p>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>




            {/* Show Emoji Picker */}
            {showEmojiPicker && (
                <Picker onSelect={handleEmojiSelect} className="absolute z-50 bottom-20" />
            )}

            {/* Message Input */}
            <div className="flex items-center mt-4">
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
                    className="ml-2 p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
                >
                    <IoSend size={24} />
                </button>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ChatBox;
