/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { mapGet, mapCreate } from '../api/map'

context('/api/map', () => {
  it('get map dne', () => {
    mapGet('000').then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  it('create map no adminkey', () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
    return cy
      .api({
        url: '/api/map',
        body: { mapUid },
        method: 'PUT',
        failOnStatusCode: false,
      })
      .then((response) => {
        expect(response.status).to.eq(403)
      })
  })

  it('create map bad method', () => {
    mapCreate({ method: 'POST' }).then((response) => {
      expect(response.status).to.eq(405)
    })
  })

  it('create map bad body', () => {
    mapCreate({
      body: faker.string.uuid(),
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create map no map uid', () => {
    mapCreate({
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create map tmio not found', () => {
    mapCreate({
      mapUid: '404',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create map tmio found no mapuid', () => {
    mapCreate({
      mapUid: '4000',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create map tmio found no name', () => {
    mapCreate({
      mapUid: '4001',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create map', () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
    mapCreate({
      mapUid,
    }).then((response) => {
      expect(response.status).to.eq(201)
      mapGet(mapUid).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.mapUid).to.eq(mapUid)
        expect(response.body.name).to.have.length.gt(0)
        expect(response.body.thumbnailUrl).to.length.gt(0)
      })
    })
  })

  it('get map list', () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
    mapCreate({
      mapUid,
    }).then(() => {
      mapGet(mapUid).then((response) => {
        const map = response.body
        delete map.status
        delete map.message

        return cy
          .api({
            url: '/api/map',
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

  it('create map repeat is an update', () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, '2000')
    mapCreate({
      mapUid,
    }).then((response) => {
      expect(response.status).to.eq(201)
      mapGet(mapUid).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.mapUid).to.eq(mapUid)
        expect(response.body.name).to.have.length.gt(0)
        const name = response.body.name
        mapCreate({
          mapUid,
        }).then((response) => {
          expect(response.status).to.eq(201)
          mapGet(mapUid).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.mapUid).to.eq(mapUid)
            expect(response.body.name).to.have.length.gt(0)

            expect(response.body.name).not.to.eq(name)
          })
        })
      })
    })
  })
})
