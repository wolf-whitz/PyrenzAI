import React from 'react';

interface RequiredFieldsPopupProps {
  missingFields: string[];
  onClose: () => void;
}

export default function RequiredFieldsPopup({
  missingFields,
  onClose,
}: RequiredFieldsPopupProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      role="dialog"
      aria-labelledby="missingFieldsTitle"
      aria-describedby="missingFieldsList"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-gray-900 dark:text-white w-full max-w-md flex flex-col gap-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
      >
        <h2
          id="missingFieldsTitle"
          className="text-2xl font-bold text-center"
        >
          🚨 Missing Fields Alert 🚨
        </h2>
        <ul
          id="missingFieldsList"
          className="list-disc list-inside flex flex-col gap-2 text-base"
        >
          {missingFields.map((field, index) => (
            <li key={index} className="animate-slide-in">
              {field}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="self-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Got it 👌
        </button>
      </div>
    </div>
  );
}
