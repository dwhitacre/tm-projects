import { expect, test, mock } from "bun:test";
import handle from "./";
import ApiRequest from "../domain/apirequest";
import type { Services } from "../services";
import { Logger } from "../services/logger";

const services = {
  logger: new Logger(),
  db: { pool: { query: mock(async () => {}) } },
} as unknown as Services;

test("should handle when no paths match", async () => {
  const request = new Request("http://sub.domain.example/unknown");
  const apiRequest = new ApiRequest(request, services);

  const response = await handle(apiRequest);
  expect(response.complete().status).toEqual(404);
});

test("should handle when unhandled route error", async () => {
  const request = new Request("http://sub.domain.example/ready");
  const apiRequest = new ApiRequest(request, services);
  services.db.pool.query = mock(async () => {
    throw new Error("testerror");
  });

  const response = await handle(apiRequest);
  const completed = response.complete();
  expect(completed.status).toEqual(500);
  expect(response.req.error).toBeDefined();
});
