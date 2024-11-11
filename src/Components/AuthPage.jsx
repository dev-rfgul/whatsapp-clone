
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false); // for tracking form submission
    const [value, setValue] = useState(localStorage.getItem('email') || ""); // state for storing email

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true); // set loading to true when form is submitted
    //     try {
    //         await createUserWithEmailAndPassword(auth, email, password);
    //         const user = auth.currentUser;
    //         console.log(user);
    //         console.log("User registered Successfully ");
    //         if (user) {
    //             await setDoc(doc(db, "Users", user.uid), {
    //                 email: user.email,
    //                 name: name
    //             });
    //             console.log("user saved successfully");
    //             window.location.href = '/home'; // Redirect to the home page after successful registration
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     } finally {
    //         setLoading(false); // set loading to false once the process is complete
    //     }
    // };

    // const handleGoogleSignIn = async () => {
    //     try {
    //         const data = await signInWithPopup(auth, googleProvider);
    //         setValue(data.user.email);
    //         localStorage.setItem("email", data.user.email);
    //         window.location.href = '/home'
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // set loading to true when form is submitted
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            console.log("User registered Successfully ");

            if (user) {
                // Save user data to Firestore
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    name: name,
                });
                console.log("User saved successfully");
                window.location.href = '/home'; // Redirect to the home page after successful registration
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false); // set loading to false once the process is complete
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            // Sign in with Google
            const data = await signInWithPopup(auth, googleProvider);
            const user = data.user;

            // Log user data to debug
            console.log("Google User Object:", user);

            // Save user email in localStorage
            setValue(user.email);
            localStorage.setItem("email", user.email);

            // Reference to the user document in Firestore
            const userDocRef = doc(db, "Users", user.uid);

            // Check if the user already exists in Firestore
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                console.log("User does not exist in Firestore, saving...");

                // If the user doesn't exist in Firestore, create a new document with user data
                await setDoc(userDocRef, {
                    email: user.email,
                    name: user.displayName || "No Name Provided", // Use displayName from Google or fallback to default
                    createdAt: new Date().toISOString() // Optionally, add a creation timestamp
                });

                console.log("Google user saved successfully to Firestore");
            } else {
                console.log("User already exists in Firestore");
            }

            // Redirect to the home page after successful login
            window.location.href = '/home';
        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
        }
    };


    useEffect(() => {
        // You can do something with `value` here if needed
    }, [value]); // This effect will run whenever `value` changes

    return (
        <>
                <p className='text-white bg-black'>MY secret key is: {import.meta.env.VITE_KEY}</p>
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>

                    {/* Input fields for Email and Password */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"  // Changed type to text
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your Name"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? "Submitting..." : "Submit"} {/* Show loading state */}
                            </button>
                        </div>
                    </form>

                    {/* Authentication buttons */}
                    <div className="flex flex-col space-y-3 mt-6">
                        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Sign in with Email
                        </button>
                        <button onClick={handleGoogleSignIn} className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                            Sign in with Google
                        </button>
                        <button className="w-full px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600">
                            Sign in with Facebook
                        </button>
                        <button className="w-full px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
