
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import React, { useEffect, useState } from 'react';
// import { auth, googleProvider, db, storage } from './firebase'; // import storage
// import { signInWithPopup } from 'firebase/auth';
// import { setDoc, doc, getDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // for uploading images

// const AuthPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [name, setName] = useState("");
//     const [image, setImage] = useState(null); // for storing the image file
//     const [loading, setLoading] = useState(false);
//     const [value, setValue] = useState(localStorage.getItem('email') || "");

//     // Function to handle image upload
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//         }
//     };

//     // Function to upload the image to Firebase Storage and get the URL
//     const uploadImage = async (file) => {
//         const storageRef = ref(storage, `profilePictures/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         return new Promise((resolve, reject) => {
//             uploadTask.on(
//                 'state_changed',
//                 (snapshot) => {
//                     // Optionally, show upload progress here
//                 },
//                 (error) => reject(error),
//                 async () => {
//                     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                     resolve(downloadURL);
//                 }
//             );
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // set loading to true when form is submitted
//         try {
//             // Create user with email and password
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
//             console.log("User registered Successfully");

//             let imageUrl = "";

//             if (image) {
//                 // If the user has uploaded an image, upload it to Firebase Storage
//                 imageUrl = await uploadImage(image);
//             } else {
//                 // Set a default image for users who don't upload one
//                 imageUrl = "https://example.com/default-profile-image.jpg"; // Use a default image URL
//             }

//             if (user) {
//                 // Save user data to Firestore
//                 await setDoc(doc(db, "Users", user.uid), {
//                     email: user.email,
//                     name: name,
//                     image: imageUrl, // Store the image URL in Firestore
//                 });
//                 console.log("User saved successfully");
//                 window.location.href = '/home'; // Redirect to the home page after successful registration
//             }
//         } catch (error) {
//             console.log(error.message);
//         } finally {
//             setLoading(false); // set loading to false once the process is complete
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         try {
//             // Sign in with Google
//             const data = await signInWithPopup(auth, googleProvider);
//             const user = data.user;

//             let imageUrl = user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // Use Google photo or default

//             // Log user data to debug
//             console.log("Google User Object:", user);

//             // Save user email in localStorage
//             setValue(user.email);
//             localStorage.setItem("email", user.email);

//             // Reference to the user document in Firestore
//             const userDocRef = doc(db, "Users", user.uid);

//             // Check if the user already exists in Firestore
//             const userDocSnap = await getDoc(userDocRef);

//             if (!userDocSnap.exists()) {
//                 console.log("User does not exist in Firestore, saving...");

//                 // If the user doesn't exist in Firestore, create a new document with user data
//                 await setDoc(userDocRef, {
//                     email: user.email,
//                     name: user.displayName || "No Name Provided", // Use displayName from Google or fallback to default
//                     image: imageUrl, // Save the image URL
//                     createdAt: new Date().toISOString(), // Optionally, add a creation timestamp
//                 });

//                 console.log("Google user saved successfully to Firestore");
//             } else {
//                 console.log("User already exists in Firestore");
//             }

//             // Redirect to the home page after successful login
//             window.location.href = '/home';
//         } catch (error) {
//             console.error("Error during Google sign-in:", error.message);
//         }
//     };

//     useEffect(() => {
//         // You can do something with `value` here if needed
//     }, [value]);

//     return (
//         <>
//             <div className="flex items-center justify-center min-h-screen bg-gray-900">
//                 <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>

//                     {/* Input fields for Email, Password, Name, and Image Upload */}
//                     <form onSubmit={handleSubmit}>
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//                                     Email
//                                 </label>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     value={email}
//                                     className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
//                                     placeholder="Enter your email"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                                     Password
//                                 </label>
//                                 <input
//                                     id="password"
//                                     type="password"
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     value={password}
//                                     className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
//                                     placeholder="Enter your password"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                                     Name
//                                 </label>
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     onChange={(e) => setName(e.target.value)}
//                                     value={name}
//                                     className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
//                                     placeholder="Enter your Name"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="image" className="block text-sm font-medium text-gray-300">
//                                     Profile Image
//                                 </label>
//                                 <input
//                                     id="image"
//                                     type="file"
//                                     onChange={handleImageChange}
//                                     className="w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                                 disabled={loading}
//                             >
//                                 {loading ? "Submitting..." : "Submit"}
//                             </button>
//                         </div>
//                     </form>

//                     <div className="flex flex-col space-y-3 mt-6">
//                         <button onClick={handleGoogleSignIn} className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
//                             Sign in with Google
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AuthPage;


import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db, storage } from './firebase'; // import storage
import { signInWithPopup } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // for uploading images

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState(null); // for storing the image file
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(localStorage.getItem('email') || "");

    // Function to handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Function to upload the image to Firebase Storage and get the URL
    const uploadImage = async (file) => {
        const storageRef = ref(storage, `profilePictures/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Optionally, show upload progress here
                },
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
        setLoading(true); // set loading to true when form is submitted
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User registered Successfully");

            let imageUrl = "";

            if (image) {
                // If the user has uploaded an image, upload it to Firebase Storage
                imageUrl = await uploadImage(image);
            } else {
                // Set a default image for users who don't upload one
                imageUrl = "https://example.com/default-profile-image.jpg"; // Use a default image URL
            }

            if (user) {
                // Save user data to Firestore
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    name: name,
                    image: imageUrl, // Store the image URL in Firestore
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

            let imageUrl = user.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // Use Google photo or default

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
                    image: imageUrl, // Save the image URL
                    createdAt: new Date().toISOString(), // Optionally, add a creation timestamp
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
    }, [value]);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>

                    {/* Input fields for Email, Password, Name, and Image Upload */}
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
                                    placeholder="Enter your Name"
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
                                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col space-y-3 mt-6">
                        <button onClick={handleGoogleSignIn} className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
