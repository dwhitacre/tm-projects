import { faker } from '@faker-js/faker'

export const mapGet = (mapUid) => {
  return cy.api({
    url: `/api/map/${mapUid}`,
  })
}

export const mapCreate = ({ mapUid = faker.string.alphanumeric(18), body, method = 'PUT' } = {}) => {
  return cy.api({
    url: '/api/map',
    body: body ?? { mapUid },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key',
    },
  })
}

export const mapCreateMany = (mapUids = [], idx = 0) => {
  return mapCreate({ mapUid: mapUids[idx] }).then(() => {
    return idx < mapUids.length - 1 ? mapCreateMany(mapUids, ++idx) : null
  })
}
