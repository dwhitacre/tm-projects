/// <reference types="cypress" />

context('/api/admin', () => {
  it('returns 200 if admin', () => {
    cy.api({
      url: '/api/admin',
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(200)
    })
  })

  it('returns 403 if not admin no header', () => {
    cy.api({
      url: '/api/admin',
      failOnStatusCode: false,
      headers: {
      }
    }).then(response => {
      expect(response.status).to.eq(403)
    })
  })

  it('returns 403 if not admin bad header', () => {
    cy.api({
      url: '/api/admin',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'wrong-key'
      }
    }).then(response => {
      expect(response.status).to.eq(403)
    })
  })
})