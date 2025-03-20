import { expect, test } from "bun:test";
import Json, { type JsonAny } from "./json";

test.each([
  [{}, {}],
  [{ key: "value" }, { key: "value" }],
  [{ Key: "value" }, { key: "value" }],
  [{ KEY: "value" }, { key: "value" }],
  [{ KEY: null }, { key: null }],
  [{ KEY: undefined }, { key: undefined }],
  [{ KEY: new Date(123) }, { key: new Date(123) }],
  [{ KEY: false }, { key: false }],
  [{ keY: "value" }, { key: "value" }],
  [{ key: "VALUE" }, { key: "VALUE" }],
  [
    { KEY_1: "value1", KEY_2: "value2", KEY_3: "value3" },
    { key_1: "value1", key_2: "value2", key_3: "value3" },
  ],
  [
    { KEY_1: { KEY_2: { KEY_3: "value3" } } },
    { key_1: { key_2: { key_3: "value3" } } },
  ],
  [
    { KEY_1: [{ KEY_2: { KEY_3: "value3" } }] },
    { key_1: [{ key_2: { key_3: "value3" } }] },
  ],
])("should be able to lowercaseKeys: %j", (json, expected) => {
  expect(Json.lowercaseKeys(json)).toEqual(expected);
});

test.each([
  [{}, "pre", {}],
  [{ pre_key: "value" }, "pre", { key: "value" }],
  [{ pre_key: null }, "pre", { key: null }],
  [{ pre_key: undefined }, "pre", { key: undefined }],
  [{ pre_key: false }, "pre", { key: false }],
  [{ some_key: "value" }, "pre", {}],
  [{ pre_key: "value" }, "pre_", {}],
  [{ other_key: "other", pre_key: "value" }, "pre", { key: "value" }],
  [
    { pre_key1: "value1", pre_key2: "value2", pre_key3: "value3" },
    "pre",
    { key1: "value1", key2: "value2", key3: "value3" },
  ],
  [
    { pre_key1: { pre_key2: { pre_key3: "value3" } } },
    "pre",
    { key1: { key2: { key3: "value3" } } },
  ],
  [
    { pre_key1: [{ pre_key2: { pre_key3: "value3" } }] },
    "pre",
    { key1: [{ key2: { key3: "value3" } }] },
  ],
])("should be able to onlyPrefixedKeys: %j %s", (json, prefix, expected) => {
  expect(Json.onlyPrefixedKeys(json, prefix)).toEqual(expected);
});

test.each([
  [{}, {}, {}],
  [1, {}, {}],
  [{}, 1, {}],
  [undefined, {}, {}],
  [{}, undefined, {}],
  [{ key1: 1 }, { key2: 2 }, { key1: 1, key2: 2 }],
  [{ key1: 1 }, { key1: 2 }, { key1: 2 }],
  [{ key1: { key2: 1 } }, { key1: { key2: 2 } }, { key1: { key2: 2 } }],
  [[{ key1: 1 }], [{ key1: 2 }], [{ key1: 2 }]],
  [[{ key1: 1 }], [undefined], [{ key1: 1 }]],
  [[undefined], [{ key1: 2 }], [{ key1: 2 }]],
])("should be able to merge: %j %j", (jsonA, jsonB, expected) => {
  expect(Json.merge(jsonA as JsonAny, jsonB as JsonAny)).toEqual(expected);
});

test.each([
  [[], [{}]],
  [[{}], []],
  [[{}, {}, {}], [{}]],
])("should throw on merge: %j %j", (jsonA, jsonB) => {
  expect(() => Json.merge(jsonA as JsonAny, jsonB as JsonAny)).toThrowError();
});

test.each([
  [[], "", {}],
  [[], "key", {}],
  [[{ key: "value" }], "key", { value: [{ key: "value" }] }],
  [
    [{ key: "value1" }, { key: "value2" }],
    "key",
    { value1: [{ key: "value1" }], value2: [{ key: "value2" }] },
  ],
  [
    [{ key: "value1" }, { key: "value1" }],
    "key",
    { value1: [{ key: "value1" }, { key: "value1" }] },
  ],
  [
    [
      { key: "value2" },
      { key: "value1" },
      { key: "value2" },
      { key: "value1" },
      { key: "value4" },
    ],
    "key",
    {
      value1: [{ key: "value1" }, { key: "value1" }],
      value2: [{ key: "value2" }, { key: "value2" }],
      value4: [{ key: "value4" }],
    },
  ],
])("should be able to groupBy: %j %s", (json, key, expected) => {
  expect(Json.groupBy(json, key)).toEqual(expected);
});

test.each([
  ["", {}],
  ["{}", {}],
  ["{", {}],
  ["}", {}],
  ['{"key":"value"}', { key: "value" }],
  ['{"key":value}', {}],
])("should be able to safeParse: %s", (s, expected) => {
  expect<{ [_: string]: any } | undefined>(Json.safeParse(s)).toEqual(expected);
});
