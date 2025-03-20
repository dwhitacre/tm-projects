import { expect, test } from "bun:test";
import direct from "./direct";
import ApiRequest from "../domain/apirequest";
import type { Services } from "../services";
import { Logger } from "../services/logger";

const services = {
  logger: new Logger(),
} as Services;

test("should handle non get method", async () => {
  const request = new Request("http://join.domain.example", { method: "post" });
  const apiRequest = new ApiRequest(request, services);

  const response = await direct.handle(apiRequest);
  expect(response.complete().status).toEqual(400);
});

test("should handle unknown subdomain", async () => {
  const request = new Request("http://unknown.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = await direct.handle(apiRequest);
  expect(response.complete().status).toEqual(404);
});

test("should redirect join subdomain", async () => {
  const request = new Request("http://join.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = await direct.handle(apiRequest);
  const completed = response.complete();
  expect(completed.status).toEqual(302);
  expect(completed.headers.get("Location")).toEqual(
    "https://discord.gg/yR5EtqAWW7"
  );
});
