import { expect, test } from "bun:test";

test("returns 200 on campaign-indices route", async () => {
  const response = await fetch("http://localhost:8084/campaign-indices");
  expect(response.status).toEqual(200);

  const json = await response.json();

  expect(json.campaignIndices).toEqual({
    training: 0,
    "snow discovery": 1,
    "rally discovery": 2,
    "desert discovery": 3,
  });
});
