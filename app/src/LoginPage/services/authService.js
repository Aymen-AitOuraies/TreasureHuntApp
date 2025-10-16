const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


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


export const savePlayerToLocalStorage = (playerData) => {
  try {
    localStorage.setItem('player', JSON.stringify(playerData));
    localStorage.setItem('playerId', playerData.id.toString());
    localStorage.setItem('teamId', playerData.teamId?.toString() || '');
  } catch (error) {
    console.error('Failed to save player data to localStorage:', error);
  }
};


export const getPlayerFromLocalStorage = () => {
  try {
    const playerData = localStorage.getItem('player');
    return playerData ? JSON.parse(playerData) : null;
  } catch (error) {
    console.error('Failed to get player data from localStorage:', error);
    return null;
  }
};


export const clearPlayerFromLocalStorage = () => {
  try {
    localStorage.removeItem('player');
    localStorage.removeItem('playerId');
    localStorage.removeItem('teamId');
  } catch (error) {
    console.error('Failed to clear player data from localStorage:', error);
  }
};


export const isPlayerLoggedIn = () => {
  return getPlayerFromLocalStorage() !== null;
};
