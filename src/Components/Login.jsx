import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from './firebase'

const LoginPage = () => {
    const [email, SetEmail] = useState("")
    const [password, SetPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("user login successful")
            window.location.href = '/home'
        } catch (error) {
            console.log(error.message)

        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>

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
                                onChange={(e) => SetEmail(e.target.value)}
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
                                onChange={(e) => SetPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Login
                        </button>
                        {console.log(email, password)}
                    </div>
                </form>
                {/* Links for additional actions */}
                <div className="text-center">
                    <a href="#" className="text-sm text-blue-400 hover:underline">
                        Forgot your password?
                    </a>
                    <div className="mt-2 text-gray-300">
                        Don’t have an account?{' '}
                        <a href="/register" className="text-blue-400 hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
