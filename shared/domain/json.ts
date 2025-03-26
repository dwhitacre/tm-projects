export type JsonObject = { [_: string]: any };
export type JsonArray = Array<JsonObject>;
export type JsonAny = JsonObject | JsonArray;
export type JsonGroupedArray = { [_: string]: JsonArray };

export class Json {
  static lowercaseKeys(json: JsonArray): JsonArray;
  static lowercaseKeys(json: JsonObject): JsonObject;
  static lowercaseKeys(json: JsonAny): JsonAny {
    if (Array.isArray(json)) return json.map<JsonObject>(Json.lowercaseKeys);
    if (typeof json !== "object") return json;
    if (json == undefined) return json;

    return Object.fromEntries(
      Object.entries(json).map(([k, v]) => {
        return [k.toLowerCase(), Json.lowercaseKeys(v)];
      })
    );
  }

  static onlyPrefixedKeys(json: JsonArray, prefix: string): JsonArray;
  static onlyPrefixedKeys(json: JsonObject, prefix: string): JsonObject;
  static onlyPrefixedKeys(json: JsonAny, prefix: string): JsonAny {
    if (Array.isArray(json))
      return json.map((json) => Json.onlyPrefixedKeys(json, prefix));
    if (typeof json !== "object") return json;
    if (json == undefined) return json;

    return Object.fromEntries(
      Object.entries(json)
        .filter(([k, _]) => k.startsWith(`${prefix}_`))
        .map(([k, v]) => [
          `${k.replace(`${prefix}_`, "")}`,
          Json.onlyPrefixedKeys(v, prefix),
        ])
    );
  }

  static merge(jsonA: JsonArray, jsonB: JsonArray): JsonArray;
  static merge(jsonA: JsonObject, jsonB: JsonObject): JsonObject;
  static merge(jsonA: JsonAny, jsonB: JsonAny): JsonAny {
    if (Array.isArray(jsonA) && Array.isArray(jsonB)) {
      if (jsonA.length !== jsonB.length)
        throw new Error("Json.merge of Array's must be same length");
      return jsonA.map((jsonObjectA, idx) =>
        Json.merge(jsonObjectA, jsonB[idx])
      );
    }
    if (typeof jsonA !== "object" || jsonA == undefined) return jsonB;
    if (typeof jsonB !== "object" || jsonB == undefined) return jsonA;

    return { ...jsonA, ...jsonB };
  }

  static groupBy(json: JsonArray, key: string): JsonGroupedArray {
    return json.reduce((pv, cv) => {
      if (Array.isArray(cv)) Json.merge;
      if (pv[cv[key]]) pv[cv[key]].push(cv);
      else pv[cv[key]] = [cv];
      return pv;
    }, {});
  }

  static safeParse(s: string, def = {}): JsonAny {
    let parsed = def;
    try {
      parsed = JSON.parse(s);
    } catch (_) {}
    return parsed;
  }
}
