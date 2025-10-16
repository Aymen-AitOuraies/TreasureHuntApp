const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getTeamByPlayerId = async (playerId) => {
  try {
    console.log(`🔍 Fetching team for player ID: ${playerId}`);
    console.log(`🌐 API URL: ${API_BASE_URL}/api/v1/teams/player/${playerId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/teams/player/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || 'Failed to fetch team');
    }

    console.log('✅ Team data received:', data.data);
    return data.data; 
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};


export const updateTeamName = async (teamId, newName) => {
  try {
    console.log(`✏️ Updating team ${teamId} name to: ${newName}`);
    const response = await fetch(`${API_BASE_URL}/api/v1/teams/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw {
        status: response.status,
        message: data.message || 'Failed to update team name',
        fieldsErrors: data.fieldsErrors || {},
      };
    }

    console.log('✅ Team updated successfully:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ Error updating team:', error);
    throw error;
  }
};


export const saveTeamToLocalStorage = (teamData) => {
  try {
    localStorage.setItem('team', JSON.stringify(teamData));
    localStorage.setItem('teamId', teamData.id.toString());
  } catch (error) {
    console.error('Failed to save team data to localStorage:', error);
  }
};


export const getTeamFromLocalStorage = () => {
  try {
    const teamData = localStorage.getItem('team');
    return teamData ? JSON.parse(teamData) : null;
  } catch (error) {
    console.error('Failed to get team data from localStorage:', error);
    return null;
  }
};


export const clearTeamFromLocalStorage = () => {
  try {
    localStorage.removeItem('team');
    localStorage.removeItem('teamId');
  } catch (error) {
    console.error('Failed to clear team data from localStorage:', error);
  }
};
