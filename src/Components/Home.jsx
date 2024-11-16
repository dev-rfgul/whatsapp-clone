
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, getDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ChatBox from './Chat';

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [recentContacts, setRecentContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
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

                const recentContactsList = currentUser.recentContacts || [];
                setRecentContacts(filteredUsers.filter(user => recentContactsList.includes(user.id)));

                setUsers(filteredUsers.filter(user => !recentContactsList.includes(user.id)));
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleUserClick = (user) => {
        if (user) {
            setSelectedUser(user);
            setIsChatOpen(true);

            const updatedRecentContacts = [...new Set([user.id, ...(currentUser.recentContacts || [])])];
            updateDoc(doc(db, "Users", currentUser.id), { recentContacts: updatedRecentContacts });
            setCurrentUser(prev => ({ ...prev, recentContacts: updatedRecentContacts }));
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
                <h2 className="text-2xl font-bold text-[#60A5FA]">Welcome, {currentUser?.name || "User"}</h2>

                <div className="flex items-center space-x-4">
                    <img
                        src={currentUser?.image || "https://cdn-icons-png.flaticon.com/512/1326/1326405.png"}
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

            <div className="flex flex-col lg:flex-row w-full mt-8 space-x-0 lg:space-x-4">
                {/* Left Column: Recently Contacted Users */}
                <div className="flex flex-col w-full lg:w-1/4 space-y-4">
                    <h3 className="text-lg font-semibold text-teal-400">Recently Contacted</h3>
                    {recentContacts.map((user) => (
                        <div
                            key={user.id}
                            className="w-full bg-[#374151] rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => handleUserClick(user)}
                        >
                            <div className="flex items-center p-3">
                                <img
                                    src={user.image || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-teal-400">{user.name}</h3>
                                    <p className="text-sm text-[#60A5FA]">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Right Column: Available Users in Card Form */}
                <div className="flex flex-col w-full lg:w-3/4 space-y-4">
                    <h3 className="text-lg font-semibold text-teal-400">Available Users</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="w-full bg-[#374151] rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="flex items-center p-3">
                                    <img
                                        src={user.image || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-teal-400">{user.name}</h3>
                                        <p className="text-sm text-[#60A5FA]">{user.email}</p>
                                    </div>
                                </div>
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
            </div>
        </div>
    );
};

export default HomePage;
