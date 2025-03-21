import { afterAll, beforeAll, expect, test } from "bun:test";
import { Pool } from "pg";
import {
  mapCreate,
  medalTimesCreate,
  playerAdminCreate,
  playerCreate,
  playerWithPermissionCreate,
} from "./api";

let pool: Pool;

beforeAll(() => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
});

afterAll(async () => {
  await pool.end();
});

test("admin", async () => {
  const apikey = await playerWithPermissionCreate(pool, "admin");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map.mapUid;

  response = await playerCreate({ apikey });
  expect(response.status).toBe(200);
  const accountId = (await response.json()).player.accountId;

  response = await medalTimesCreate({ apikey, accountId, mapUid });
  expect(response.status).toBe(200);
});

test("apikey:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "apikey:manage");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("medaltimes:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "medaltimes:manage");
  let response = await fetch(`http://localhost:8084/me?api-key=${apikey}`);
  const accountId = (await response.json()).me.accountId;

  response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  const adminApiKey = await playerAdminCreate(pool);
  response = await mapCreate({ apikey: adminApiKey });
  const mapUid = (await response.json()).map.mapUid;

  response = await playerCreate({ apikey: adminApiKey });
  const otherAccountId = (await response.json()).player.accountId;

  response = await medalTimesCreate({
    apikey,
    accountId: otherAccountId,
    mapUid,
  });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey, mapUid, accountId });
  expect(response.status).toBe(200);
});

test("map:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "map:manage");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(200);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("zone:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "zone:manage");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("player:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "player:manage");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(200);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("view", async () => {
  const apikey = await playerWithPermissionCreate(pool, "view");

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("multiple - admin, view", async () => {
  const apikey = await playerWithPermissionCreate(pool, ["admin", "view"]);

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map.mapUid;

  response = await playerCreate({ apikey });
  expect(response.status).toBe(200);
  const accountId = (await response.json()).player.accountId;

  response = await medalTimesCreate({ apikey, accountId, mapUid });
  expect(response.status).toBe(200);
});

test("multiple - apikey:manage, zone:manage, view", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "apikey:manage",
    "zone:manage",
    "view",
  ]);

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(401);

  response = await playerCreate({ apikey });
  expect(response.status).toBe(401);

  response = await medalTimesCreate({ apikey });
  expect(response.status).toBe(401);
});

test("multiple - map:manage, player:manage, medaltimes:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "map:manage",
    "medaltimes:manage",
    "player:manage",
  ]);
  let response = await fetch(`http://localhost:8084/me?api-key=${apikey}`);
  const accountId = (await response.json()).me.accountId;

  response = await mapCreate({ apikey });
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map.mapUid;

  response = await playerCreate({ apikey });
  expect(response.status).toBe(200);

  response = await medalTimesCreate({ apikey, accountId, mapUid });
  expect(response.status).toBe(200);
});

test("multiple - map:manage, player:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "map:manage",
    "player:manage",
  ]);

  let response = await mapCreate({ apikey });
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map.mapUid;

  response = await playerCreate({ apikey });
  expect(response.status).toBe(200);
  const accountId = (await response.json()).player.accountId;

  response = await medalTimesCreate({ apikey, accountId, mapUid });
  expect(response.status).toBe(401);
});
