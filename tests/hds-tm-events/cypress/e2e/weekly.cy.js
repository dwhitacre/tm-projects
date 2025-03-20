/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { fakeWeeklyId, weeklyCreate, weeklyMapAdd, weeklyMapDelete } from '../api/weekly'
import { leaderboardCreateAndCreateAndAddWeekly } from '../api/leaderboard'
import { mapCreate, mapGet } from '../api/map'

context('/api/weekly', () => {
  it('create weekly bad method', () => {
    weeklyCreate({ method: 'POST' }).then((response) => {
      expect(response.status).to.eq(405)
    })
  })

  it('create weekly bad body', () => {
    weeklyCreate({
      body: fakeWeeklyId(),
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create weekly no weekly id', () => {
    weeklyCreate({
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create a weekly', () => {
    weeklyCreate().then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})

context('/api/weekly/{weeklyId}/map', () => {
  context('put', () => {
    it('add weeklyMap no admin key', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          return cy
            .api({
              url: `/api/weekly/${weeklyId}/map`,
              body: { mapUid },
              method: 'PUT',
              failOnStatusCode: false,
            })
            .then((response) => {
              expect(response.status).to.eq(403)
            })
        })
      })
    })

    it('add weeklyMap weekly dne', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      mapCreate({ mapUid }).then(() => {
        weeklyMapAdd({ weeklyId: faker.string.uuid(), mapUid }).then((response) => {
          expect(response.status).to.eq(400)
        })
      })
    })

    it('add weeklyMap bad body', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, body: mapUid }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add weeklyMap missing mapUid', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, body: {} }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add weeklyMap bad mapUid', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid: faker.string.uuid() }).then((response) => {
            expect(response.status).to.eq(400)
          })
        })
      })
    })

    it('add weeklyMap', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then((response) => {
            expect(response.status).to.eq(200)
          })
        })
      })
    })

    it('get weeklyMap list', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then((response) => {
            mapGet(mapUid).then((response) => {
              const map = {
                mapUid: response.body.mapUid,
                name: response.body.name,
                thumbnailUrl: response.body.thumbnailUrl,
              }
              return cy
                .api({
                  url: `/api/weekly/${weeklyId}/map`,
                  method: 'GET',
                  failOnStatusCode: false,
                })
                .then((response) => {
                  expect(response.status).to.eq(200)
                  expect(response.body).to.deep.include.members([map])
                })
            })
          })
        })
      })
    })

    it('get weeklyMap list no weekly maps', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        return cy
          .api({
            url: `/api/weekly/${weeklyId}/map`,
            method: 'GET',
            failOnStatusCode: false,
          })
          .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.deep.eq([])
          })
      })
    })
  })

  context('delete', () => {
    it('delete weeklyMap weekly dne', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then(() => {
            weeklyMapDelete({ weeklyId: faker.string.uuid(), mapUid }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete weeklyMap bad body', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then(() => {
            weeklyMapDelete({ weeklyId, body: mapUid }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete weeklyMap missing mapUid', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then(() => {
            weeklyMapDelete({ weeklyId, body: {} }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete weeklyMap bad mapUid', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then(() => {
            weeklyMapDelete({ weeklyId, mapUid: faker.string.uuid() }).then((response) => {
              expect(response.status).to.eq(400)
            })
          })
        })
      })
    })

    it('delete weeklyMap', () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
      const leaderboardId = faker.string.uuid()
      const weeklyId = fakeWeeklyId()

      leaderboardCreateAndCreateAndAddWeekly(leaderboardId, weeklyId).then(() => {
        mapCreate({ mapUid }).then(() => {
          weeklyMapAdd({ weeklyId, mapUid }).then(() => {
            weeklyMapDelete({ weeklyId, mapUid }).then((response) => {
              expect(response.status).to.eq(200)
            })
          })
        })
      })
    })
  })
})
