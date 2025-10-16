import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ConfirmModal from "./ConfirmModal";

export default function PuzzleListItem({ puzzle, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(puzzle.id);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="bg-white bg-opacity-80 rounded-xl shadow-md p-4 border-2 border-secondary hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-secondary font-cormorant mb-2">
              {puzzle.puzzleName}
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700 font-cormorant">
                <span className="font-bold">Answer:</span> {puzzle.answer}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700 font-cormorant">XP:</span>
                <div className="flex items-center bg-primary bg-opacity-30 px-2 py-1 rounded-full">
                  <span className="text-secondary font-bold mr-1">{puzzle.xp}</span>
                  <Icon icon="mdi:star" className="text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors self-start sm:self-center"
          >
            <Icon icon="mdi:trash-can-outline" className="text-xl" />
            <span className="font-cormorant font-bold">Delete</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Puzzle"
        message={`Are you sure you want to delete "${puzzle.puzzleName}"? This action cannot be undone.`}
      />
    </>
  );
}
