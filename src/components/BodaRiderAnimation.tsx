import React from 'react';
import { motion } from 'motion/react';

interface Props {
  className?: string;
  onComplete?: () => void;
  once?: boolean;
}

export const BodaRiderAnimation: React.FC<Props> = ({ className, onComplete, once = false }) => {
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-20%' }}
        animate={{ x: '120%' }}
        transition={{
          duration: 5,
          ease: "linear",
          repeat: once ? 0 : Infinity,
          repeatDelay: 0.5
        }}
        onAnimationComplete={onComplete}
        className="relative flex items-center"
      >
        <div className="relative scale-75 lg:scale-100">
          {/* Exhaust Smoke */}
          <div className="absolute -left-4 bottom-1 flex gap-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 2], 
                  opacity: [0.6, 0],
                  x: [-5, -20],
                  y: [0, -10]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.8, 
                  delay: i * 0.2 
                }}
                className="w-2 h-2 bg-gray-400 rounded-full blur-[2px]"
              />
            ))}
          </div>
          
          {/* The Motorcycle Body */}
          <div className="relative w-24 h-16">
            {/* Main Frame */}
            <div className="absolute bottom-4 left-4 w-16 h-2 bg-black rounded-full transform rotate-[-5deg]" />
            <div className="absolute bottom-6 left-10 w-2 h-8 bg-black rounded-full transform rotate-[20deg]" />
            
            {/* Engine Area */}
            <div className="absolute bottom-4 left-8 w-8 h-6 bg-gray-800 rounded-md border border-gray-600" />
            
            {/* Seat */}
            <div className="absolute top-6 left-6 w-12 h-3 bg-black rounded-t-lg" />
            
            {/* Handlebars */}
            <div className="absolute top-4 right-4 w-1 h-8 bg-black transform rotate-[-20deg]" />
            <div className="absolute top-3 right-2 w-4 h-1 bg-black rounded-full" />

            {/* Rear Wheel */}
            <div className="absolute bottom-0 left-0 w-10 h-10">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
                className="w-full h-full border-4 border-black rounded-full flex items-center justify-center"
              >
                <div className="w-full h-[2px] bg-black/20" />
                <div className="absolute w-[2px] h-full bg-black/20" />
                <div className="absolute w-2 h-2 bg-gray-600 rounded-full" />
              </motion.div>
            </div>

            {/* Front Wheel */}
            <div className="absolute bottom-0 right-0 w-10 h-10">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
                className="w-full h-full border-4 border-black rounded-full flex items-center justify-center"
              >
                <div className="w-full h-[2px] bg-black/20" />
                <div className="absolute w-[2px] h-full bg-black/20" />
                <div className="absolute w-2 h-2 bg-gray-600 rounded-full" />
              </motion.div>
            </div>

            {/* The Rider */}
            <div className="absolute -top-4 left-6 w-10 h-14">
              {/* Torso */}
              <div className="absolute bottom-0 left-0 w-8 h-10 bg-yellow-500 rounded-lg transform rotate-[-10deg] border border-black" />
              {/* Helmet */}
              <div className="absolute -top-2 left-2 w-7 h-7 bg-black rounded-full border border-yellow-400">
                <div className="absolute top-2 right-0 w-4 h-1.5 bg-yellow-400 rounded-l-full" /> {/* Visor */}
              </div>
              {/* Arms */}
              <div className="absolute top-4 right-0 w-6 h-1.5 bg-yellow-600 rounded-full transform rotate-[-30deg]" />
            </div>

            {/* Delivery Box */}
            <div className="absolute top-2 left-0 w-7 h-7 bg-black rounded border border-yellow-400 flex items-center justify-center text-[6px] font-black text-yellow-400">
              PESA
            </div>
          </div>
          
          {/* Speed Lines */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <motion.div 
              animate={{ x: [-10, 10], opacity: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="w-8 h-[1px] bg-yellow-400 rounded-full" 
            />
            <motion.div 
              animate={{ x: [-20, 0], opacity: [0, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
              className="w-12 h-[1px] bg-yellow-400 rounded-full" 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
