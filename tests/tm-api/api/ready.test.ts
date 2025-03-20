import { expect, test } from "bun:test";

test("returns 200 on ready route", async () => {
  const response = await fetch("http://localhost:8081/ready");
  expect(response.status).toEqual(200);
});

test("returns 200 on api ready route", async () => {
  const response = await fetch("http://localhost:8081/api/ready");
  expect(response.status).toEqual(200);
});
