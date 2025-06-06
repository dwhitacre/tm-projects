import { expect, test } from "bun:test";

test("returns 404 if unrecognized route", async () => {
  const response = await fetch("http://localhost:8082/unrecognized");
  expect(response.status).toEqual(404);
});
