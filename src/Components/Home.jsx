import React from 'react';

const HomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="text-center p-8 space-y-6 bg-gray-800 rounded-lg shadow-md max-w-lg">
                <h1 className="text-4xl font-bold text-white">Welcome to Our Platform</h1>
                <p className="text-gray-300 text-lg">
                    Discover amazing features and join a vibrant community of users. We’re glad you’re here!
                </p>
                <button className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default HomePage;
