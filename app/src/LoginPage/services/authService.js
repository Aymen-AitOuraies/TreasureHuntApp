// API Base URL - Update this with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Player Login/Registration
 * @param {Object} playerData - Player data containing fullName and username
 * @returns {Promise<Object>} - Response with player data
 */
export const loginPlayer = async (playerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Failed to login',
        fieldsErrors: data.fieldsErrors || {},
      };
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error. Please check your connection.',
      fieldsErrors: {},
    };
  }
};

/**
 * Save player data to localStorage
 * @param {Object} playerData - Player data to store
 */
export const savePlayerToLocalStorage = (playerData) => {
  try {
    localStorage.setItem('player', JSON.stringify(playerData));
    localStorage.setItem('playerId', playerData.id.toString());
    localStorage.setItem('teamId', playerData.teamId?.toString() || '');
  } catch (error) {
    console.error('Failed to save player data to localStorage:', error);
  }
};

/**
 * Get player data from localStorage
 * @returns {Object|null} - Player data or null if not found
 */
export const getPlayerFromLocalStorage = () => {
  try {
    const playerData = localStorage.getItem('player');
    return playerData ? JSON.parse(playerData) : null;
  } catch (error) {
    console.error('Failed to get player data from localStorage:', error);
    return null;
  }
};

/**
 * Clear player data from localStorage (logout)
 */
export const clearPlayerFromLocalStorage = () => {
  try {
    localStorage.removeItem('player');
    localStorage.removeItem('playerId');
    localStorage.removeItem('teamId');
  } catch (error) {
    console.error('Failed to clear player data from localStorage:', error);
  }
};

/**
 * Check if player is logged in
 * @returns {boolean} - True if player data exists in localStorage
 */
export const isPlayerLoggedIn = () => {
  return getPlayerFromLocalStorage() !== null;
};
