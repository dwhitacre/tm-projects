import { expect, test } from "bun:test";
import ApiRequest, { type ApiMethods, type ApiPermissions } from "./apirequest";
import { Logger } from "../services/logger";
import type { Services } from "../services";

const services = {
  logger: new Logger(),
} as Services;

test("should construct with defaults", () => {
  const request = new Request("http://sub.domain.example");
  const apiRequest = new ApiRequest(request, services);

  expect(apiRequest.raw).toEqual(request);
  expect(apiRequest.services).toEqual(services);
  expect(apiRequest.logger).toBeInstanceOf(Logger);
  expect(apiRequest.start).toBeNumber();
  expect(apiRequest.error).toBeUndefined();
  expect(apiRequest.url).toBeInstanceOf(URL);
  expect(apiRequest.permissions).toEqual(["read"]);
  expect(apiRequest.subdomains).toEqual(["sub", "domain", "example"]);
  expect(apiRequest.method).toEqual("get");
  expect(apiRequest.paths).toEqual([]);
});

test.each([
  [
    "read default",
    new Request("http://sub.domain.example"),
    "testkey",
    ["read"],
  ],
  [
    "admin header x-api-key",
    new Request("http://sub.domain.example", {
      headers: { "x-api-key": "testkey" },
    }),
    "testkey",
    ["read", "admin"],
  ],
  [
    "admin queryParam api-key",
    new Request("http://sub.domain.example?api-key=testkey"),
    "testkey",
    ["read", "admin"],
  ],
  [
    "bad header x-api-key",
    new Request("http://sub.domain.example", {
      headers: { "x-api-key": "badkey" },
    }),
    "testkey",
    ["read"],
  ],
  [
    "bad queryParam api-key",
    new Request("http://sub.domain.example?api-key=badkey"),
    "testkey",
    ["read"],
  ],
  [
    "noenv header x-api-key",
    new Request("http://sub.domain.example", {
      headers: { "x-api-key": "" },
    }),
    "",
    ["read"],
  ],
  [
    "noenv queryParam api-key",
    new Request("http://sub.domain.example?api-key="),
    "",
    ["read"],
  ],
  [
    "noenv undefined",
    new Request("http://sub.domain.example"),
    undefined,
    ["read"],
  ],
])("should be able get permissions: %s", (_, request, adminkey, expected) => {
  process.env.ADMIN_KEY = adminkey;
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.permissions).toEqual(expected as Array<ApiPermissions>);
});

test.each([
  ["https://sub.domain.example/api", ["sub", "domain", "example"]],
  ["https://localhost/api", ["localhost"]],
  ["https://sub.domain.example/ap.i", ["sub", "domain", "example"]],
])("should be able to get subdomains: %s", (url, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.subdomains).toEqual(expected);
});

test.each([
  [undefined, "get"],
  ["get", "get"],
  ["post", "post"],
  ["POST", "post"],
  ["delete", "delete"],
])("should be able to get method: %s", (method, expected) => {
  const request = new Request("https://sub.domain.example", { method });
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.method).toEqual(expected as ApiMethods);
});

test.each([
  ["https://sub.domain.example", []],
  ["https://sub.domain.example/", []],
  ["https://sub.domain.example/api", ["api"]],
  ["https://sub.domain.example/api/", ["api"]],
  ["https://sub.domain.example/api////", ["api"]],
  ["https://sub.domain.example/api/1/2/3/4", ["api", "1", "2", "3", "4"]],
  ["https://sub.domain.example/api%2Fpath", ["api%2Fpath"]],
])("should be able to get paths: %s", (url, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.paths).toEqual(expected);
});

test.each([
  ["https://sub.domain.example", "param", undefined],
  ["https://sub.domain.example?", "param", undefined],
  ["https://sub.domain.example?param", "param", ""],
  ["https://sub.domain.example?param=test", "param", "test"],
  ["https://sub.domain.example?param=test&param=x", "param", "test"],
  ["https://sub.domain.example?paran=test", "param", undefined],
  ["https://sub.domain.example?something=false&param=test", "param", "test"],
])("should be able to getQueryParam: %s %s", (url, param, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect<string | undefined>(apiRequest.getQueryParam(param)).toEqual(expected);
});

test.each([
  ["https://sub.domain.example", "/", "param", undefined],
  ["https://sub.domain.example/api", "/api", "param", undefined],
  ["https://sub.domain.example/api", "/{param}", "param", "api"],
  ["https://sub.domain.example/api", "/{param}", "none", undefined],
  ["https://sub.domain.example/api/", "/{param}", "param", "api"],
  ["https://sub.domain.example/api///", "/{param}", "param", "api"],
  ["https://sub.domain.example/api/1", "/api/{param}", "param", "1"],
  ["https://sub.domain.example/api/", "/api/{param}", "param", undefined],
  [
    "https://sub.domain.example/api/123123123",
    "/api/{param}",
    "param",
    "123123123",
  ],
  [
    "https://sub.domain.example/api/1/2/3",
    "/api/{param1}/{param2}/{param3}",
    "param1",
    "1",
  ],
  [
    "https://sub.domain.example/api/1/2/3",
    "/api/{param1}/{param2}/{param3}",
    "param2",
    "2",
  ],
  [
    "https://sub.domain.example/api/1/2/3",
    "/api/{param1}/{param2}/{param3}",
    "param3",
    "3",
  ],
  [
    "https://sub.domain.example/api/1/2/3",
    "/api/{param1}/2/{param3}",
    "param1",
    "1",
  ],
  [
    "https://sub.domain.example/api/1/2/3",
    "/api/{param1}/2/{param3}",
    "param3",
    "3",
  ],
])(
  "should be able to getPathParam: %s %s %s %s",
  (url, path, pathParam, expected) => {
    const request = new Request(url);
    const apiRequest = new ApiRequest(request, services);
    apiRequest.checkPath(path);
    expect<string | undefined>(apiRequest.getPathParam(pathParam)).toEqual(
      expected
    );
  }
);

