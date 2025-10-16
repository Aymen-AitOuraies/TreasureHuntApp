// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;


export const getTeamPuzzles = async (teamId) => {
  try {
    console.log(`🧩 Fetching puzzles for team ${teamId}...`);
    const response = await fetch(`${API_BASE_URL}/api/v1/team-puzzles/team/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('📦 Team puzzles response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch team puzzles');
    }

    console.log('✅ Team puzzles received:', data.data);
    return data.data; 
  } catch (error) {
    console.error('❌ Error fetching team puzzles:', error);
    throw error;
  }
};


export const submitPuzzleAnswer = async (teamId, puzzleId, answer) => {
  try {
    console.log(`📝 Submitting answer for puzzle ${puzzleId}...`);
    const response = await fetch(`${API_BASE_URL}/api/v1/team-puzzles/submit-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId,
        puzzleId,
        answer
      }),
    });

    const data = await response.json();
    console.log('📦 Submit answer response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit answer');
    }

    console.log('✅ Answer submitted successfully:', data);
    return data; 
  } catch (error) {
    console.error('❌ Error submitting answer:', error);
    throw error;
  }
};

export const saveTeamPuzzlesToLocalStorage = (teamId, puzzles) => {
  try {
    localStorage.setItem(`teamPuzzles_${teamId}`, JSON.stringify(puzzles));
    console.log(`💾 Team puzzles saved to localStorage for team ${teamId}`);
  } catch (error) {
    console.error('❌ Error saving team puzzles to localStorage:', error);
  }
};


export const getTeamPuzzlesFromLocalStorage = (teamId) => {
  try {
    const cached = localStorage.getItem(`teamPuzzles_${teamId}`);
    if (cached) {
      console.log(`📦 Team puzzles loaded from localStorage for team ${teamId}`);
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('❌ Error reading team puzzles from localStorage:', error);
    return null;
  }
};


export const clearTeamPuzzlesFromLocalStorage = (teamId) => {
  try {
    localStorage.removeItem(`teamPuzzles_${teamId}`);
    console.log(`🗑️ Team puzzles cleared from localStorage for team ${teamId}`);
  } catch (error) {
    console.error('❌ Error clearing team puzzles from localStorage:', error);
  }
};
