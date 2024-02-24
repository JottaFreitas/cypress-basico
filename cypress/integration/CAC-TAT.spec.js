/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {
    this.beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e enva o formulário', () => {
        const longText = 'Esse é o texto longo sugerido a ser digitado para teste e aprendizado dentro do campo de digitação do texto longo'
        cy.get('#firstName').type('Josué')
        cy.get('#lastName').type('Freitas')
        cy.get('#email').type('josue.ofreitas@exemplo.com')
        cy.get('#open-text-area').type('teste testando')
        cy.contains('button', 'Enviar').click()
        cy.get('#open-text-area').type(longText, { delay: 0 })

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Josué')
        cy.get('#lastName').type('Freitas')
        cy.get('#email').type('josue.ofreitas@exemplo,com')
        cy.get('#open-text-area').type('teste testando')
        cy.contains('button', 'Enviar').click()
        cy.get('#open-text-area').type('testando aqui', { delay: 0 })

        cy.get('.error').should('be.visible')
    })

    it('campo telefônico continua vazio quando preenchido com valor não numérico', () => {
        cy.get('#phone').type('testeNumerico').should('have.value', '')
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Josué')
        cy.get('#lastName').type('Freitas')
        cy.get('#email').type('josue.ofreitas@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste testando ')
        cy.contains('button', 'Enviar').click()
        cy.get('#open-text-area').type('texto de teste na caixa de texto', { delay: 0 })

        cy.get('.error').should('be.visible')



    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Josué')
            .should('have.value', 'Josué')
        cy.get('#lastName').type('Freitas')
            .should('have.value', 'Freitas')
            .clear().should('have.value', '')
        cy.get('#email').type('josue.ofreitas@exemplo.com')
            .should('have.value', 'josue.ofreitas@exemplo.com')
            .clear().should('have.value', '')
        cy.get('#phone').type('12345567899')
            .should('have.value', '12345567899')
            .clear().should('have.value', '')
        cy.contains('button', 'Enviar').click()
        /* cy.get('.button[type="submit"]').click()*/
        cy.get('#open-text-area').type('teste testando')
        cy.get('button[type="submit"]').click()
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('button[type="submit"]').click()
        cy.get('.error')
            .should('be.visible')
    })


    it('Envia o formulário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        /*O comando foi criado no support > commands.js*/

    })

    /*                USANDO O SELECT               */
    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube')
            .should('have.value', 'youtube')
    })

    it('Seleciona um produto (Mentoria) pelo seu valor', () => {
        cy.get('#product').select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('Seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1)
            .should('have.value', 'blog')

    })

    /*    Usando inputs do tipo radio    */
    it('Marca o tipo de atendimento Feedback', () => {
        cy.get('input[type=radio]').check('feedback')
            .should('have.value', 'feedback')
    })

    it('Marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]').should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
        /*para cada opção do input, haverá uma iteração, e dentro dessa interação uma função receberá o valor de cada opção doinput.
        o valor será passado em wrap, e será dado um check. 
        Após, será validado se foi checado com o should be.checked */
    })

    /*Usando o check e uncheck*/
    it('marca ambos checkboxes e depois desmarca o último', () => {
        cy.get('input[type ="checkbox"]')
            .check()
            .last()
            .uncheck()
            .should('not.be.checked')

        cy.get('input[type ="checkbox"]')
            .first()
            .should('be.checked')

        /*foi pego o input do tipo checkbos, e dado um checkem todas as opções do checkbox, 
        já que usamos o seletor genérico checkbos, e não o seletor específico de cada opção. 
        Para trabalhar com a opção específica, foi usado o .first() e .last()*/
    })

    it('Seleciona um arquivo da pasta Features', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]#file-upload')
            .selectFile('./cypress/fixtures/example.json', { action: "drag-drop" })
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
                /*console.log("passou aqui")*/
            })
    })

    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile') /*cy.fixture pega o arquivo da pasta fixtures sem haver a necessidade de passar o caminho completo. Pode também ser dado um alias, usando .as*/
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')

                console.log(input);

            })

    })

    it('Verifica que a política de pricvacidade abre em uma nova aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank') /*shave.attr = have attribute*/
    })

    it.only('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.contains('Talking About Testing').should('be.visible')
    })


})