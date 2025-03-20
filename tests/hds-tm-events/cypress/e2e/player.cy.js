/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { playerGet, playerCreate, playerOverridesCreate } from '../api/player'

context('/api/player', () => {
  it('get player dne', () => {
    playerGet('000').then((response) => {
      expect(response.status).to.eq(204)
    })
  })

  it('create player no adminkey', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
    return cy
      .api({
        url: '/api/player',
        body: { accountId },
        method: 'PUT',
        failOnStatusCode: false,
      })
      .then((response) => {
        expect(response.status).to.eq(403)
      })
  })

  it('create player bad method', () => {
    playerCreate({ method: 'POST' }).then((response) => {
      expect(response.status).to.eq(405)
    })
  })

  it('create player bad body', () => {
    playerCreate({
      body: faker.string.uuid(),
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player no account id', () => {
    playerCreate({
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio not found', () => {
    playerCreate({
      accountId: '404',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio found no accountid', () => {
    playerCreate({
      accountId: '4000',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio found no displayname', () => {
    playerCreate({
      accountId: '4001',
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player top level flag', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)
      playerGet(accountId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accountId).to.eq(accountId)
        expect(response.body.name).to.have.length.gt(0)
        expect(response.body.image).to.match(/assets\/images\/.{3}\..{3}/)
        expect(response.body.twitch).to.have.length(0)
        expect(response.body.discord).to.have.length(0)
      })
    })
  })

  it('create player second level flag', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2001')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)
      playerGet(accountId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accountId).to.eq(accountId)
        expect(response.body.name).to.have.length.gt(0)
        expect(response.body.image).to.match(/assets\/images\/.{3}\..{3}/)
        expect(response.body.twitch).to.have.length(0)
        expect(response.body.discord).to.have.length(0)
      })
    })
  })

  it('create player third level flag', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2002')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)
      playerGet(accountId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accountId).to.eq(accountId)
        expect(response.body.name).to.have.length.gt(0)
        expect(response.body.image).to.match(/assets\/images\/.{3}\..{3}/)
        expect(response.body.twitch).to.have.length(0)
        expect(response.body.discord).to.have.length(0)
      })
    })
  })

  it('create player fourth level flag', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2003')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)
      playerGet(accountId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accountId).to.eq(accountId)
        expect(response.body.name).to.have.length.gt(0)
        expect(response.body.image).to.eq('')
        expect(response.body.twitch).to.have.length(0)
        expect(response.body.discord).to.have.length(0)
      })
    })
  })

  it('create player repeat is an update', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)
      playerGet(accountId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accountId).to.eq(accountId)
        expect(response.body.name).to.have.length.gt(0)
        const firstName = response.body.name
        playerCreate({
          accountId,
        }).then((response) => {
          expect(response.status).to.eq(201)
          playerGet(accountId).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.accountId).to.eq(accountId)
            expect(response.body.name).to.have.length.gt(0)

            expect(response.body.name).not.to.eq(firstName)
          })
        })
      })
    })
  })

  it('get player with overrides', () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, '2000')
    playerCreate({
      accountId,
    }).then((response) => {
      expect(response.status).to.eq(201)

      const name = faker.internet.userName()
      const image = 'assets/images/override.jpg'
      const twitch = 'override.tv'
      const discord = 'override.discord'

      playerOverridesCreate({
        accountId,
        name,
        image,
        twitch,
        discord,
      }).then(() => {
        playerGet(accountId).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.accountId).to.eq(accountId)
          expect(response.body.name).to.eq(name)
          expect(response.body.image).to.eq(image)
          expect(response.body.twitch).to.eq(twitch)
          expect(response.body.discord).to.eq(discord)
        })
      })
    })
  })
})
