import { faker } from '@faker-js/faker'

export const playerGet = (accountId) => {
  return cy.api({
    url: `/api/player/${accountId}`
  })
}

export const playerCreate = ({ accountId = faker.string.uuid(), body, method = 'PUT' } = {}) => {
  return cy.api({
    url: '/api/player',
    body: body ?? { accountId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}

export const playerCreateMany = (accountIds = [], idx = 0) => {
  return playerCreate({ accountId: accountIds[idx] }).then(() => {
    return idx < accountIds.length - 1 ? playerCreateMany(accountIds, ++idx) : null 
  })
}

export const playerOverridesCreate = (values) => {
  return cy.task('db', {
    query: 'insert into PlayerOverrides (AccountId, Name, Image, Twitch, Discord) values (${accountId}, ${name}, ${image}, ${twitch}, ${discord});',
    values,
  })
}