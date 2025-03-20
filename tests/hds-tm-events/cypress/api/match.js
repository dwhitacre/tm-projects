export const matchFinals = (weeklyId) => `${weeklyId}-finals`
export const matchSemifinalA = (weeklyId) => `${weeklyId}-semifinal-a`
export const matchSemifinalB = (weeklyId) => `${weeklyId}-semifinal-b`
export const matchSemifinalTiebreak = (weeklyId) => `${weeklyId}-semifinal-tiebreak`
export const matchQuarterFinalA = (weeklyId) => `${weeklyId}-quarterfinal-a`
export const matchQuarterFinalB = (weeklyId) => `${weeklyId}-quarterfinal-b`
export const matchQuarterFinalC = (weeklyId) => `${weeklyId}-quarterfinal-c`
export const matchQuarterFinalD = (weeklyId) => `${weeklyId}-quarterfinal-d`
export const matchQuarterFinalTiebreakA = (weeklyId) => `${weeklyId}-quarterfinal-tiebreak-a`
export const matchQuarterFinalTiebreakB = (weeklyId) => `${weeklyId}-quarterfinal-tiebreak-b`
export const matchQuarterFinalTiebreakC = (weeklyId) => `${weeklyId}-quarterfinal-tiebreak-c`
export const matchQualifying = (weeklyId) => `${weeklyId}-qualifying`

export const matchResultAdd = ({ matchId, accountId, body, method = 'PUT' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}

export const matchResultUpdate = ({ matchId, accountId, score = 0, body, method = 'POST' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId, score },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}

export const matchResultAddAndUpdate = ({ matchId, accountId, score = 0 } = {}) => {
  return matchResultAdd({ matchId, accountId }).then(() => {
    return matchResultUpdate({ matchId, accountId, score })
  })
}

export const matchResultAddAndUpdateMany = (matchId, accountIds, score = 100, idx = 0) => {
  return matchResultAddAndUpdate({ matchId, accountId: accountIds[idx], score }).then(() => {
    score += 100
    return idx < accountIds.length - 1 ? matchResultAddAndUpdateMany(matchId, accountIds, score, ++idx) : null 
  })
}

export const matchResultDelete = ({ matchId, accountId, body, method = 'DELETE' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}