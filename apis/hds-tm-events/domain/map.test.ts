import { expect, test } from "bun:test";
import Map from "./map";

test("should construct with defaults", () => {
  const map = new Map("123");

  expect(map.mapUid).toEqual("123");
  expect(map.tmioData).toEqual("{}");
  expect(map.name).toEqual("");
  expect(map.thumbnailUrl).toEqual("");
});

test.each([
  ["{}", { name: "", thumbnailUrl: "" }],
  [
    '{"name": "name", "thumbnailUrl": "url"}',
    { name: "name", thumbnailUrl: "url" },
  ],
  ['{"name": "name"}', { name: "name", thumbnailUrl: "" }],
  ['{"thumbnailUrl": "url"}', { name: "", thumbnailUrl: "url" }],
  ['{"name": 1, "thumbnailUrl": 2}', { name: "1", thumbnailUrl: "2" }],
  ['{"name": undefined, "thumbnailUrl": null}', { name: "", thumbnailUrl: "" }],
  [null, { name: "", thumbnailUrl: "" }],
])("should create fromJson with tmioData: %s", (tmioData, expected) => {
  const map = Map.fromJson({
    mapUid: "mapuid",
    tmioData,
  });

  expect(map.mapUid).toEqual("mapuid");
  expect(map.tmioData).toEqual(tmioData ?? "{}");
  expect(map.name).toEqual(expected.name);
  expect(map.thumbnailUrl).toEqual(expected.thumbnailUrl);
});
