import { expect, test, mock } from "bun:test";
import ready from "./ready";
import ApiRequest from "../domain/apirequest";
import type { Services } from "../services";
import { Logger } from "../services/logger";

const services = {
  logger: new Logger(),
  db: { pool: { query: mock(async () => {}) } },
} as unknown as Services;

test("should handle ok", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = await ready.handle(apiRequest);
  expect(response.complete().status).toEqual(200);
});

test("should throw if db throws", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  services.db.pool.query = mock(async () => {
    throw new Error("testerror");
  });

  expect(ready.handle(apiRequest)).rejects.toThrow();
});
