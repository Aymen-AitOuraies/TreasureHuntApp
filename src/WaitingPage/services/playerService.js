// // API Base URL
// const API_BASE_URL = process.env.REACT_APP_API_URL;

// /**
//  * Get all players from the REST API
//  * @returns {Promise<Array>} - Array of all players
//  */
// export const getAllPlayers = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/v1/players`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to fetch players');
//     }

//     // Return the data array from the ApiResponse
//     return data.data || [];
//   } catch (error) {
//     console.error('Error fetching players:', error);
//     throw error;
//   }
// };
