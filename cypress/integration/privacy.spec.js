it('Testa a página de política de privacidade separadamente', () => {
    cy.visit('./src/privacy.html')
    cy.contains('p', 'Talking About Testing').should('be.visible')
})