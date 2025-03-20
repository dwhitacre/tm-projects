import { expect, test } from "bun:test";

test("returns 200 if admin on header", async () => {
  const response = await fetch("http://localhost:8081/api/admin", {
    headers: {
      "x-api-key": "developer-test-key",
    },
  });

  expect(response.status).toEqual(200);
});

test("returns 200 if admin on query param", async () => {
  const response = await fetch(
    "http://localhost:8081/api/admin?api-key=developer-test-key"
  );
  expect(response.status).toEqual(200);
});

test("returns 403 if no header nor query param", async () => {
  const response = await fetch("http://localhost:8081/api/admin");
  expect(response.status).toEqual(403);
});

test("returns 403 if bad header", async () => {
  const response = await fetch("http://localhost:8081/api/admin", {
    headers: {
      "x-api-key": "bad-key",
    },
  });
  expect(response.status).toEqual(403);
});

test("returns 403 if bad query param", async () => {
  const response = await fetch(
    "http://localhost:8081/api/admin?api-key=bad-key"
  );
  expect(response.status).toEqual(403);
});
