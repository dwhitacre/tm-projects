import { expect, test } from "bun:test";
import { client } from "./api";

test("returns 200 on ready route", async () => {
  const response = await client.ready();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});
