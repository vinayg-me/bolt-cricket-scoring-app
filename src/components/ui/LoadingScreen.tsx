import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as Cricket } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }}
          className="inline-block mb-4"
        >
          <Cricket size={64} className="text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;