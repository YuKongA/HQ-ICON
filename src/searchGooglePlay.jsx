import axios from 'axios';

export async function searchGooglePlay(term, country, limit) {
  try {
    // Call the serverless function
    const res = await axios.get(`/api/google-play-search?term=${encodeURIComponent(term)}&country=${country}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error('Google Play search error:', error);
    return { results: [] };
  }
}
