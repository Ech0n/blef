const TESTERNAME = "tester"
const TESTERNAME2 = "secondTester"

describe('Main menu', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the page successfully', () => {
    cy.contains('BLEF')
  })

  it('should open Create Game Modal', () => {
    cy.contains('Create Game').click()
    cy.contains('Cancel')
    cy.contains('Create Game')
    cy.get("input").should('have.attr', 'placeholder', 'Enter Your Name')
  })

  it('should open modals and close them', () => {
    cy.contains('Create Game').click()
    cy.contains('Cancel').click()
    cy.contains('Cancel').should('not.exist')
    cy.contains('Join Game').click()
    cy.contains('Cancel').click()
    cy.contains('Cancel').should('not.exist')
  })

  it('should close modal when clicking out of focus',()=>{
    cy.contains('Create Game').click()
    cy.get('body').click(0, 0)
    cy.contains('Cancel').should('not.exist')
  })

  it('should create a game', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains("Game created!")
    cy.contains("Game Code")
    cy.contains("Players")
    cy.get(".player-item").should('contain.text', TESTERNAME)
    cy.contains('Close Game')
    cy.contains('Start Game')
  })

  it('should join non existent game', () => {
    cy.contains('Join Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('input[name="gameIdInput"]').type('0000')
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains("Attempted to join a game")
  })

  it('should add and remove ai bots', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.get(".player-item").should('contain.text', TESTERNAME)
    cy.get('button[name="addAiButton"]').click()
    cy.get(".player-item").should('contain.text', "bot1")
    cy.get('button[name="addAiButton"]').click()
    cy.get(".player-item").should('contain.text', "bot2")
    cy.get(".player-item").should('contain.text', TESTERNAME)
  })

  it('should close the game', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains('Close Game').click() 
    cy.contains('Close Game').should('not.exist')
  })

  it('should not start the game without any players', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains("Start Game").click()
    cy.contains("Invalid amount of players to start the game or not everyone is ready")
  })

  it('should start the game with one ai player', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.get('button[name="addAiButton"]').click()
    cy.contains("Start Game").click()
    cy.contains("Game started!")
  })

  it('should start the game with one ai player', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.get('button[name="addAiButton"]').click()
    cy.contains("Start Game").click()
    cy.contains("Game started!")
  })

  it('should close the game and then create new one', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains('Close Game').click() 
    cy.contains('Close Game').should('not.exist')
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains("Game created!")
  })

  it('should remember username in create game', () => {
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains('Close Game').click() 
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').should('have.value', TESTERNAME)
  })

  it('should remember username in create game', () => {
    cy.contains('Join Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('input[name="gameIdInput"]').type("0000")
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains("Attempted to join a game")
    cy.contains('Join Game').click()
    cy.get('input[name="usernameInput"]').should('have.value', TESTERNAME)
  })

  it('should not be able to join closed game', () => {
    let code =""
    cy.contains('Create Game').click()
    cy.get('input[name="usernameInput"]').type(TESTERNAME)
    cy.get('button[name="JoinOrCreateButton"]').click()
    cy.contains('Game Code').parent().then(($el) => {
        code = $el.find('#code-container').text();
        cy.log(code)
        cy.contains('Close Game').click() 
        cy.contains('Close Game').should('not.exist')
    
        cy.contains('Join Game').click()
        cy.get('input[name="usernameInput"]').type(TESTERNAME)
        cy.get('input[name="gameIdInput"]').type(code)
        cy.get('button[name="JoinOrCreateButton"]').click()
        cy.contains("Attempted to join a game")
    });
  })

})
