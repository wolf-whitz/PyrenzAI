import React from 'react';
import { motion } from 'framer-motion';

interface LanguageModalProps {
  languages: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ languages, isOpen, onClose }: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-black p-6 rounded-lg max-w-lg w-full text-white font-baloo"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center">Select Language</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {languages.map((lang, index) => (
            <button
              key={index}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              {lang}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Request a Language
          </button>
          <button
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Found a Grammar Issue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
