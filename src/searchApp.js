export function parseAppStoreInput(input) {
  const value = input.trim();
  if (/^(?:id)?\d{6,}$/i.test(value)) {
    return { id: value.replace(/^id/i, ""), country: null };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "apps.apple.com") {
    return null;
  }

  const id = url.pathname.match(/(?:^|\/)id(\d+)(?:\/|$)/i)?.[1];
  if (!id) return null;

  const country = url.pathname.match(/^\/([a-z]{2})(?:\/|$)/i)?.[1];
  return { id, country: country?.toLowerCase() || null };
}

async function fetchAppStore(path, params) {
  const res = await fetch(
    `https://itunes.apple.com/${path}?${new URLSearchParams(params)}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function searchApp(term, country, entity, limit) {
  return fetchAppStore("search", { term, country, entity, limit });
}

export async function lookupApp(id, country) {
  const data = await fetchAppStore("lookup", { id, country });
  const results = data.results.filter(
    (result) =>
      result.artworkUrl512 &&
      (result.kind === "software" || result.kind === "mac-software"),
  );
  return { ...data, resultCount: results.length, results };
}
