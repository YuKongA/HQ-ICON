import assert from "node:assert/strict";
import test from "node:test";
import { lookupApp, parseAppStoreInput, searchApp } from "../src/searchApp.js";

test("parses App Store links and IDs without changing ordinary searches", () => {
  assert.deepEqual(
    parseAppStoreInput("https://apps.apple.com/sg/app/siri/id6758482875?uo=4"),
    { id: "6758482875", country: "sg" },
  );
  assert.deepEqual(parseAppStoreInput("id6758482875"), {
    id: "6758482875",
    country: null,
  });
  assert.deepEqual(parseAppStoreInput("6758482875"), {
    id: "6758482875",
    country: null,
  });
  assert.equal(parseAppStoreInput("Siri"), null);
  assert.equal(parseAppStoreInput("https://example.com/app/id6758482875"), null);
});

test("looks up a specific app and ignores non-app results", async (t) => {
  let requestedUrl;
  t.mock.method(globalThis, "fetch", async (url) => {
    requestedUrl = new URL(url);
    return {
      ok: true,
      json: async () => ({
        resultCount: 2,
        results: [
          { trackId: 6758482875, kind: "software", artworkUrl512: "icon" },
          { trackId: 123, kind: "song", artworkUrl512: "cover" },
        ],
      }),
    };
  });

  const data = await lookupApp("6758482875", "sg");
  assert.equal(requestedUrl.pathname, "/lookup");
  assert.equal(requestedUrl.searchParams.get("id"), "6758482875");
  assert.equal(requestedUrl.searchParams.get("country"), "sg");
  assert.equal(data.resultCount, 1);
  assert.equal(data.results[0].trackId, 6758482875);
});

test("encodes search terms as query parameters", async (t) => {
  let requestedUrl;
  t.mock.method(globalThis, "fetch", async (url) => {
    requestedUrl = new URL(url);
    return { ok: true, json: async () => ({ resultCount: 0, results: [] }) };
  });

  await searchApp("Siri & Maps", "sg", "software", "18");
  assert.equal(requestedUrl.pathname, "/search");
  assert.equal(requestedUrl.searchParams.get("term"), "Siri & Maps");
  assert.equal(requestedUrl.searchParams.get("country"), "sg");
});
