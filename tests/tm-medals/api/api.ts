import { faker } from "@faker-js/faker";
import type { Pool } from "pg";

export const mapGet = (_: Pool, mapUid: string) => {
  return fetch(`http://localhost:8084/maps?mapUid=${mapUid}`);
};

export const mapGetCampaign = (campaign: string) => {
  return fetch(`http://localhost:8084/maps?campaign=${campaign}`);
};

export const mapGetAll = () => {
  return fetch(`http://localhost:8084/maps`);
};

export const mapCreate = ({
  mapUid = faker.string.uuid(),
  authorTime = faker.number.int({ min: 1, max: 20000 }),
  name = faker.word.words(3),
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
  apikey,
}: {
  mapUid?: string;
  authorTime?: number;
  name?: string;
  body?: any;
  method?: string;
  headers?: any;
  apikey?: string;
} = {}) => {
  return fetch("http://localhost:8084/maps", {
    body: JSON.stringify(body ?? { mapUid, authorTime, name }),
    method,
    headers: apikey ? { "x-api-key": apikey } : headers,
  });
};

export const playerGet = (_: Pool, accountId: string) => {
  return fetch(`http://localhost:8084/players?accountId=${accountId}`);
};

export const playerGetAll = () => {
  return fetch(`http://localhost:8084/players`);
};

export const playerCreate = ({
  accountId = faker.string.uuid(),
  name = faker.internet.username(),
  color = "3F3",
  displayName,
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
  apikey,
}: {
  accountId?: string;
  name?: string;
  color?: string;
  displayName?: string;
  body?: any;
  method?: string;
  headers?: any;
  apikey?: string;
} = {}) => {
  return fetch("http://localhost:8084/players", {
    body: JSON.stringify(body ?? { accountId, name, color, displayName }),
    method,
    headers: apikey ? { "x-api-key": apikey } : headers,
  });
};

export const medalTimesGet = (accountId: string, mapUid: string) => {
  return fetch(
    `http://localhost:8084/medaltimes?accountId=${accountId}&mapUid=${mapUid}`
  );
};

export const medalTimesCreate = ({
  accountId = faker.string.uuid(),
  mapUid = faker.string.uuid(),
  medalTime = faker.number.int({ min: 1, max: 20000 }),
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
  apikey,
}: {
  accountId?: string;
  mapUid?: string;
  medalTime?: number;
  body?: any;
  method?: string;
  headers?: any;
  apikey?: string;
} = {}) => {
  return fetch("http://localhost:8084/medaltimes", {
    body: JSON.stringify(body ?? { accountId, mapUid, medalTime }),
    method,
    headers: apikey ? { "x-api-key": apikey } : headers,
  });
};

export const apikeyCreate = (
  pool: Pool,
  accountId: string,
  apikey = faker.string.uuid()
) => {
  return pool.query(
    `
      insert into ApiKeys(AccountId, Key)
      values ($1, $2)
    `,
    [accountId, apikey]
  );
};

export const playerPermissionsCreate = async (
  pool: Pool,
  accountId: string,
  permissionName: string
) => {
  const result = await pool.query(
    `
      select Id
      from Permissions
      where Name = $1
    `,
    [permissionName]
  );

  return pool.query(
    `
      insert into PlayerPermissions(AccountId, PermissionId)
      values ($1, $2)
    `,
    [accountId, result.rows[0].id]
  );
};

export const playerPermissionsDelete = async (
  pool: Pool,
  accountId: string,
  permissionName: string
) => {
  const result = await pool.query(
    `
      select Id
      from Permissions
      where Name = $1
    `,
    [permissionName]
  );

  return pool.query(
    `
      delete from PlayerPermissions
      where AccountId = $1 and PermissionId = $2
    `,
    [accountId, result.rows[0].id]
  );
};

export const playerWithPermissionCreate = async (
  pool: Pool,
  permission: Array<string> | string,
  accountId: string = faker.string.uuid()
) => {
  permission = permission instanceof Array ? permission : [permission];

  await pool.query(
    `
      insert into Players(AccountId, Name)
      values ($1, $2)
    `,
    [accountId, faker.internet.username()]
  );

  for (let i = 0; i < permission.length; i++) {
    await playerPermissionsCreate(pool, accountId, permission[i]);
  }

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  return apikey;
};

export const playerAdminCreate = async (
  pool: Pool,
  accountId: string = faker.string.uuid()
) => playerWithPermissionCreate(pool, "admin", accountId);
