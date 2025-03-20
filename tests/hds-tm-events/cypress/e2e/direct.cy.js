/// <reference types="cypress" />

context('/', () => {
  it('returns 302 if join subdomain', () => {
    cy.api({
      url: '/',
      followRedirect: false,
      headers: {
        host: 'join.domain.example',
      },
    }).then((response) => {
      expect(response.status).to.eq(302)
    })
  })

  it('returns 404 if not a recognized subdomain', () => {
    cy.api({
      url: '/',
      failOnStatusCode: false,
      followRedirect: false,
      headers: {
        host: 'somethingelse.domain.example',
      },
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
