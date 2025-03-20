import { faker } from '@faker-js/faker'
import { fakeWeeklyId, weeklyCreate } from './weekly'

export const leaderboardGet = (leaderboardId) => {
  return cy.api({
    url: `/api/leaderboard/${leaderboardId}`,
  })
}

export const leaderboardCreate = (values) => {
  values.lastModified ??= new Date().toISOString()
  values.campaignId ??= faker.number.int(99999999)
  values.clubId ??= faker.number.int(99999999)

  return cy.task('db', {
    query:
      'insert into Leaderboard (LeaderboardId, LastModified, CampaignId, ClubId) values (${leaderboardId}, ${lastModified}, ${campaignId}, ${clubId});',
    values,
  })
}

export const leaderboardAddWeekly = ({
  leaderboardId = faker.string.uuid(),
  weeklyId = fakeWeeklyId(),
  body,
  method = 'PATCH',
} = {}) => {
  return cy.api({
    url: '/api/leaderboard',
    body: body ?? {
      leaderboardId,
      weeklies: [
        {
          weekly: { weeklyId },
        },
      ],
    },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key',
    },
  })
}

export const leaderboardCreateAndAddWeekly = (leaderboardId, weeklyId) => {
  return weeklyCreate({ weeklyId }).then(() => leaderboardAddWeekly({ leaderboardId, weeklyId }))
}

export const leaderboardCreateAndCreateAndAddWeekly = (leaderboardId, weeklyId) => {
  return leaderboardCreate({ leaderboardId }).then(() => leaderboardCreateAndAddWeekly(leaderboardId, weeklyId))
}
