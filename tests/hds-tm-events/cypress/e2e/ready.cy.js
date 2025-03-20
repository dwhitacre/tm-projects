/// <reference types="cypress" />

context('/ready', () => {
  it('always returns 200', () => {
    cy.api({
      url: '/ready',
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})

context('/api/ready', () => {
  it('always returns 200', () => {
    cy.api({
      url: '/api/ready',
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})
