import axios from 'axios';

export async function searchApp(term, country, entity, limit) {
  const res = await axios.get(`https://app-store.yukonga.top/search?term=${encodeURI(term)}&country=${country}&entity=${entity}&limit=${limit}`);
  return res.data;
}