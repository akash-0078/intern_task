"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { PersonIcon } from "@radix-ui/react-icons";

export default function TotalUsers() {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const total = snapshot.size;
        setUserCount(total);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center"
      >
        <div className="flex justify-center items-center mb-4">
        <PersonIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Total Registered Users
          </h3>
        </div>

        <AnimatePresence>
          {userCount === null ? (
            <motion.p
              key="loading"
              className="text-gray-500 dark:text-gray-400 animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading user count...
            </motion.p>
          ) : (
            <motion.p
              key="count"
              className="text-3xl font-bold text-blue-600 dark:text-blue-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {userCount}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
