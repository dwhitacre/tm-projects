import { faker } from "@faker-js/faker";

export const leaderboardGet = (leaderboardId: string) => {
  return fetch(`http://localhost:8083/api/leaderboard/${leaderboardId}`);
};

export const leaderboardCreate = ({
  body = {},
  method = "PUT",
}: {
  body?: any;
  method?: string;
} = {}) => {
  return fetch("http://localhost:8083/api/leaderboard", {
    body: JSON.stringify(body),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};

export const leaderboardScoreGet = ({
  leaderboardId = 999999999,
  accountId = faker.string.uuid(),
}: {
  leaderboardId?: number;
  accountId?: string;
  body?: any;
  method?: string;
} = {}) => {
  return fetch(
    `http://localhost:8083/api/leaderboard/${leaderboardId}/score/${accountId}`
  );
};

export const leaderboardScoreCreate = ({
  leaderboardId = faker.number.int(),
  body,
  method = "PUT",
}: { leaderboardId?: number; body?: any; method?: string } = {}) => {
  return fetch(`http://localhost:8083/api/leaderboard/${leaderboardId}/score`, {
    body: JSON.stringify(body),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};
