import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function AddPuzzleForm({ onAddPuzzle }) {
  const [puzzleName, setPuzzleName] = useState("");
  const [answer, setAnswer] = useState("");
  const [xp, setXp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!puzzleName || !answer || !xp) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(xp) || parseInt(xp) <= 0) {
      setError("XP must be a positive number");
      return;
    }

    // Create puzzle object
    const newPuzzle = {
      id: Date.now(), // Temporary ID
      puzzleName,
      answer,
      xp: parseInt(xp),
      createdAt: new Date().toISOString()
    };

    // Call parent function
    onAddPuzzle(newPuzzle);

    // Reset form
    setPuzzleName("");
    setAnswer("");
    setXp("");
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary font-cormorant mb-6 text-center">
        Add New Puzzle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-secondary font-cormorant text-lg font-bold mb-2">
            Puzzle Name
          </label>
          <input
            type="text"
            value={puzzleName}
            onChange={(e) => setPuzzleName(e.target.value)}
            placeholder="e.g., The Color Sequence"
            className="w-full bg-primary bg-opacity-20 border-2 border-secondary outline-none p-3 rounded-lg placeholder:text-gray-500 text-secondary font-cormorant text-lg focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-secondary font-cormorant text-lg font-bold mb-2">
            Answer
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            className="w-full bg-primary bg-opacity-20 border-2 border-secondary outline-none p-3 rounded-lg placeholder:text-gray-500 text-secondary font-cormorant text-lg focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-secondary font-cormorant text-lg font-bold mb-2">
            XP Points
          </label>
          <input
            type="number"
            value={xp}
            onChange={(e) => setXp(e.target.value)}
            placeholder="e.g., 100"
            min="1"
            className="w-full bg-primary bg-opacity-20 border-2 border-secondary outline-none p-3 rounded-lg placeholder:text-gray-500 text-secondary font-cormorant text-lg focus:border-primary transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md animate-shake">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:alert-circle" className="text-2xl flex-shrink-0" />
              <p className="font-cormorant text-base">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-secondary text-background text-xl font-cormorant font-bold p-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-md"
        >
          Add Puzzle
        </button>
      </form>
    </div>
  );
}
