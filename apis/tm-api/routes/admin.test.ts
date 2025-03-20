import { expect, test } from "bun:test";
import admin from "./admin";
import ApiRequest from "../domain/apirequest";
import type { Services } from "../services";
import { Logger } from "../services/logger";

const services = {
  logger: new Logger(),
} as Services;

test("should handle non get method", async () => {
  const request = new Request("http://sub.domain.example", { method: "post" });
  const apiRequest = new ApiRequest(request, services);

  const response = await admin.handle(apiRequest);
  expect(response.complete().status).toEqual(400);
});

test("should handle non admin", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=otherkey");
  const apiRequest = new ApiRequest(request, services);

  const response = await admin.handle(apiRequest);
  expect(response.complete().status).toEqual(403);
});

test("should handle admin", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=testkey");
  const apiRequest = new ApiRequest(request, services);

  const response = await admin.handle(apiRequest);
  expect(response.complete().status).toEqual(200);
});
