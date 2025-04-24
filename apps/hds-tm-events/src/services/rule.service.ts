import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Leaderboard } from 'src/domain/leaderboard'
import { Rule, RuleCategory, RuleResponse } from 'src/domain/rule'

@Injectable({ providedIn: 'root' })
export class RuleService {
  constructor(private httpClient: HttpClient) {}

  createRuleCategory(leaderboardId: Leaderboard['leaderboardId'], ruleCategory: Partial<RuleCategory> = {}) {
    return this.httpClient.put(`api/rulecategory`, {
      leaderboardId,
      ...ruleCategory,
    })
  }

  updateRuleCategory(
    leaderboardId: Leaderboard['leaderboardId'],
    ruleCategoryId: RuleCategory['ruleCategoryId'],
    ruleCategory: Partial<RuleCategory> = {},
  ) {
    return this.httpClient.post(`/api/rulecategory`, {
      leaderboardId,
      ruleCategoryId,
      ...ruleCategory,
    })
  }

  deleteRuleCategory(leaderboardId: Leaderboard['leaderboardId'], ruleCategoryId: RuleCategory['ruleCategoryId']) {
    return this.httpClient.delete(`/api/rulecategory`, {
      body: {
        leaderboardId,
        ruleCategoryId,
      },
    })
  }

  createRule(ruleCategoryId: RuleCategory['ruleCategoryId'], rule: Partial<Rule> = {}) {
    return this.httpClient.put(`api/rule`, {
      ruleCategoryId,
      ...rule,
    })
  }

  updateRule(ruleCategoryId: RuleCategory['ruleCategoryId'], ruleId: Rule['ruleId'], rule: Partial<Rule> = {}) {
    return this.httpClient.post(`/api/rule`, {
      ruleCategoryId,
      ruleId,
      ...rule,
    })
  }

  deleteRule(ruleCategoryId: RuleCategory['ruleCategoryId'], ruleId: Rule['ruleId']) {
    return this.httpClient.delete(`/api/rule`, {
      body: {
        ruleCategoryId,
        ruleId,
      },
    })
  }

  getRules(leaderboardId: Leaderboard['leaderboardId']) {
    return this.httpClient.get<RuleResponse>(`/api/leaderboard/${leaderboardId}/rule`)
  }
}
