import { expect, test } from "bun:test";
import { TmApiClient } from "shared/clients/tmapi";

const client = new TmApiClient({
  baseUrl: "http://localhost:8083",
});

test("returns 200 on ready route", async () => {
  const response = await client._ready();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});

test("returns 200 on api ready route", async () => {
  const response = await client.ready();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});
