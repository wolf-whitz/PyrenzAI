import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ErrorBoundary() {
  const location = useLocation();

  return (
    <motion.div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="text-white text-center p-6 bg-black bg-opacity-50 rounded-lg max-w-md mx-auto font-baloo">
        <h2 className="text-3xl font-semibold mb-4">
          Oops! This page doesn’t exist.
        </h2>
        <p className="text-xl mb-4">
          The path <strong>{location.pathname}</strong> is not registered.
        </p>
        <p className="text-lg">
          Go back to{' '}
          <a href="/" className="text-blue-400 underline">
            Home
          </a>{' '}
          and try again!
        </p>
      </div>
    </motion.div>
  );
}
