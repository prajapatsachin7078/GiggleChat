import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import { Card, CardHeader, CardContent } from '../ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { MessageSquare, Lock, Users } from 'lucide-react'; // Import specific icons
import { UserContext } from '@/context/userContext';

function Home() {
  const navigate = useNavigate();
  const [featureIndex, setFeatureIndex] = useState(0);
  const {user} = useContext(UserContext);
  const features = [
    "Instant Messaging",
    "Group Chats",
    "End-to-End Encryption",
    "File Sharing",
    "Voice and Video Calls",
    "Cross-Platform Sync"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000); // Change feature every 3 seconds

    return () => clearInterval(interval);
  }, [features.length,user]);

  return (
    <div className="h-screen bg-gradient-to-b from-pink-100 to-rose-50 text-gray-800 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold mb-4">
          Welcome to{" "}
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-red-400 to-yellow-300 animate-pulse">
            GiggleChat
          </span>
        </h1>
        <p className="text-2xl">Your Ultimate Messaging Experience</p>

        {/* Dynamic Text Rendering for Features */}
        <motion.div
          key={featureIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold mt-4"
        >
          {features[featureIndex]}
        </motion.div>
      </motion.div>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
        {/* Feature 1 */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="bg-white text-gray-800 shadow-md border-2 border-rose-200 h-[200px]">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Fast Messaging</h2>
              <MessageSquare className="w-6 h-6 text-rose-500" />
            </CardHeader>
            <CardContent>
              <p>
                Experience lightning-fast messaging with real-time updates and
                notifications.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 2 */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="bg-white text-gray-800 shadow-md border-2 border-rose-200 h-[200px]">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Secure Chats</h2>
              <Lock className="w-6 h-6 text-rose-500" />
            </CardHeader>
            <CardContent>
              <p>
                Your conversations are protected with end-to-end encryption,
                ensuring privacy.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 3 */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="bg-white text-gray-800 shadow-md border-2 border-rose-200 h-[200px]">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Group Chats</h2>
              <Users className="w-6 h-6 text-rose-500" />
            </CardHeader>
            <CardContent>
              <p>
                Create and manage groups for friends, family, or work with ease.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Buttons for Login and Signup */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex space-x-4 mt-10"
      >
        {user ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => navigate("/chats")}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                >
                  Chats
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Chats</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate("/verify-email")}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                  >
                    Sign Up
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                  >
                    Login
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Access your account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Home;
