import React from "react";
import { Icon } from "@iconify/react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <Icon icon="mdi:alert-circle" className="text-3xl text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary font-cormorant">
            {title}
          </h3>
        </div>
        
        <p className="text-gray-700 font-cormorant text-lg mb-6">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition-colors font-cormorant font-bold text-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors font-cormorant font-bold text-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
