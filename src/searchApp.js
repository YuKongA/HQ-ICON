import fetchJsonp from 'fetch-jsonp'

export async function searchApp(term, country, entity, limit) {
  const res = await fetchJsonp(`https://itunes.apple.com/search?term=${encodeURI(term)}&country=${country}&entity=${entity}&limit=${limit}`)
  return await res.json()
}
