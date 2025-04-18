'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const isNewUser = result?.additionalUserInfo?.isNewUser;
      if (isNewUser) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          method: 'google',
        });
      }

      toast.success('Signed in with Google!');
      router.push('/');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-sm w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Login with Email
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400">
          <div className="flex-grow border-t border-gray-300" />
          or
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-17.6-1.6-35.2-4.8-52.2H272v98.9h147.1c-6.3 34.2-25.4 63.3-54 82.6l87.4 67.8c51.2-47.2 81-116.5 81-197.1z"
            />
            <path
              fill="#34a853"
              d="M272 544.3c72.6 0 133.6-24.1 178.2-65.4l-87.4-67.8c-24.2 16.2-55.2 25.6-90.8 25.6-69.9 0-129.1-47.2-150.3-110.5l-90.3 69.5C83.8 480.3 171.4 544.3 272 544.3z"
            />
            <path
              fill="#fbbc04"
              d="M121.7 326.2c-10.4-30.5-10.4-63.4 0-93.9l-90.3-69.5c-39.5 78.9-39.5 171 0 249.9l90.3-69.5z"
            />
            <path
              fill="#ea4335"
              d="M272 107.7c39.6-.6 77.7 13.6 106.8 39.7l80-80.2C411.7 24.4 342.8-.2 272 0 171.4 0 83.8 64 31.3 160.3l90.3 69.5C142.9 154.9 202.1 107.7 272 107.7z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
