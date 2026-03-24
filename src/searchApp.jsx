export async function searchApp(term, country, entity, limit) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURI(term)}&country=${country}&entity=${entity}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
