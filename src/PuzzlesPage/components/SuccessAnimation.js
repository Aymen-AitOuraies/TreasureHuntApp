import React, { useEffect } from "react";

export default function SuccessAnimation({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-8 shadow-2xl transform animate-scaleIn">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-24 h-24">
            <svg
              className="absolute inset-0 w-24 h-24"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#381D1B"
                strokeWidth="2"
                className="animate-pulse"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/assets/GlobalAssets/PirateProfile.jpg" 
                alt="Pirate" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            
            <svg
              className="absolute inset-0 w-24 h-24 text-secondary animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ zIndex: 10 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className="checkmark-path"
              />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-cormorant font-bold text-secondary mb-2">
              Correct Answer!
            </h3>
            {message && (
              <p className="text-gray-600 font-cormorant text-lg">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
