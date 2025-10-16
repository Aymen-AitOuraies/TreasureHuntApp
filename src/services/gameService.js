const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


export const getCurrentGameState = async () => {
  try {
    console.log('🎮 Fetching current game state...');
    const response = await fetch(`${API_BASE_URL}/api/v1/game/state`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('📦 Game state response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch game state');
    }

    console.log('✅ Game state received:', data.data || data);
    return data.data || data; 
  } catch (error) {
    console.error('❌ Error fetching game state:', error);
    throw error;
  }
};

export const getGameSettings = async () => {
  try {
    console.log('⚙️ Fetching game settings...');
    const response = await fetch(`${API_BASE_URL}/api/v1/game/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('📦 Game settings response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch game settings');
    }

    console.log('✅ Game settings received:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error fetching game settings:', error);
    throw error;
  }
};


export const saveGameSettingsToLocalStorage = (settings) => {
  try {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save game settings to localStorage:', error);
  }
};


export const getGameSettingsFromLocalStorage = () => {
  try {
    const settings = localStorage.getItem('gameSettings');
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Failed to get game settings from localStorage:', error);
    return null;
  }
};
