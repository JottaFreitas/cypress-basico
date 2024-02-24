
/*criação de comandos customizados...o primeiro a ser passado é o nome do comando, e logo após, 
o que a função deve executar.*/
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Josué')
    cy.get('#lastName').type('Freitas')
    cy.get('#email').type('josue.ofreitas@exemplo.com')
    cy.get('#open-text-area').type('testando aqui', { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
})