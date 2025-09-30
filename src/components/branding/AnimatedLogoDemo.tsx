"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function AnimatedLogoDemo() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1)
    setIsPlaying(true)
  }

  // Logo animation variants
  const logoVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    paused: {
      scale: 1,
      rotate: 0
    }
  }

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    paused: {
      opacity: 0.3,
      scale: 1
    }
  }

  const textVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    paused: {
      y: 0
    }
  }

  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto">
      {/* Main Animation Container */}
      <div className="relative w-full h-96 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-8">
        
        {/* Background Animated Circles */}
        <motion.div
          key={`circle1-${animationKey}`}
          className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20"
          animate={isPlaying ? {
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.5, 1],
          } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        <motion.div
          key={`circle2-${animationKey}`}
          className="absolute bottom-10 right-10 w-32 h-32 bg-green-200 rounded-full opacity-20"
          animate={isPlaying ? {
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 0.8, 1],
          } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1
          }}
        />

        {/* Glow Effect */}
        <motion.div
          key={`glow-${animationKey}`}
          className="absolute w-40 h-40 bg-blue-400 rounded-full blur-3xl"
          variants={glowVariants}
          animate={isPlaying ? "animate" : "paused"}
        />

        {/* Main Logo */}
        <motion.div
          key={`logo-${animationKey}`}
          className="relative z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6"
          variants={logoVariants}
          animate={isPlaying ? "animate" : "paused"}
        >
          <Image
            src="/gema.svg"
            alt="GEMA Logo"
            width={80}
            height={80}
            className="w-20 h-20"
          />
        </motion.div>

        {/* Animated Text */}
        <motion.div
          key={`text-${animationKey}`}
          className="text-center z-10"
          variants={textVariants}
          animate={isPlaying ? "animate" : "paused"}
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-2">GEMA</h3>
          <p className="text-lg text-gray-600">Generasi Muda Informatika</p>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          key={`float1-${animationKey}`}
          className="absolute top-20 right-20 text-blue-500"
          animate={isPlaying ? {
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 0.5
          }}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            💻
          </div>
        </motion.div>

        <motion.div
          key={`float2-${animationKey}`}
          className="absolute bottom-20 left-20 text-green-500"
          animate={isPlaying ? {
            y: [0, -15, 0],
            rotate: [0, -10, 0],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1.5
          }}
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            🚀
          </div>
        </motion.div>

        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black bg-opacity-30">
        <div className="flex gap-3">
          <button
            onClick={toggleAnimation}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-200 hover:scale-110"
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          <button
            onClick={restartAnimation}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-200 hover:scale-110"
            title="Restart Animation"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Info Text */}
      
    </div>
  )
}
