
describe('Started Game', () => {
  const TESTERNAME = "tester"
  const TESTERNAME2 = "secondTester"

  beforeEach(() => {
    cy.viewport(1280, 1080);
    cy.visit('/')
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.get('button[name="addAiButton"]').click()
    cy.contains("Start Game").click()
    cy.contains("Game started!")
  })

  it('should not allow to check in first turn',()=>{
    Cypress.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('There is no bet');
      return false;
    });
    cy.contains("No bet has been made yet")
    cy.contains("Check").click()
    cy.contains("No bet has been made yet")
  })

  it('should raise sucessfuly',()=>{
    cy.contains("No bet has been made yet")
    cy.contains("Raise").click()
    cy.contains("One").click()
    cy.get(".card-option-container").should('have.length.at.least', 12).eq(11).click()
  })

  it('should not raise lower than previous bet',()=>{

    cy.contains("No bet has been made yet")
    cy.contains("Raise").click()
    cy.contains("One").click()
    cy.get(".card-option-container").should('have.length.at.least', 12).eq(11).click()
    
    cy.contains("Raise").click()
    cy.contains("One").click()
    cy.get(".card-option-container").should('have.length.at.least', 12).eq(0).click()
    cy.contains("New ranking must be higher than previous one")
  })
  
  it('should count down timer',()=>{
    cy.get(".time-display").should('contain.text', "0:59")
    cy.get(".time-display").should('contain.text', "0:58")
    cy.get(".time-display").should('contain.text', "0:57")
  })

  it('should close modal when clicking out of focus',()=>{
    cy.contains("Raise").click()
    cy.get('body').click(0, 0)
    cy.contains("Select Hand Ranking").should('not.exist')
  })
})