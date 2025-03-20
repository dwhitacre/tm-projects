import {
  expect,
  test,
  setSystemTime,
  beforeEach,
  afterAll,
  describe,
} from "bun:test";
import Leaderboard, { LeaderboardScore } from "./leaderboard";
import type { JsonObject } from "./json";

beforeEach(() => setSystemTime());
afterAll(() => setSystemTime());

test("should construct with defaults", () => {
  const date = new Date(123);
  setSystemTime(date);
  const leaderboard = new Leaderboard();

  expect(leaderboard.leaderboardId).toEqual("-1");
  expect(leaderboard.name).toEqual("");
  expect(leaderboard.lastModified).toEqual(date);
});

test.each([
  [{}, { leaderboardId: "-1", lastModified: new Date(123), name: "" }],
  [
    { leaderboardId: "123" },
    { leaderboardId: "123", lastModified: new Date(123), name: "" },
  ],
  [
    {
      leaderboardId: "123",
      lastModified: "2020-01-01T00:00:00.000",
      name: "abc",
    },
    {
      leaderboardId: "123",
      lastModified: new Date("2020-01-01T00:00:00.000Z"),
      name: "abc",
    },
  ],
])("should create fromJson", (json: JsonObject, expected: JsonObject) => {
  setSystemTime(expected.lastModified);
  const leaderboard = Leaderboard.fromJson(json);

  expect(leaderboard.leaderboardId).toEqual(expected.leaderboardId);
  expect(leaderboard.name).toEqual(expected.name);
  expect(leaderboard.lastModified).toEqual(expected.lastModified);
});

test.each([null, undefined])("should throw fromJson", (json: unknown) => {
  setSystemTime(new Date());
  expect(() => Leaderboard.fromJson(json as JsonObject)).toThrowError();
});

test("should construct score with defaults", () => {
  const leaderboardScore = new LeaderboardScore("123", "234");

  expect(leaderboardScore.leaderboardId).toEqual("123");
  expect(leaderboardScore.accountId).toEqual("234");
  expect(leaderboardScore.score).toEqual(-1);
});

test.each([
  [
    { leaderboardId: "123", accountId: "234" },
    { leaderboardId: "123", accountId: "234", score: -1 },
  ],
  [
    { leaderboardId: "123", accountId: "234", score: 345 },
    { leaderboardId: "123", accountId: "234", score: 345 },
  ],
])("should create score fromJson", (json: JsonObject, expected: JsonObject) => {
  const leaderboardScore = LeaderboardScore.fromJson(json);

  expect(leaderboardScore.leaderboardId).toEqual(expected.leaderboardId);
  expect(leaderboardScore.accountId).toEqual(expected.accountId);
  expect(leaderboardScore.score).toEqual(expected.score);
});

test.each([
  null,
  undefined,
  {},
  { leaderboardId: "123" },
  { accountId: "234" },
])("should throw fromJson", (json: unknown) => {
  expect(() => LeaderboardScore.fromJson(json as JsonObject)).toThrowError();
});
