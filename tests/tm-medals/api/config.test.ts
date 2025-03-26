import { expect, test } from "bun:test";
import type { ConfigResponse } from "shared/domain/config";

test("returns 200 on config route", async () => {
  const response = await fetch("http://localhost:8084/config");
  expect(response.status).toEqual(200);

  const json: ConfigResponse = await response.json();

  expect(json.config).toEqual({
    pbLoopEnabled: false,
    pbLoopInterval: 500,
    healthCheckEnabled: true,
    healthCheckMs: 300000,
  });
});
