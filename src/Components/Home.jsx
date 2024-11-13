
// import React, { useEffect, useState } from 'react';
// import { auth, db } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
// import ChatBox from './Chat';

// const HomePage = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isChatOpen, setIsChatOpen] = useState(false); // Added state to control visibility

//     useEffect(() => {
//         const fetchCurrentUser = () => {
//             onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                     const userDocRef = doc(db, "Users", user.uid);
//                     const userDocSnap = await getDoc(userDocRef);
//                     if (userDocSnap.exists()) {
//                         setCurrentUser({ id: user.uid, ...userDocSnap.data() });
//                     }
//                 }
//             });
//         };

//         fetchCurrentUser();
//     }, []);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             if (currentUser) {
//                 const usersCollection = collection(db, "Users");
//                 const usersSnapshot = await getDocs(usersCollection);
//                 const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//                 // Exclude the current user from the list
//                 const filteredUsers = usersList.filter(user => user.id !== currentUser.id);
                
//                 setUsers(filteredUsers);
//             }
//         };

//         fetchUsers();
//     }, [currentUser]);

//     const handleUserClick = (user) => {
//         setSelectedUser(user);
//         setIsChatOpen(true); // Open chat when a user is selected
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-4">
//             <header className="flex justify-center items-center p-4 bg-gray-800 w-full">
//                 <h2>Welcome, {currentUser?.name || "User"}</h2>
//             </header>

//             {/* Render users only when currentUser is set */}
//             {currentUser && (
//                 <div className="flex flex-wrap justify-center p-4 w-full">
//                     {users.map((user) => (
//                         <div
//                             key={user.id}
//                             className="m-4 p-4 w-64 bg-gray-800 rounded-lg shadow-md cursor-pointer"
//                             onClick={() => handleUserClick(user)} // Open chat on user click
//                         >
//                             <h3 className="text-lg font-semibold text-white">{user.name || "Anonymous User"}</h3>
//                             <p className="text-gray-400">{user.email}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Show ChatBox if a user is selected */}
//             {isChatOpen && selectedUser && currentUser && (
//                 <div className="w-full max-w-4xl p-4">
//                     <ChatBox
//                         currentUser={currentUser}
//                         selectedUser={selectedUser}
//                         setIsChatOpen={setIsChatOpen} // Pass function to close the chatbox
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;


import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, getDoc, doc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import ChatBox from './Chat';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false); // Added state to control visibility
    const [unreadMessages, setUnreadMessages] = useState({}); // Track unread messages for each user

    // Fetch current user details
    useEffect(() => {
        const fetchCurrentUser = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDocRef = doc(db, "Users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setCurrentUser({ id: user.uid, ...userDocSnap.data() });
                    }
                }
            });
        };
        fetchCurrentUser();
    }, []);

    // Fetch all users except the current user
    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser) {
                const usersCollection = collection(db, "Users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const filteredUsers = usersList.filter(user => user.id !== currentUser.id);
                setUsers(filteredUsers);
            }
        };
        fetchUsers();
    }, [currentUser]);

    // Fetch unread message count for each user
    useEffect(() => {
        if (currentUser) {
            users.forEach((user) => {
                const messagesRef = collection(db, `Chats/${[currentUser.id, user.id].sort().join("_")}/Messages`);
                const q = query(messagesRef, where("read", "==", false), orderBy("timestamp", "asc"));
                
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    setUnreadMessages(prevUnreadMessages => ({
                        ...prevUnreadMessages,
                        [user.id]: snapshot.size // Snapshot size gives the number of unread messages
                    }));
                });

                return () => unsubscribe(); // Cleanup subscription on component unmount
            });
        }
    }, [currentUser, users]);

    // Handle user card click to start chat
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsChatOpen(true); // Open chat when a user is selected
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-4">
            <header className="flex justify-center items-center p-4 bg-gray-800 w-full">
                <h2>Welcome, {currentUser?.name || "User"}</h2>
            </header>

            {/* Render users only when currentUser is set */}
            {currentUser && (
                <div className="flex flex-wrap justify-center p-4 w-full">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="m-4 p-4 w-64 bg-gray-800 rounded-lg shadow-md cursor-pointer"
                            onClick={() => handleUserClick(user)} // Open chat on user click
                        >
                            <h3 className="text-lg font-semibold text-white">{user.name || "Anonymous User"}</h3>
                            <p className="text-gray-400">{user.email}</p>

                            {/* Show unread message count if available */}
                            {unreadMessages[user.id] > 0 && (
                                <div className="mt-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                    {unreadMessages[user.id]} unread message{unreadMessages[user.id] > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Show ChatBox if a user is selected */}
            {isChatOpen && selectedUser && currentUser && (
                <div className="w-full max-w-4xl p-4">
                    <ChatBox
                        currentUser={currentUser}
                        selectedUser={selectedUser}
                        setIsChatOpen={setIsChatOpen} // Pass function to close the chatbox
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
