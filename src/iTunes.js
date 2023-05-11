import fetchJsonp from 'fetch-jsonp'

export async function expandShortLink(url) {
  const res = await fetch(url, { method: 'HEAD' })
  return res.url
}

export function searchAppById(id, country) {
  return fetchJsonp(`https://itunes.apple.com/lookup?id=${id}&country=${country}`).then(res => res.json())
}

export function searchIosApp(term, country, limit) {
  return fetchJsonp(`https://itunes.apple.com/search?term=${encodeURI(term)}&country=${country}&entity=software&limit=${limit}`).then(res => res.json())
}

export function searchMacApp(term, country, limit) {
  return fetchJsonp(`https://itunes.apple.com/search?term=${encodeURI(term)}&country=${country}&entity=macSoftware&limit=${limit}`).then(res => res.json())
}
