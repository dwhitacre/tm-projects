import Json, { type JsonArray, type JsonObject } from "./json";

export class RuleCategory {
  ruleCategoryId: number = 0;
  leaderboardId: string;
  name: string = "";
  sortOrder: number = 0;
  isVisible: boolean = true;
  dateCreated?: Date;
  dateModified?: Date;
  rules: Array<Rule> = [];

  static fromJson(json: JsonObject): RuleCategory {
    json = Json.lowercaseKeys(json);
    if (!json?.leaderboardid) throw new Error("Failed to get leaderboardId");

    const ruleCategory = new RuleCategory(json.leaderboardid);
    if (json.rulecategoryid) ruleCategory.ruleCategoryId = json.rulecategoryid;
    if (json.name) ruleCategory.name = json.name;
    if (json.sortorder) ruleCategory.sortOrder = json.sortorder;
    if (typeof json.isvisible !== "undefined")
      ruleCategory.isVisible = json.isvisible;
    if (json.datecreated) ruleCategory.dateCreated = json.datecreated;
    if (json.datemodified) ruleCategory.dateModified = json.datemodified;

    return ruleCategory;
  }

  static compareFn(a: RuleCategory, b: RuleCategory): number {
    return a.sortOrder - b.sortOrder;
  }

  constructor(leaderboardId: string) {
    this.leaderboardId = leaderboardId;
  }

  hydrateRules(json: JsonArray): Rule[] {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "rule"));
    this.rules = json
      .filter((rule) => rule.ruleid > 0)
      .map((rule: JsonObject) => Rule.fromJson(rule));
    this.rules.sort(Rule.compareFn);
    return this.rules;
  }

  toJson(): JsonObject {
    return {
      ruleCategoryId: this.ruleCategoryId,
      leaderboardId: this.leaderboardId,
      name: this.name,
      sortOrder: this.sortOrder,
      isVisible: this.isVisible,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      rules: this.rules.map((rule: Rule) => rule.toJson()),
    };
  }
}

export class Rule {
  ruleId: number = 0;
  ruleCategoryId: number;
  content: string = "";
  sortOrder: number = 0;
  isVisible: boolean = true;
  dateCreated?: Date;
  dateModified?: Date;

  static fromJson(json: JsonObject): Rule {
    json = Json.lowercaseKeys(json);
    if (!json?.rulecategoryid) throw new Error("Failed to get ruleCategoryId");

    const rule = new Rule(json.rulecategoryid);
    if (json.ruleid) rule.ruleId = json.ruleid;
    if (json.content) rule.content = json.content;
    if (json.sortorder) rule.sortOrder = json.sortorder;
    if (typeof json.isvisible !== "undefined") rule.isVisible = json.isvisible;
    if (json.datecreated) rule.dateCreated = json.datecreated;
    if (json.datemodified) rule.dateModified = json.datemodified;

    return rule;
  }

  static compareFn(a: Rule, b: Rule): number {
    return a.sortOrder - b.sortOrder;
  }

  constructor(ruleCategoryId: number) {
    this.ruleCategoryId = ruleCategoryId;
  }

  toJson(): JsonObject {
    return {
      ruleId: this.ruleId,
      ruleCategoryId: this.ruleCategoryId,
      content: this.content,
      sortOrder: this.sortOrder,
      isVisible: this.isVisible,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
    };
  }
}
