import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; // Ensure you have the correct imports
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

const HomePage = () => {
    const [users, setUsers] = useState([]);

    // Fetch all users from Firestore
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Users"));
            const usersList = [];
            querySnapshot.forEach((doc) => {
                usersList.push(doc.data()); // Push user data into an array
            });
            setUsers(usersList); // Set the users state with the fetched users
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    useEffect(() => {
        // Fetch users when the component mounts
        fetchUsers();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-white">Home Page</h2>

                {/* Display users as cards */}
                <div className="grid grid-cols-1 gap-4 mt-6">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-700 rounded-md shadow-md"
                            >
                                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                <p className="text-sm text-gray-300">{user.email}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white">No users found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
