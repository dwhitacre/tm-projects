import type { Db } from "./db";
import { Rule, RuleCategory } from "../domain/rule";
import Json from "../domain/json";

export class RuleService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(leaderboardId: string): Promise<RuleCategory[]> {
    const result = await this.db.select(
      `
        select 
          rc.RuleCategoryId, 
          rc.LeaderboardId, 
          rc.Name, 
          rc.SortOrder, 
          rc.IsVisible, 
          rc.DateCreated, 
          rc.DateModified,
          r.RuleId as Rule_RuleId, 
          r.Content as Rule_Content, 
          r.SortOrder as Rule_SortOrder, 
          r.IsVisible as Rule_IsVisible, 
          r.DateCreated as Rule_DateCreated, 
          r.DateModified as Rule_DateModified
        from RuleCategory rc
        left join Rule r on rc.RuleCategoryId = r.RuleCategoryId
        where rc.LeaderboardId = $1
        order by rc.SortOrder, r.SortOrder
      `,
      [leaderboardId]
    );
    if (result.length === 0) return [];

    const ruleCategoriesJson = Json.groupBy(result, "rulecategoryid");
    const rulesCategories = Object.values(ruleCategoriesJson).map(
      (ruleCategory) => {
        const category = RuleCategory.fromJson(ruleCategory[0]);
        category.hydrateRules(ruleCategory);
        return category;
      }
    );
    rulesCategories.sort(RuleCategory.compareFn);
    return rulesCategories;
  }

  insertRuleCategory(ruleCategory: RuleCategory) {
    return this.db.insert(
      `
        insert into RuleCategory (LeaderboardId, Name, SortOrder, IsVisible)
        values ($1, $2, $3, $4)
      `,
      [
        ruleCategory.leaderboardId,
        ruleCategory.name,
        ruleCategory.sortOrder,
        ruleCategory.isVisible,
      ]
    );
  }

  updateRuleCategory(ruleCategory: RuleCategory) {
    return this.db.update(
      `
        update RuleCategory
        set Name=$2, SortOrder=$3, IsVisible=$4, DateModified=now()
        where LeaderboardId=$1 and RuleCategoryId=$5
      `,
      [
        ruleCategory.leaderboardId,
        ruleCategory.name,
        ruleCategory.sortOrder,
        ruleCategory.isVisible,
        ruleCategory.ruleCategoryId,
      ]
    );
  }

  deleteRuleCategory(ruleCategory: RuleCategory) {
    return this.db.delete(
      `
        delete from RuleCategory
        where LeaderboardId=$1 and RuleCategoryId=$2
      `,
      [ruleCategory.leaderboardId, ruleCategory.ruleCategoryId]
    );
  }

  insert(rule: Rule) {
    return this.db.insert(
      `
        insert into Rule (RuleCategoryId, Content, SortOrder, IsVisible)
        values ($1, $2, $3, $4)
      `,
      [rule.ruleCategoryId, rule.content, rule.sortOrder, rule.isVisible]
    );
  }

  update(rule: Rule) {
    return this.db.update(
      `
        update Rule
        set Content=$2, SortOrder=$3, IsVisible=$4, DateModified=now()
        where RuleCategoryId=$1 and RuleId=$5
      `,
      [
        rule.ruleCategoryId,
        rule.content,
        rule.sortOrder,
        rule.isVisible,
        rule.ruleId,
      ]
    );
  }

  delete(rule: Rule) {
    return this.db.delete(
      `
        delete from Rule
        where RuleCategoryId=$1 and RuleId=$2
      `,
      [rule.ruleCategoryId, rule.ruleId]
    );
  }
}

export default (db: Db) => new RuleService(db);
