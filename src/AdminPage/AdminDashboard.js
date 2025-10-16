import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AddPuzzleForm from "./components/AddPuzzleForm";
import PuzzleListItem from "./components/PuzzleListItem";
import Toast from "./components/Toast";

export default function AdminDashboard({ onLogout }) {
  const [puzzles, setPuzzles] = useState([
    {
      id: 1,
      puzzleName: "The Color Sequence",
      answer: "Red, Green, Blue",
      xp: 150,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      puzzleName: "Ancient Riddle",
      answer: "Echo",
      xp: 200,
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAddPuzzle = (newPuzzle) => {
    setPuzzles([...puzzles, newPuzzle]);
    showToast("Puzzle added successfully!", "success");
  };

  const handleDeletePuzzle = (puzzleId) => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    setPuzzles(puzzles.filter(puzzle => puzzle.id !== puzzleId));
    showToast(`"${puzzle.puzzleName}" has been deleted`, "info");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary via-background to-secondary">
      {/* Header */}
      <div className="bg-white bg-opacity-90 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary font-cormorant">
              Admin Dashboard
            </h1>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              <Icon icon="mdi:logout" className="text-xl" />
              <span className="font-cormorant font-bold text-lg">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Puzzle Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <AddPuzzleForm onAddPuzzle={handleAddPuzzle} />
          </div>

          {/* Right Column - Puzzle List */}
          <div>
            <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-secondary font-cormorant">
                  Puzzles List
                </h2>
                <div className="flex items-center bg-primary bg-opacity-30 px-3 py-1 rounded-full">
                  <span className="text-secondary font-bold text-lg mr-1">{puzzles.length}</span>
                  <span className="text-secondary font-cormorant">Total</span>
                </div>
              </div>

              {puzzles.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="mdi:puzzle-outline" className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-cormorant text-xl">
                    No puzzles yet. Add your first puzzle!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {puzzles.map((puzzle) => (
                    <PuzzleListItem
                      key={puzzle.id}
                      puzzle={puzzle}
                      onDelete={handleDeletePuzzle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
