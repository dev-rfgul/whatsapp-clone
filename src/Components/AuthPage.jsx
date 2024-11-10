import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from './firebase'
const AuthPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser
            console.log(user)
            console.log("User registered Successfully ")
        } catch (error) {
            console.log(error.message)
        }
    }
    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>

                {/* Input fields for Email and Password */}
                <form onSubmit={handleSubmit} action="">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
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
                                type="name"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your Name"
                            />
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Submit
                        </button>
                    </div>
                </form>

                {/* Authentication buttons */}
                <div className="flex flex-col space-y-3 mt-6">
                    <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Sign in with Email
                    </button>
                    <button className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
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
    );
};

export default AuthPage;
