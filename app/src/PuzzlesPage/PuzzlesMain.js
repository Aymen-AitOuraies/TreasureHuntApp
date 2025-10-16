import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DecorativeTitle from "../components/DecorativeTitle";
import PuzzleCard from "./components/PuzzleCard";
import SuccessAnimation from "./components/SuccessAnimation";
import { getTeamPuzzles, submitPuzzleAnswer, saveTeamPuzzlesToLocalStorage, getTeamPuzzlesFromLocalStorage } from "../services/puzzleService";
import { getTeamFromLocalStorage } from "../services/teamService";
import puzzleWsService from "../services/puzzleWebSocketService";

export default function PuzzlesMain({ onNavigate }) {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const teamData = getTeamFromLocalStorage();
    console.log('🧩 PuzzlesMain: Team data from localStorage:', teamData);
    setTeam(teamData);

    if (teamData?.id) {
      console.log('✅ PuzzlesMain: Team ID found:', teamData.id);
      fetchPuzzles(teamData.id);
      connectToPuzzleWebSocket(teamData.id);
    } else {
      console.error('❌ PuzzlesMain: No team ID found in localStorage');
      setLoading(false);
    }

    return () => {
      if (teamData?.id) {
        puzzleWsService.unsubscribeFromPuzzles(teamData.id);
      }
    };
  }, []);

  const fetchPuzzles = async (teamId) => {
    const cachedPuzzles = getTeamPuzzlesFromLocalStorage(teamId);
    if (cachedPuzzles) {
      console.log('📦 PuzzlesMain: Using cached puzzles', cachedPuzzles);
      setPuzzles(cachedPuzzles);
      setLoading(false);
    }

    try {
      console.log('🔄 PuzzlesMain: Fetching puzzles for team:', teamId);
      const puzzlesData = await getTeamPuzzles(teamId);
      console.log('✅ PuzzlesMain: Puzzles fetched successfully', puzzlesData);
      setPuzzles(puzzlesData);
      saveTeamPuzzlesToLocalStorage(teamId, puzzlesData);
      setLoading(false);
    } catch (error) {
      console.error('❌ PuzzlesMain: Failed to fetch puzzles:', error);
      if (!cachedPuzzles) {
        setPuzzles([]);
      }
      setLoading(false);
    }
  };

  const connectToPuzzleWebSocket = (teamId) => {
    if (!puzzleWsService.isConnected()) {
      puzzleWsService.connect(
        () => {
          console.log('✅ PuzzlesMain: Puzzle WebSocket connected');
          subscribeToPuzzleUpdates(teamId);
        },
        (error) => {
          console.error('❌ PuzzlesMain: Puzzle WebSocket connection error:', error);
        }
      );
    } else {
      subscribeToPuzzleUpdates(teamId);
    }
  };

  const subscribeToPuzzleUpdates = (teamId) => {
    puzzleWsService.subscribeToPuzzleUpdates(teamId, (updatedPuzzles) => {
      console.log('🔄 PuzzlesMain: Puzzles updated via WebSocket:', updatedPuzzles);
      setPuzzles(updatedPuzzles);
      saveTeamPuzzlesToLocalStorage(teamId, updatedPuzzles);
    });
  };

  const handleSubmitAnswer = async (puzzleId, answer) => {
    if (!team?.id) {
      console.error('❌ No team ID available');
      alert('No team assigned. Please contact an administrator.');
      return;
    }

    try {
      console.log(`📝 Submitting answer for puzzle ${puzzleId}:`, answer);
      const response = await submitPuzzleAnswer(team.id, puzzleId, answer);
      console.log('✅ Answer submitted successfully:', response);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Correct answer!');
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('❌ Error submitting answer:', error);
      alert(error.message || 'Failed to submit answer. Please try again.');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <Layout onNavigate={onNavigate} currentPage="puzzle">
        <div className="-mt-14">
          <DecorativeTitle title="Puzzles" />
          <div className="mt-8 flex justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
              <p className="text-secondary font-cormorant text-xl">Loading puzzles...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!team?.id) {
    return (
      <Layout onNavigate={onNavigate} currentPage="puzzle">
        <div className="-mt-14">
          <DecorativeTitle title="Puzzles" />
          <div className="mt-8 text-center">
            <p className="text-secondary font-cormorant text-xl">No team assigned</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onNavigate={onNavigate} currentPage="puzzle">
      <div className="-mt-14">
        <DecorativeTitle title="Puzzles" />
        <div className="mt-8 space-y-3">
          {puzzles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary font-cormorant text-xl">No puzzles available yet</p>
            </div>
          ) : (
            puzzles.map((puzzle) => (
              <PuzzleCard
                key={puzzle.id}
                puzzleNumber={puzzle.puzzleId}
                puzzleName={puzzle.puzzleTitle}
                description={puzzle.puzzleDescription}
                isSolved={puzzle.solved}
                onSubmit={handleSubmitAnswer}
                puzzleData={puzzle}
              />
            ))
          )}
        </div>
      </div>

      {showSuccess && (
        <SuccessAnimation 
          message={successMessage} 
          onClose={handleCloseSuccess} 
        />
      )}
    </Layout>
  );
}
