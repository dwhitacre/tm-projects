import { faker } from "@faker-js/faker";

export const playerGet = (accountId: string) => {
  return fetch(`http://localhost:8081/api/player/${accountId}`);
};

export const playerCreate = ({
  accountId = faker.string.uuid(),
  body,
  method = "PUT",
}: {
  accountId?: string;
  body?: any;
  method?: string;
} = {}) => {
  return fetch("http://localhost:8081/api/player", {
    body: JSON.stringify(body ?? { accountId }),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};

export const playerOverride = ({
  accountId = faker.string.uuid(),
  body,
  method = "POST",
  overrides = {},
}: {
  accountId?: string;
  body?: any;
  method?: string;
  overrides?: any;
} = {}) => {
  return fetch("http://localhost:8081/api/player", {
    body: JSON.stringify(body ?? { accountId, ...overrides }),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};

export const leaderboardGet = (leaderboardId: string) => {
  return fetch(`http://localhost:8081/api/leaderboard/${leaderboardId}`);
};

export const leaderboardCreate = ({
  body = {},
  method = "PUT",
}: {
  body?: any;
  method?: string;
} = {}) => {
  return fetch("http://localhost:8081/api/leaderboard", {
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
    `http://localhost:8081/api/leaderboard/${leaderboardId}/score/${accountId}`
  );
};

export const leaderboardScoreCreate = ({
  leaderboardId = faker.number.int(),
  body,
  method = "PUT",
}: { leaderboardId?: number; body?: any; method?: string } = {}) => {
  return fetch(`http://localhost:8081/api/leaderboard/${leaderboardId}/score`, {
    body: JSON.stringify(body),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};
