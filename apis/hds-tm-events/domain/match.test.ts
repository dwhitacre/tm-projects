import { expect, test, describe } from "bun:test";
import Match, { MatchResult } from "./match";
import type Player from "./player";

describe("matchresult", () => {
  test("should construct with defaults", () => {
    const matchResult = new MatchResult("123");

    expect(matchResult.accountId).toEqual("123");
    expect(matchResult.score).toEqual(0);
    expect(matchResult.player).toBeUndefined();
  });

  test.each([{}, { accountId: "" }])("should throw fromJson: %j", (json) => {
    expect(() => MatchResult.fromJson(json)).toThrowError();
  });

  test.each([
    [
      { accountId: "accountId" },
      { score: 0, accountId: "accountId", player: undefined },
    ],
    [
      { accountId: "accountId", score: 10 },
      { score: 10, accountId: "accountId", player: undefined },
    ],
  ])("should create fromJson: %j", (json, expected) => {
    const matchResult = MatchResult.fromJson(json);

    expect(matchResult.accountId).toEqual(expected.accountId);
    expect(matchResult.score).toEqual(expected.score);
    expect<Player | undefined>(matchResult.player).toEqual(expected.player);
  });

  test.each([[{}], [{ accountId: "" }]])(
    "should throw hydratePlayer: %j",
    (json) => {
      const matchResult = MatchResult.fromJson({ accountId: "accountId" });
      expect(() => matchResult.hydratePlayer(json)).toThrowError();
    }
  );

  test.each([
    [
      { accountId: "accountId" },
      {
        accountId: "accountId",
        tmioData: "{}",
        name: "",
        image: "",
        twitch: "",
        discord: "",
      },
    ],
    [
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "name",
        image: "assets/images/CDE.jpg",
        twitch: "",
        discord: "",
      },
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "name",
        image: "assets/images/CDE.jpg",
        twitch: "",
        discord: "",
      },
    ],
    [
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "otherName",
        image: "assets/images/custom.jpg",
        twitch: "twitch",
        discord: "discord",
      },
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "otherName",
        image: "assets/images/custom.jpg",
        twitch: "twitch",
        discord: "discord",
      },
    ],
    [
      {
        accountId: "accountId",
        player_tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        player_name: "name",
        player_image: "assets/images/CDE.jpg",
        player_twitch: "",
        player_discord: "",
      },
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "name",
        image: "assets/images/CDE.jpg",
        twitch: "",
        discord: "",
      },
    ],
    [
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "otherName",
        image: "assets/images/custom.jpg",
        twitch: "twitch",
        discord: "discord",
        player_tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        player_name: "name",
        player_image: "assets/images/CDE.jpg",
        player_twitch: "",
        player_discord: "",
      },
      {
        accountId: "accountId",
        tmioData:
          '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
        name: "name",
        image: "assets/images/CDE.jpg",
        twitch: "",
        discord: "",
      },
    ],
  ])("should hydratePlayer: %j", (json, expected) => {
    const matchResult = MatchResult.fromJson({ accountId: "accountId" });
    matchResult.hydratePlayer(json);

    expect(matchResult.player).toBeDefined();
    expect(matchResult.player!.accountId).toEqual("accountId");
    expect(matchResult.player!.tmioData).toEqual(expected.tmioData);
    expect(matchResult.player!.name).toEqual(expected.name);
    expect(matchResult.player!.image).toEqual(expected.image);
    expect(matchResult.player!.twitch).toEqual(expected.twitch);
    expect(matchResult.player!.discord).toEqual(expected.discord);
  });
});

