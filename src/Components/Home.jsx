

// import React, { useEffect, useState } from 'react';
// import { auth, db, storage } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getDocs, getDoc, doc, collection, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import ChatBox from './Chat';

// const HomePage = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [unreadMessages, setUnreadMessages] = useState({});
//     const [isUploading, setIsUploading] = useState(false);

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
//                 const filteredUsers = usersList.filter(user => user.id !== currentUser.id);
//                 setUsers(filteredUsers);
//             }
//         };
//         fetchUsers();
//     }, [currentUser]);

//     const handleUserClick = (user) => {
//         if (user) {
//             setSelectedUser(user);
//             setIsChatOpen(true);
//         }
//     };

//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (file && currentUser) {
//             setIsUploading(true);
//             const imageRef = ref(storage, `profilePictures/${currentUser.id}`);
//             await uploadBytes(imageRef, file);
//             const imageUrl = await getDownloadURL(imageRef);
            
//             const userDocRef = doc(db, "Users", currentUser.id);
//             await updateDoc(userDocRef, { profileImage: imageUrl });
//             setCurrentUser(prev => ({ ...prev, profileImage: imageUrl }));
//             setIsUploading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center justify-start py-8">
            
//             {/* Header Section */}
//             <header className="flex justify-between items-center p-6 w-full bg-indigo-800 rounded-b-2xl shadow-xl">
//                 <h2 className="text-2xl font-bold text-lime-500">Welcome, {currentUser?.name || "User"}</h2>
//                 <div className="flex items-center space-x-4">
//                     <img
//                         src={currentUser?.profileImage || "https://via.placeholder.com/150"}
//                         alt="Profile"
//                         className="w-16 h-16 rounded-full object-cover cursor-pointer transition-transform transform hover:scale-110"
//                         onClick={() => document.getElementById('profile-image-input').click()}
//                     />
//                     {isUploading && <p className="text-orange-500 text-sm">Uploading...</p>}
//                 </div>
//             </header>

//             {/* User Profile Picture Upload */}
//             <input
//                 id="profile-image-input"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//             />

//             {/* User Cards Section */}
//             <div className="flex flex-wrap justify-center p-4 w-full space-x-4">
//                 {users.map((user) => (
//                     <div
//                         key={user.id}
//                         className="m-4 p-6 w-64 bg-blue-800 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
//                         onClick={() => handleUserClick(user)}
//                     >
//                         <div className="flex items-center mb-">
//                             <img
//                                 src={user.profileImage || "https://via.placeholder.com/150"}
//                                 alt={user.name}
//                                 className="w-12 h-12 rounded-full object-cover "
//                             />
//                             <div>
//                                 <h3 className="text-lg font-semibold text-white">{user.name || "Anonymous User"}</h3>
//                                 <p className="text-sm text-lime-300 truncate ">{user.email}</p>
//                             </div>
//                         </div>
//                         {/* Show unread message count if available */}
//                         {unreadMessages[user.id] > 0 && (
//                             <div className="mt-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                                 {unreadMessages[user.id]} unread message{unreadMessages[user.id] > 1 ? 's' : ''}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Chat Box Section */}
//             {isChatOpen && selectedUser && currentUser && (
//                 <div className="w-full max-w-4xl p-4 mt-6 bg-gray-800 rounded-lg shadow-xl">
//                     <ChatBox
//                         currentUser={currentUser}
//                         selectedUser={selectedUser}
//                         setIsChatOpen={setIsChatOpen}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;

import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ChatBox from './Chat';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [isUploading, setIsUploading] = useState(false);

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
                const filteredUsers = usersList.filter(user => user.id !== currentUser.id);
                setUsers(filteredUsers);
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleUserClick = (user) => {
        if (user) {
            setSelectedUser(user);
            setIsChatOpen(true);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && currentUser) {
            setIsUploading(true);
            const imageRef = ref(storage, `profilePictures/${currentUser.id}`);
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);
            
            const userDocRef = doc(db, "Users", currentUser.id);
            await updateDoc(userDocRef, { profileImage: imageUrl });
            setCurrentUser(prev => ({ ...prev, profileImage: imageUrl }));
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-900 to-green-800 text-off-white flex flex-col items-center justify-start py-8">
            
            <header className="flex justify-between items-center p-6 w-full bg-teal-800 rounded-b-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-off-white">Welcome, {currentUser?.name || "User"}</h2>
                <div className="flex items-center space-x-4">
                    <img
                        src={currentUser?.image || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => document.getElementById('profile-image-input').click()}
                    />
                    {isUploading && <p className="text-gray-400 text-sm">Uploading...</p>}
                </div>
            </header>

            <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />

            <div className="flex flex-wrap justify-center p-4 w-full space-x-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="m-4 p-6 w-64 bg-coral-500 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handleUserClick(user)}
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={user.profileImage || "https://via.placeholder.com/150"}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-off-white">{user.name || "Anonymous User"}</h3>
                                <p className="text-sm text-sky-400">{user.email}</p>
                            </div>
                        </div>
                        {unreadMessages[user.id] > 0 && (
                            <div className="mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadMessages[user.id]} unread message{unreadMessages[user.id] > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isChatOpen && selectedUser && currentUser && (
                <div className="w-full max-w-4xl p-4 mt-6 bg-teal-800 rounded-lg shadow-xl">
                    <ChatBox
                        currentUser={currentUser}
                        selectedUser={selectedUser}
                        setIsChatOpen={setIsChatOpen}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