test.each([
  ["single method true", "post", "post", true],
  ["single method false", "post", "get", false],
  ["many methods true", "post", ["get", "post"], true],
  ["many methods false", "post", ["get", "put"], false],
])("should be able to checkMethod: %s", (_, method, allowed, expected) => {
  const request = new Request("https://sub.domain.example", { method });
  const apiRequest = new ApiRequest(request, services);
  expect(
    apiRequest.checkMethod(allowed as Array<ApiMethods> | ApiMethods)
  ).toEqual(expected);
});

test.each([
  ["https://sub.domain.example", "read", true],
  ["https://sub.domain.example?api-key=test", "read", true],
  ["https://sub.domain.example", "admin", false],
  ["https://sub.domain.example?api-key=test", "read", true],
])("should be able to checkPermission: %s", (url, permission, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.checkPermission(permission as ApiPermissions)).toEqual(
    expected
  );
});

test.each([
  ["https://sub.domain.example", "sub", true],
  ["https://sub.domain.example", "domain", false],
  ["https://sub.domain.example", "none", false],
  ["https://localhost", "localhost", true],
  ["https://localhost", "none", false],
])("should be able to checkSubdomain: %s %s", (url, subdomain, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.checkSubdomain(subdomain)).toEqual(expected);
});

test.each([
  ["https://sub.domain.example", "/", true],
  ["https://sub.domain.example/", "/", true],
  ["https://sub.domain.example/api", "/", false],
  ["https://sub.domain.example/api/", "/", false],
  ["https://sub.domain.example/api", "/api", true],
  ["https://sub.domain.example/api/", "/api", true],
  ["https://sub.domain.example/api", "api", true],
  ["https://sub.domain.example/api/", "api", true],
  ["https://sub.domain.example/api", "api/", true],
  ["https://sub.domain.example/api/", "api/", true],
  ["https://sub.domain.example/api", "/api/", true],
  ["https://sub.domain.example/api/", "/api/", true],
  ["https://sub.domain.example/api", "/none", false],
  ["https://sub.domain.example/api/", "/none", false],
  ["https://sub.domain.example/api/1/2/3/4", "/api/1/2/3/4", true],
  ["https://sub.domain.example/api/1/2/3/4/", "/api/1/2/3/4", true],
  ["https://sub.domain.example/api/1/2/3/4", "/api/1/3/2/4", false],
  ["https://sub.domain.example/api/1/2/3/4", "/api/1/2/3/5", false],
  ["https://sub.domain.example/api", "/{id}", true],
  ["https://sub.domain.example/api", "/{id", false],
  ["https://sub.domain.example/api", "/id}", false],
  ["https://sub.domain.example/api/", "/{}", false],
  ["https://sub.domain.example/api/1/2", "/api/{id}/2", true],
  ["https://sub.domain.example/api/1/2", "/api/{id}/3", false],
  ["https://sub.domain.example/api/1/2", "/api/{id}/{num}", true],
  ["https://sub.domain.example/api/1/2/", "/api/{id}/{num}", true],
  ["https://sub.domain.example/api/1/2/3", "/api/{id}/{num}", false],
  ["https://sub.domain.example/api", ["/api"], true],
  ["https://sub.domain.example/api", ["/some", "/api"], true],
  ["https://sub.domain.example/api", ["/some", "/none"], false],
])("should be able to checkPath: %s %s %p", (url, path, expected) => {
  const request = new Request(url);
  const apiRequest = new ApiRequest(request, services);
  expect(apiRequest.checkPath(path)).toEqual(expected);
});

test("should be able to parse domain", async () => {
  class Domain {
    static fromJson(_: { [_: string]: any }) {
      return new Domain();
    }
  }

  const request = new Request("https://sub.domain.example", {
    body: '{ "key": "value" }',
  });
  const apiRequest = new ApiRequest(request, services);

  expect(await apiRequest.parse(Domain)).toBeInstanceOf(Domain);
});

test("should parse as undefined if body not json", async () => {
  class Domain {
    static fromJson(_: { [_: string]: any }) {
      return new Domain();
    }
  }

  const request = new Request("https://sub.domain.example", {
    body: "test",
  });
  const apiRequest = new ApiRequest(request, services);

  expect(await apiRequest.parse(Domain)).toBeUndefined();
});

test("should parse as undefined if domain fromJson throws", async () => {
  class Domain {
    static fromJson(json: { [_: string]: any }) {
      if (json) throw new Error("failed");
      return new Domain();
    }
  }

  const request = new Request("https://sub.domain.example", {
    body: '{ "key": "value" }',
  });
  const apiRequest = new ApiRequest(request, services);

  expect(await apiRequest.parse(Domain)).toBeUndefined();
});
