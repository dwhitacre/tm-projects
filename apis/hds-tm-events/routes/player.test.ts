import { expect, test, mock, beforeEach } from "bun:test";
import player from "./player";
import ApiRequest from "../domain/apirequest";
import type { Services } from "../services";
import { Logger } from "../services/logger";

let services: Services;
beforeEach(() => {
  services = {
    logger: new Logger(),
    player: {
      get: mock(async () => []),
      getAll: mock(async () => []),
      upsert: mock(async () => {}),
    },
    tmio: { getPlayer: mock(async () => ({})) },
  } as unknown as Services;
});

test("should handle non get/put method", async () => {
  const request = new Request("http://sub.domain.example", { method: "post" });
  const apiRequest = new ApiRequest(request, services);

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(405);
});

test("should handle get players", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = await player.handle(apiRequest);
  const completed = response.complete();
  expect(completed.status).toEqual(200);

  const json = await completed.json();
  expect(json).toEqual([]);
});

test("should handle put non admin", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=otherkey", {
    method: "put",
  });
  const apiRequest = new ApiRequest(request, services);

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(403);
});

test("should handle put no accountId", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=testkey", {
    method: "put",
    body: "{}",
  });
  const apiRequest = new ApiRequest(request, services);

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(400);
});

test("should handle put", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=testkey", {
    method: "put",
    body: '{ "accountId": "uid" }',
  });
  const apiRequest = new ApiRequest(request, services);

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(201);
});

test("should handle put tmio.getPlayer throws", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=testkey", {
    method: "put",
    body: '{ "accountId": "uid" }',
  });
  const apiRequest = new ApiRequest(request, services);
  services.tmio.getPlayer = mock(async () => {
    throw new Error("test error");
  });

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(400);
});

test("should handle put player.upsert throws", async () => {
  process.env.ADMIN_KEY = "testkey";
  const request = new Request("http://sub.domain.example?api-key=testkey", {
    method: "put",
    body: '{ "accountId": "uid" }',
  });
  const apiRequest = new ApiRequest(request, services);
  services.player.upsert = mock(async () => {
    throw new Error("test error");
  });

  const response = await player.handle(apiRequest);
  expect(response.complete().status).toEqual(400);
});
