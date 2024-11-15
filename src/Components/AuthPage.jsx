import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db, storage } from './firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [randomImage, setRandomImage] = useState('');
    const defaultImages = [
        "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
        "https://cdn-icons-png.flaticon.com/512/2202/2202115.png",
        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        "https://cdn-icons-png.flaticon.com/512/17888/17888161.png",
        "https://cdn-icons-png.flaticon.com/512/924/924915.png",
        "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
        "https://cdn-icons-png.flaticon.com/512/2202/2202115.png",
        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        "https://cdn-icons-png.flaticon.com/512/17888/17888161.png",
        "https://cdn-icons-png.flaticon.com/512/924/924915.png",
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        "https://cdn-icons-png.flaticon.com/512/4322/4322992.png",
        "https://cdn-icons-png.flaticon.com/512/18312/18312917.png",
        "https://cdn-icons-png.flaticon.com/512/1308/1308845.png",
        "https://cdn-icons-png.flaticon.com/512/1326/1326390.png",
        "https://cdn-icons-png.flaticon.com/512/547/547413.png",
        "https://cdn-icons-png.flaticon.com/512/4681/4681809.png"
    ];

    useEffect(() => {
        setRandomImage(defaultImages[Math.floor(Math.random() * defaultImages.length)]);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const uploadImage = async (file) => {
        const storageRef = ref(storage, `profilePictures/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let imageUrl = randomImage;
            if (image) imageUrl = await uploadImage(image);

            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                name: name || 'Anonymous',
                image: imageUrl,
            });

            console.log('User successfully registered and saved.');
            window.location.href = '/home';
        } catch (err) {
            setError(err.message || 'An error occurred while registering.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const data = await signInWithPopup(auth, googleProvider);
            const user = data.user;

            const imageUrl = user.photoURL || randomImage;

            const userDocRef = doc(db, 'Users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    name: user.displayName || 'Anonymous',
                    image: imageUrl,
                    createdAt: new Date().toISOString(),
                });
                console.log('Google user saved successfully.');
            }

            window.location.href = '/home';
        } catch (err) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
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
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                            Profile Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded-md hover:bg-red-600"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Sign in with Google'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
