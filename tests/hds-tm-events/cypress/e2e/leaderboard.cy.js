/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import {
  leaderboardAddWeekly,
  leaderboardCreate,
  leaderboardCreateAndAddWeekly,
  leaderboardCreateAndCreateAndAddWeekly,
  leaderboardGet,
} from '../api/leaderboard'
import { fakeWeeklyId, weeklyCreate } from '../api/weekly'
import { playerCreateMany } from '../api/player'
import {
  matchQualifying,
  matchFinals,
  matchQuarterFinalA,
  matchQuarterFinalB,
  matchQuarterFinalC,
  matchQuarterFinalD,
  matchQuarterFinalTiebreakA,
  matchQuarterFinalTiebreakB,
  matchQuarterFinalTiebreakC,
  matchSemifinalA,
  matchSemifinalB,
  matchSemifinalTiebreak,
  matchResultAddAndUpdateMany,
} from '../api/match'

context('/api/leaderboard', () => {
  it('get leaderboard dne', () => {
    leaderboardGet('000').then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  // TODO would be better for this to not return 204
  it('get leaderboard with no weeklies', () => {
    const leaderboardId = faker.string.uuid()
    leaderboardCreate({ leaderboardId }).then(() => {
      leaderboardGet(leaderboardId).then((response) => {
        expect(response.status).to.eq(204)
      })
    })
  })

  it('add weekly to leaderboard bad method', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ leaderboardId, weeklyId, method: 'POST' }).then((response) => {
          expect(response.status).to.eq(405)
        })
      })
    })
  })

  it('add weekly to leaderboard bad body', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ body: leaderboardId }).then((response) => {
          expect(response.status).to.eq(400)
        })
      })
    })
  })

  it('add weekly to leaderboard no leaderboardId', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({
          body: {
            weeklies: [
              {
                weekly: { weeklyId },
              },
            ],
          },
        }).then((response) => {
          expect(response.status).to.eq(400)
        })
      })
    })
  })

  it('add weekly to leaderboard no weeklies', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({
          body: {
            leaderboardId,
            weeklies: [],
          },
        }).then((response) => {
          expect(response.status).to.eq(204)
        })
      })
    })
  })

  it('add weekly to leaderboard skip weekly with no id', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({
          body: {
            leaderboardId,
            weeklies: [{}],
          },
        }).then((response) => {
          expect(response.status).to.eq(201)
          leaderboardGet(leaderboardId).then((response) => {
            expect(response.status).to.eq(204)
          })
        })
      })
    })
  })

  it('add weekly to leaderboard leaderboardId dne', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ leaderboardId: faker.string.uuid(), weeklyId }).then((response) => {
          expect(response.status).to.eq(400)
          leaderboardGet(leaderboardId).then((response) => {
            expect(response.status).to.eq(204)
          })
        })
      })
    })
  })

  it('add weekly to leaderboard weeklyId dne', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ leaderboardId, weeklyId: faker.string.uuid() }).then((response) => {
          expect(response.status).to.eq(400)
          leaderboardGet(leaderboardId).then((response) => {
            expect(response.status).to.eq(204)
          })
        })
      })
    })
  })

  it('add weekly to leaderboard', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ leaderboardId, weeklyId }).then((response) => {
          expect(response.status).to.eq(201)
          leaderboardGet(leaderboardId).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.leaderboardId).to.eq(leaderboardId)
            expect(response.body.tops).to.be.null
            expect(response.body.playercount).to.eq(0)
            // TODO need better handling of players w/o tmio data
            // expect(response.body.players).to.have.length.gt(0)
            expect(new Date(response.body.lastModified)).above(faker.date.recent()).below(faker.date.soon())

            expect(response.body.weeklies).to.have.length(1)
            expect(response.body.weeklies[0]).to.have.property('weekly')
            expect(response.body.weeklies[0].published).to.be.true
            const weekly = response.body.weeklies[0].weekly
            expect(weekly.weeklyId).to.eq(weeklyId)
            expect(weekly.matches).to.have.length(12)
            expect(weekly.matches).to.deep.include.members([
              {
                match: {
                  matchId: matchFinals(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 4,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchSemifinalA(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchSemifinalB(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchSemifinalTiebreak(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 2,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalA(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalB(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalC(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalD(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalTiebreakA(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 3,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalTiebreakB(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 2,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQuarterFinalTiebreakC(weeklyId),
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 1,
                  pointsResults: [],
                },
              },
              {
                match: {
                  matchId: matchQualifying(weeklyId),
                  results: [],
                  playersAwarded: 8,
                  pointsAwarded: 1,
                  pointsResults: [],
                },
              },
            ])
          })
        })
      })
    })
  })

  it('add weekly to leaderboard multiple', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId1 = fakeWeeklyId()
    const weeklyId2 = fakeWeeklyId()
    const weeklyId3 = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      leaderboardCreateAndAddWeekly(leaderboardId, weeklyId1).then(() =>
        leaderboardCreateAndAddWeekly(leaderboardId, weeklyId2).then(() =>
          leaderboardCreateAndAddWeekly(leaderboardId, weeklyId3).then(() => {
            leaderboardGet(leaderboardId).then((response) => {
              expect(response.status).to.eq(200)
              expect(response.body.leaderboardId).to.eq(leaderboardId)
              expect(response.body.weeklies).to.have.length(3)
            })
          }),
        ),
      )
    })
  })

  it('add full week results', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()
    const accountIds = 'p'
      .repeat(10)
      .split('')
      .map(() => faker.string.uuid())
    leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
      playerCreateMany(accountIds).then(() => {
        matchResultAddAndUpdateMany(matchQualifying(weeklyId), accountIds).then(() => {
          matchResultAddAndUpdateMany(matchQuarterFinalA(weeklyId), accountIds.slice(2, 4), 0).then(() => {
            matchResultAddAndUpdateMany(matchQuarterFinalB(weeklyId), accountIds.slice(4, 6), 0).then(() => {
              matchResultAddAndUpdateMany(matchQuarterFinalC(weeklyId), accountIds.slice(6, 8), 0).then(() => {
                matchResultAddAndUpdateMany(matchQuarterFinalD(weeklyId), accountIds.slice(8, 10), 0).then(() => {
                  matchResultAddAndUpdateMany(matchQuarterFinalTiebreakA(weeklyId), accountIds.slice(8, 9), 1).then(
                    () => {
                      matchResultAddAndUpdateMany(matchQuarterFinalTiebreakB(weeklyId), accountIds.slice(6, 7), 1).then(
                        () => {
                          matchResultAddAndUpdateMany(
                            matchQuarterFinalTiebreakC(weeklyId),
                            accountIds.slice(4, 5),
                            1,
                          ).then(() => {
                            matchResultAddAndUpdateMany(
                              matchSemifinalA(weeklyId),
                              [accountIds[3], accountIds[5]],
                              0,
                            ).then(() => {
                              matchResultAddAndUpdateMany(
                                matchSemifinalB(weeklyId),
                                [accountIds[7], accountIds[9]],
                                0,
                              ).then(() => {
                                matchResultAddAndUpdateMany(matchSemifinalTiebreak(weeklyId), [accountIds[7]], 1).then(
                                  () => {
                                    matchResultAddAndUpdateMany(
                                      matchFinals(weeklyId),
                                      [accountIds[5], accountIds[9]],
                                      0,
                                    ).then(() => {
                                      leaderboardGet(leaderboardId).then((response) => {
                                        expect(response.status).to.eq(200)
                                        expect(response.body.leaderboardId).to.eq(leaderboardId)
                                        expect(response.body.campaignId).to.have.length.gt(0)
                                        expect(response.body.clubId).to.have.length.gt(0)
                                        expect(response.body.tops[0].player.accountId).to.eq(accountIds[9])
                                        expect(response.body.tops[0].score).to.eq(15)
                                        expect(response.body.tops[0].position).to.eq(1)
                                        expect(response.body.tops[1].player.accountId).to.eq(accountIds[5])
                                        expect(response.body.tops[1].score).to.eq(11)
                                        expect(response.body.tops[1].position).to.eq(2)
                                        expect(response.body.tops[2].player.accountId).to.eq(accountIds[7])
                                        expect(response.body.tops[2].score).to.eq(8)
                                        expect(response.body.tops[2].position).to.eq(3)
                                        expect(response.body.tops[3].player.accountId).to.eq(accountIds[3])
                                        expect(response.body.tops[3].score).to.eq(6)
                                        expect(response.body.tops[3].position).to.eq(4)
                                        expect(response.body.tops[4].player.accountId).to.eq(accountIds[8])
                                        expect(response.body.tops[4].score).to.eq(4)
                                        expect(response.body.tops[4].position).to.eq(5)
                                        expect(response.body.tops[5].player.accountId).to.eq(accountIds[6])
                                        expect(response.body.tops[5].score).to.eq(3)
                                        expect(response.body.tops[5].position).to.eq(6)
                                        expect(response.body.tops[6].player.accountId).to.eq(accountIds[4])
                                        expect(response.body.tops[6].score).to.eq(2)
                                        expect(response.body.tops[6].position).to.eq(7)
                                        expect(response.body.tops[7].player.accountId).to.eq(accountIds[2])
                                        expect(response.body.tops[7].score).to.eq(1)
                                        expect(response.body.tops[7].position).to.eq(8)
                                        expect(response.body.tops[8].player.accountId).to.be.oneOf([
                                          accountIds[0],
                                          accountIds[1],
                                        ])
                                        expect(response.body.tops[8].score).to.eq(0)
                                        expect(response.body.tops[8].position).to.eq(9)
                                        expect(response.body.tops[9].player.accountId).to.be.oneOf([
                                          accountIds[0],
                                          accountIds[1],
                                        ])
                                        expect(response.body.tops[9].score).to.eq(0)
                                        expect(response.body.tops[9].position).to.eq(9)
                                      })
                                    })
                                  },
                                )
                              })
                            })
                          })
                        },
                      )
                    },
                  )
                })
              })
            })
          })
        })
      })
    })
  })
})
