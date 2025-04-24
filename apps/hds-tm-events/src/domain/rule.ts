export interface RuleCategory {
  ruleCategoryId: number
  leaderboardId: string
  name: string
  sortOrder: number
  isVisible: boolean
  dateCreated?: Date
  dateModified?: Date
  rules: Rule[]
}

export interface Rule {
  ruleId: number
  ruleCategoryId: number
  content: string
  sortOrder: number
  isVisible: boolean
  dateCreated?: Date
  dateModified?: Date
}

export interface RuleResponse {
  rules: RuleCategory[]
}
