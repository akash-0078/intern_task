"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { auth,db } from "@lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import TotalUsers from "./totalUser";
import LogoutButton from "./logout";
import CountdownTimer from "./countdownTimer";

export default function Event() {
  const audioRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); 
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [user, setUser] = useState(null);

  
  // Try autoplay or wait for user interaction if blocked
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasPlayed) return;

    const handleUserInteraction = () => {
      audio
        .play()
        .then(() => {
          setHasPlayed(true);
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("keydown", handleUserInteraction);
        })
        .catch((err) => console.error("Playback error:", err));
    };

    audio
      .play()
      .then(() => setHasPlayed(true))
      .catch(() => {
        // Wait for interaction if autoplay is blocked
        document.addEventListener("click", handleUserInteraction, {
          once: true,
        });
        document.addEventListener("keydown", handleUserInteraction, {
          once: true,
        });
      });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [hasPlayed]);

  // Prevent pause and seek
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasPlayed) return;

    const handlePause = () => {
      if (audio.paused) audio.play();
    };

    const handleSeek = () => {
      if (audio.currentTime > 0) audio.currentTime = 0;
    };

    audio.addEventListener("pause", handlePause);
    audio.addEventListener("seeking", handleSeek);

    return () => {
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("seeking", handleSeek);
    };
  }, [hasPlayed]);

  const handleAudioEnd = () => {
    setShowFeedback(true);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // await fetch("/api/send-feedback", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     message: feedback,
      //     email: user.email, 
      //   }),
      //   headers: { "Content-Type": "application/json" },
      // });
      await addDoc(collection(db, "feedbacks"), {
        email: user.email,
        message: feedback,
        timestamp: new Date(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  return user ? (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      <div className="fixed top-7 right-12 z-50">
        {user && <LogoutButton />}
      </div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-4 text-gray-800 dark:text-white"
      >
        Welcome to My Assessment Page
      </motion.h2>

      <motion.audio
        ref={audioRef}
        src="/audio/intro.mp3"
        loop={false}
        controls={false}
        autoPlay={true}
        className="w-full max-w-md rounded-lg shadow-lg"
        onEnded={handleAudioEnd}
        initial={{ opacity: 0 }}
        animate={{ opacity: hasPlayed ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
        Audio will play once automatically once click anywhere. You can’t pause
        or seek.
      </p>

      {showFeedback && !submitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            We'd love your feedback!
          </h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="w-full h-24 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
            placeholder="Share your thoughts..."
          />
          <button
            type="submit"
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Submit Feedback
          </button>
        </motion.form>
      )}

      {submitted && (
        <motion.div
          className="flex items-center text-green-600 font-medium space-x-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircledIcon className="w-5 h-5" />
          <span>Thank you for your feedback!</span>
        </motion.div>
      )}
      <div className="mt-8">
        <CountdownTimer/>
      </div>

      <div className="mt-8">
        <TotalUsers />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
      >
        You must be logged in to access this page
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-600 dark:text-gray-400 mb-6"
      >
        Please login to continue
      </motion.p>
      <motion.a
        href="/login"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
      >
        Go to Login
      </motion.a>
    </div>
  );
}
