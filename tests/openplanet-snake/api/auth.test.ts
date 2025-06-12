import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { faker } from "@faker-js/faker";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { SnakeClient } from "shared/clients/snake";
import type { IApikey } from "shared/domain/apikey";
import type { OpenplanetAuth } from "shared/domain/auth";

let db: Db;
let playerService: PlayerService;
const client = new SnakeClient({
  baseUrl: "http://localhost:8082",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://openplanetsnake:Passw0rd!@localhost:5432/openplanetsnake?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
});

beforeEach(() => {
  client.setApikey();
});

afterAll(async () => {
  await db.close();
});

describe("openplanet", () => {
  test("returns 400 for non-POST method", async () => {
    const response = await client.httpGet("/auth/openplanet");
    expect(response.status).toEqual(400);
  });

  test("returns 400 if no body provided", async () => {
    const response = await client.authOpenplanet(
      undefined as unknown as OpenplanetAuth
    );
    expect(response.status).toEqual(400);
  });

  test("returns 400 if body is not an object", async () => {
    const response = await client.authOpenplanet(
      "invalid" as unknown as OpenplanetAuth
    );
    expect(response.status).toEqual(400);
  });

  test("return 400 if body is an empty object", async () => {
    const response = await client.authOpenplanet(
      {} as unknown as OpenplanetAuth
    );
    expect(response.status).toEqual(400);
  });

  test("returns 400 if no token provided", async () => {
    const response = await client.authOpenplanet(
      {} as unknown as OpenplanetAuth
    );
    expect(response.status).toEqual(400);
  });

  test("returns 400 if token is not a string", async () => {
    const response = await client.authOpenplanet({
      token: 123 as unknown as string,
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if no body provided to openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "4220" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if empty body provided to openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5000" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if missing secret for openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5001" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if missing token for openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5002" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if bad secret for openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5003" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if bad token (not jwt) for openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5004" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 400 if bad token for openplanet", async () => {
    const response = await client.authOpenplanet({
      token: "5005" + faker.string.uuid(),
    });
    expect(response.status).toEqual(400);
  });

  test("returns 200", async () => {
    const response = await client.authOpenplanet({
      token: "2000" + faker.string.uuid(),
    });
    expect(response.status).toEqual(200);

    const json = await response.json();
    expect(json.apikey).toBeDefined();
    expect(json.apikey.accountId).toBeDefined();
    expect(json.apikey.key).toBeDefined();
  });
});