describe("match", () => {
  test("should construct with defaults", () => {
    const match = new Match("123");

    expect(match.matchId).toEqual("123");
    expect(match.playersAwarded).toEqual(0);
    expect(match.pointsAwarded).toEqual(0);
    expect(match.results).toEqual([]);
    expect(match.pointsResults).toEqual([]);
  });

  test.each([{}, { matchId: "" }])("should throw fromJson: %j", (json) => {
    expect(() => Match.fromJson(json)).toThrowError();
  });

  test.each([
    [
      { matchId: "matchId" },
      {
        matchId: "matchId",
        playersAwarded: 0,
        pointsAwarded: 0,
        results: [],
        pointsResults: [],
      },
    ],
    [
      { matchId: "matchId", playersAwarded: 10 },
      {
        matchId: "matchId",
        playersAwarded: 10,
        pointsAwarded: 0,
        results: [],
        pointsResults: [],
      },
    ],
    [
      { matchId: "matchId", pointsAwarded: 10 },
      {
        matchId: "matchId",
        playersAwarded: 0,
        pointsAwarded: 10,
        results: [],
        pointsResults: [],
      },
    ],
    [
      {
        matchId: "matchId",
        playersAwarded: 9,
        pointsAwarded: 10,
        results: [MatchResult.fromJson({ accountId: "accountId " })],
        pointsResults: [MatchResult.fromJson({ accountId: "accountId " })],
      },
      {
        matchId: "matchId",
        playersAwarded: 9,
        pointsAwarded: 10,
        results: [],
        pointsResults: [],
      },
    ],
  ])("should create fromJson: %j", (json, expected) => {
    const match = Match.fromJson(json);

    expect(match.matchId).toEqual(expected.matchId);
    expect(match.playersAwarded).toEqual(expected.playersAwarded);
    expect(match.pointsAwarded).toEqual(expected.pointsAwarded);
    expect(match.results).toEqual(expected.results);
    expect(match.pointsResults).toEqual(expected.pointsResults);
  });

  test.each([[[{}]], [[{ accountId: "" }]]])(
    "should throw hydrateResults: %j",
    (json) => {
      const match = Match.fromJson({ matchId: "matchId" });
      expect(() => match.hydrateResults(json)).toThrowError();
    }
  );

  test.each([
    [
      [],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      { results: [] },
    ],
    [
      [{ matchId: "matchId", accountId: "accountId", score: 0 }],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        results: [
          {
            player: {
              accountId: "accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        {
          matchId: "matchId",
          accountId: "accountId",
          score: 0,
          matchResult_accountId: "mr_accountId",
          matchResult_score: 10,
        },
      ],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        results: [
          {
            player: {
              accountId: "mr_accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "mr_accountId",
            score: 10,
          },
        ],
      },
    ],
    [
      [
        {
          matchId: "matchId",
          accountId: "accountId",
          score: 10,
          tmioData:
            '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
          name: "otherName",
          image: "assets/images/custom.jpg",
          twitch: "twitch",
          discord: "discord",
        },
      ],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        results: [
          {
            player: {
              accountId: "accountId",
              discord: "discord",
              image: "assets/images/custom.jpg",
              name: "otherName",
              twitch: "twitch",
            },
            accountId: "accountId",
            score: 10,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        results: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 3,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 2,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 1,
          },
        ],
      },
    ],
  ])("should hydrateResults: %j", (json, matchJson, expected) => {
    const match = Match.fromJson(matchJson).hydrateResults(json);

    expect(match.results.map((result) => result.toJson())).toEqual(
      expected.results
    );
  });

  test.each([
    [
      [],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      { pointsResults: [] },
    ],
    [
      [{ matchId: "matchId", accountId: "accountId", score: 0 }],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        {
          matchId: "matchId",
          accountId: "accountId",
          score: 10,
          tmioData:
            '{ "displayname": "name", "trophies": { "zone": { "flag": "other", "parent": { "flag": "other", "parent": { "flag": "CDE" } } } } }',
          name: "otherName",
          image: "assets/images/custom.jpg",
          twitch: "twitch",
          discord: "discord",
        },
      ],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId",
              discord: "discord",
              image: "assets/images/custom.jpg",
              name: "otherName",
              twitch: "twitch",
            },
            accountId: "accountId",
            score: 0,
          },
        ],
      },
    ],
    [
      [{ matchId: "matchId", accountId: "accountId", score: 0 }],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 10 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId",
            score: 0,
          },
        ],
      },
    ],
    [
      [{ matchId: "matchId", accountId: "accountId", score: 1 }],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 10 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId",
            score: 20,
          },
        ],
      },
    ],
    [
      [{ matchId: "matchId", accountId: "accountId", score: 1 }],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 0 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        {
          matchId: "matchId",
          accountId: "accountId",
          score: 0,
          matchResult_accountId: "mr_accountId",
          matchResult_score: 10,
        },
      ],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 10 },
      {
        pointsResults: [
          {
            player: {
              accountId: "mr_accountId",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "mr_accountId",
            score: 20,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 0, playersAwarded: 0 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 0,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 0,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 0 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 0,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 0,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 1 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 20,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 0,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 2 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 20,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 20,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 0,
          },
        ],
      },
    ],
    [
      [
        { matchId: "matchId", accountId: "accountId1", score: 1 },
        { matchId: "matchId", accountId: "accountId2", score: 3 },
        { matchId: "matchId", accountId: "accountId3", score: 2 },
      ],
      { matchId: "matchId", pointsAwarded: 20, playersAwarded: 10 },
      {
        pointsResults: [
          {
            player: {
              accountId: "accountId2",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId2",
            score: 20,
          },
          {
            player: {
              accountId: "accountId3",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId3",
            score: 20,
          },
          {
            player: {
              accountId: "accountId1",
              discord: "",
              image: "",
              name: "",
              twitch: "",
            },
            accountId: "accountId1",
            score: 20,
          },
        ],
      },
    ],
  ])("should hydratePointsResults: %j", (json, matchJson, expected) => {
    const match = Match.fromJson(matchJson)
      .hydrateResults(json)
      .hydratePointsResults();

    expect(match.pointsResults.map((result) => result.toJson())).toEqual(
      expected.pointsResults
    );
  });
});
