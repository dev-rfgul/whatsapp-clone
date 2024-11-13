// import React, { useEffect, useState } from 'react';
// import { auth, db } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
// import ChatBox from './Chat';

// const HomePage = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);

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
//     }, [currentUser]); // Only fetch users when currentUser is set

//     return (
//         <div className="min-h-screen bg-gray-900 text-white">
//             <header className="flex justify-end items-center p-4 bg-gray-800">
//                 <h2>Welcome, {currentUser?.name || "User"}</h2>
//             </header>

//             {/* Render users only when currentUser is set */}
//             {currentUser && (
//                 <div className="flex flex-wrap justify-center p-4">
//                     {users.map((user) => (
//                         <div
//                             key={user.id}
//                             className="m-4 p-4 w-64 bg-gray-800 rounded-lg shadow-md cursor-pointer"
//                             onClick={() => setSelectedUser(user)}
//                         >
//                             <h3 className="text-lg font-semibold text-white">{user.name || "Anonymous User"}</h3>
//                             <p className="text-gray-400">{user.email}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Show ChatBox if a user is selected */}
//             {selectedUser && currentUser && (
//                 <div className="fixed bottom-0 right-0 m-4 w-full max-w-md">
//                     <ChatBox currentUser={currentUser} selectedUser={selectedUser} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;


import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
import ChatBox from './Chat';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);  // New state to track chat visibility

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

    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser) {
                const usersCollection = collection(db, "Users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Exclude the current user from the list
                const filteredUsers = usersList.filter(user => user.id !== currentUser.id);
                
                setUsers(filteredUsers);
            }
        };

        fetchUsers();
    }, [currentUser]); // Only fetch users when currentUser is set

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="flex justify-end items-center p-4 bg-gray-800">
                <h2>Welcome, {currentUser?.name || "User"}</h2>
            </header>

            {/* Render users only when currentUser is set */}
            {currentUser && (
                <div className="flex flex-wrap justify-center p-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="m-4 p-4 w-64 bg-gray-800 rounded-lg shadow-md cursor-pointer"
                            onClick={() => {
                                setSelectedUser(user);
                                setIsChatOpen(true);  // Open the chat when a user is selected
                            }}
                        >
                            <h3 className="text-lg font-semibold text-white">{user.name || "Anonymous User"}</h3>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Show ChatBox if a user is selected */}
            {isChatOpen && selectedUser && currentUser && (
                <div className="fixed bottom-0 right-0 m-4 w-full max-w-md">
                    <ChatBox
                        currentUser={currentUser}
                        selectedUser={selectedUser}
                        setIsChatOpen={setIsChatOpen}  // Pass setIsChatOpen to ChatBox
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
