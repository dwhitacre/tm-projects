/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { playerCreate } from '../api/player'
import { matchResultAdd, matchResultDelete, matchResultUpdate, matchFinals } from '../api/match'
import { leaderboardCreateAndCreateAndAddWeekly } from '../api/leaderboard'
import { fakeWeeklyId } from '../api/weekly'

context('/api/match/{matchId}/matchresult', () => {
  context('put', () => {
    it('add matchresult match dne', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      playerCreate({ accountId }).then(() => {
        matchResultAdd({ matchId: faker.string.uuid(), accountId }).then((response) => {
          expect(response.status).to.eq(400)
        })
      })
    })

    it('add matchresult bad body', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), body: accountId }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add matchresult missing accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), body: {} }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add matchresult bad accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId: faker.string.uuid() }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add matchresult', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then((response) => {
            expect(response.status).to.eq(200)
          })
        })
      })
    })
  })

  context('post', () => {
    it('update matchresult match dne', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultUpdate({ matchId: faker.string.uuid(), accountId }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('update matchresult bad body', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultUpdate({ matchId: matchFinals(weeklyId), body: accountId }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('update matchresult missing accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultUpdate({ matchId: matchFinals(weeklyId), body: {} }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('update matchresult bad accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultUpdate({ matchId: matchFinals(weeklyId), accountId: faker.string.uuid() }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('update matchresult', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultUpdate({ matchId: matchFinals(weeklyId), accountId, score: 20 }).then((response) => {
              expect(response.status).to.eq(200)
            })
          })
        })
      })
    })
  })

  context('delete', () => {
    it('delete matchresult match dne', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultDelete({ matchId: faker.string.uuid(), accountId }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete matchresult bad body', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultDelete({ matchId: matchFinals(weeklyId), body: accountId }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete matchresult missing accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultDelete({ matchId: matchFinals(weeklyId), body: {} }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete matchresult bad accountId', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultDelete({ matchId: matchFinals(weeklyId), accountId: faker.string.uuid() }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete matchresult', () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        playerCreate({ accountId }).then(() => {
          matchResultAdd({ matchId: matchFinals(weeklyId), accountId }).then(() => {
            matchResultDelete({ matchId: matchFinals(weeklyId), accountId }).then((response) => {
              expect(response.status).to.eq(200)
            })
          })
        })
      })
    })
  })
})
