import { expect, test } from "bun:test";
import Player from "./player";

test("should construct with defaults", () => {
  const player = new Player("123");

  expect(player.accountId).toEqual("123");
  expect(player.tmioData).toEqual("{}");
  expect(player.name).toEqual("");
  expect(player.image).toEqual("");
  expect(player.twitch).toEqual("");
  expect(player.discord).toEqual("");
});

test.each([
  ["{}", {}, { name: "", image: "", twitch: "", discord: "" }],
  [null, {}, { name: "", image: "", twitch: "", discord: "" }],

  // name
  [
    '{ "displayname": "name" }',
    {},
    { name: "name", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "displayname": "name" }',
    { name: "otherName" },
    { name: "otherName", image: "", twitch: "", discord: "" },
  ],

  // image
  [
    '{ "trophies": undefined }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": undefined } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": undefined } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "ABC" } } }',
    {},
    { name: "", image: "assets/images/ABC.jpg", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other" } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": undefined } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": undefined } } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "BCD" } } } }',
    {},
    { name: "", image: "assets/images/BCD.jpg", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other" } } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": undefined } } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": undefined } } } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
    {},
    { name: "", image: "assets/images/CDE.jpg", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "other" } } } } }',
    {},
    { name: "", image: "", twitch: "", discord: "" },
  ],
  [
    '{ "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
    { image: "assets/images/custom.png" },
    { name: "", image: "assets/images/custom.png", twitch: "", discord: "" },
  ],

  // twitch
  [
    "{}",
    { twitch: "twitch" },
    { name: "", image: "", twitch: "twitch", discord: "" },
  ],

  // discord
  [
    "{}",
    { discord: "discord" },
    { name: "", image: "", twitch: "", discord: "discord" },
  ],

  // all
  [
    '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
    {},
    { name: "name", image: "assets/images/CDE.jpg", twitch: "", discord: "" },
  ],
  [
    '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
    {
      name: "otherName",
      image: "assets/images/custom.png",
      twitch: "twitch",
      discord: "discord",
    },
    {
      name: "otherName",
      image: "assets/images/custom.png",
      twitch: "twitch",
      discord: "discord",
    },
  ],
])(
  "should create fromJson with tmioData: %s",
  (tmioData, overrides, expected) => {
    const player = Player.fromJson({
      accountId: "accountId",
      tmioData,
      ...overrides,
    });

    expect(player.accountId).toEqual("accountId");
    expect(player.tmioData).toEqual(tmioData ?? "{}");
    expect(player.name).toEqual(expected.name);
    expect(player.image).toEqual(expected.image);
    expect(player.twitch).toEqual(expected.twitch);
    expect(player.discord).toEqual(expected.discord);
  }
);
