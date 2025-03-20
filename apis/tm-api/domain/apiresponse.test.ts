import { expect, test } from "bun:test";
import ApiResponse from "./apiresponse";
import { Logger } from "../services/logger";
import ApiRequest from "./apirequest";
import type { Services } from "../services";

const services = {
  logger: new Logger(),
} as Services;

test("should construct with defaults", () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = new Response();
  const apiResponse = new ApiResponse(response, apiRequest);

  expect(apiResponse.raw).toEqual(response);
  expect(apiResponse.req).toEqual(apiRequest);
  expect(apiResponse.services).toEqual(services);
  expect(apiResponse.logger).toBeInstanceOf(Logger);
  expect(apiResponse.end).toBeUndefined();
});

test("should be able to complete", () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);

  const response = new Response();
  const apiResponse = new ApiResponse(response, apiRequest);

  expect(apiResponse.complete()).toEqual(response);
  expect(apiResponse.end).toBeNumber();
});

test("should be able create a newResponse", async () => {
  const response = ApiResponse.newResponse("message", 299);
  expect(await response.text()).toEqual('{"message":"message","status":299}');
  expect(response.status).toEqual(299);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able create a newResponse with properties", async () => {
  const response = ApiResponse.newResponse("message", 299, { prop: "value" });
  expect(await response.text()).toEqual(
    '{"message":"message","status":299,"prop":"value"}'
  );
  expect(response.status).toEqual(299);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a badRequest", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.badRequest(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Bad Request","status":400}'
  );
  expect(response.status).toEqual(400);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a unauthorized", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.unauthorized(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Unauthorized","status":401}'
  );
  expect(response.status).toEqual(401);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a forbidden", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.forbidden(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual('{"message":"Forbidden","status":403}');
  expect(response.status).toEqual(403);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a notFound", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.notFound(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual('{"message":"Not Found","status":404}');
  expect(response.status).toEqual(404);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a methodNotAllowed", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.methodNotAllowed(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Method Not Allowed","status":405}'
  );
  expect(response.status).toEqual(405);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a serverError", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.serverError(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Something unexpected occurred","status":500}'
  );
  expect(response.status).toEqual(500);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a ok", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.ok(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual('{"message":"Ok","status":200}');
  expect(response.status).toEqual(200);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a ok with properties", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.ok(apiRequest, { prop: "value" });

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Ok","status":200,"prop":"value"}'
  );
  expect(response.status).toEqual(200);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a ok raw properties", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.ok(apiRequest, { prop: "value" }, true);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual('{"prop":"value"}');
  expect(response.status).toEqual(200);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a created", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.created(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toEqual('{"message":"Created","status":201}');
  expect(response.status).toEqual(201);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a created with properties", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.created(apiRequest, { prop: "value" });

  const response = apiResponse.complete();
  expect(await response.text()).toEqual(
    '{"message":"Created","status":201,"prop":"value"}'
  );
  expect(response.status).toEqual(201);
  expect(response.headers.get("Content-Type")).toEqual("application/json");
});

test("should be able to get a noContent", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.noContent(apiRequest);

  const response = apiResponse.complete();
  expect(await response.text()).toBeEmpty();
  expect(response.status).toEqual(204);
});

test("should be able to get a redirect", async () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);
  const apiResponse = ApiResponse.redirect(
    apiRequest,
    "http://other.example.domain"
  );

  const response = apiResponse.complete();
  expect(response.status).toEqual(302);
  expect(response.headers.get("Location")).toEqual(
    "http://other.example.domain"
  );
});
