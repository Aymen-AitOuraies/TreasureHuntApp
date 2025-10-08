import React, { useState } from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import PuzzleCard from "./components/PuzzleCard";

export default function PuzzlesMain({ onNavigate }) {
  const [puzzles, setPuzzles] = useState([
    {
      puzzleNumber: 1,
      puzzleName: "The Color Sequence",
      description: "Red is first, blue is last, Green hides where shadows are cast. Put them in order.",
      isSolved: false
    },
    {
      puzzleNumber: 2,
      puzzleName: "Ancient Riddle",
      description: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      isSolved: true
    },
    {
      puzzleNumber: 3,
      puzzleName: "The Missing Number",
      description: "Find the missing number in the sequence: 2, 4, 8, 16, ?, 64",
      isSolved: false
    },
    {
      puzzleNumber: 4,
      puzzleName: "Word Puzzle",
      description: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
      isSolved: false
    }
  ]);

  const handleSubmitAnswer = (puzzleNumber, answer) => {
    console.log(`Puzzle ${puzzleNumber} answer:`, answer);
    // Here you can add logic to check the answer and update the puzzle state
    // For example:
    // if (answer.toLowerCase() === correctAnswer) {
    //   setPuzzles(puzzles.map(p => 
    //     p.puzzleNumber === puzzleNumber ? { ...p, isSolved: true } : p
    //   ));
    // }
  };

  return (
    <Layout onNavigate={onNavigate} currentPage="puzzle">
      <div className="-mt-14">
        <DecorativeTitle title="Puzzles" />
        <div className="mt-8 space-y-3">
          {puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.puzzleNumber}
              puzzleNumber={puzzle.puzzleNumber}
              puzzleName={puzzle.puzzleName}
              description={puzzle.description}
              isSolved={puzzle.isSolved}
              onSubmit={handleSubmitAnswer}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
