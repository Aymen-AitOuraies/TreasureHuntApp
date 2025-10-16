
export const saveLeaderboardToLocalStorage = (leaderboard) => {
  try {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log('💾 Leaderboard saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving leaderboard to localStorage:', error);
  }
};


export const getLeaderboardFromLocalStorage = () => {
  try {
    const cached = localStorage.getItem('leaderboard');
    if (cached) {
      console.log('📦 Leaderboard loaded from localStorage');
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('❌ Error reading leaderboard from localStorage:', error);
    return null;
  }
};


export const clearLeaderboardFromLocalStorage = () => {
  try {
    localStorage.removeItem('leaderboard');
    console.log('🗑️ Leaderboard cleared from localStorage');
  } catch (error) {
    console.error('❌ Error clearing leaderboard from localStorage:', error);
  }
};
