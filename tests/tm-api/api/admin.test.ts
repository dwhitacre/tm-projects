import { beforeEach, expect, test } from "bun:test";
import { TmApiClient } from "shared/clients/tmapi";
import { ClientResponse } from "shared/domain/clientresponse";

const client = new TmApiClient({
  baseUrl: "http://localhost:8083",
});

beforeEach(() => {
  client.setApikey();
});

test("returns 200 if admin on header", async () => {
  client.setApikey("developer-test-key");

  const response = await client.checkAdmin();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});

test("returns 200 if admin on query param", async () => {
  const response = await client.httpGet<ClientResponse>(
    "/api/admin?api-key=developer-test-key"
  );
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});

test("returns 400 if bad method", async () => {
  const response = await client.httpPost<ClientResponse>("/api/admin", {});
  expect(response.status).toEqual(400);

  const json = await response.json();
  expect(json.status).toBe(400);
});

test("returns 403 if no header nor query param", async () => {
  const response = await client.checkAdmin();
  expect(response.status).toEqual(403);

  const json = await response.json();
  expect(json.status).toBe(403);
});

test("returns 403 if bad header", async () => {
  client.setApikey("bad-key");

  const response = await client.checkAdmin();
  expect(response.status).toEqual(403);

  const json = await response.json();
  expect(json.status).toBe(403);
});

test("returns 403 if bad query param", async () => {
  const response = await client.httpGet<ClientResponse>(
    "/api/admin?api-key=bad-key"
  );
  expect(response.status).toEqual(403);

  const json = await response.json();
  expect(json.status).toBe(403);
});
