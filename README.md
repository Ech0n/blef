# Blef Online Card Game

Blef is a Polish card game, based on deceiving other players.
<br>
It can be played by anyone with an internet connection on official [website](http://www.blefgame.com).
<br>
The rules can be found in: [Rules of the Game](#rules-of-the-game).
<br>
It is best played face to face or with Facecams.

## Authors

-   **Mateusz Dyszewski** - [LinkedIn](https://www.linkedin.com/in/mateusz-dyszewski-56a40726a/)
-   **Miłosz Junak** - [LinkedIn](https://www.linkedin.com/in/miloszjunak/)

### Prerequisites

For this project you need [**Node**](https://nodejs.org/en/) installed on your machine with [**Npm**](https://www.npmjs.com/) or [**Yarn**](https://yarnpkg.com).

### Download

You can clone this repository using **Git**:

```bash
git clone https://github.com/Ech0n/blef.git
```

### Quick start

```bash
# Install dependencies for server
npm install

# Build the project
npm run build # Or skip this part if you want to run development build

# Run the client & server with concurrently
npm run start # Use 'npm run dev' for a development build

# Run unit tests
cd client
npm run tests

# Run functional tests
docker compose up
# in another session run:
cd client
npx cypress open
```

# Run tests
npm run start # Use 'npm run dev' for a development build
```

## Implementation and Views

Game has been implemented using Broker Server, meaning server only handles establishing and mantaining connections between player instances though the use of sockets.
<br> All the game logic is performed on players machines, most of which on host's machine.
<br> Game should be responsive for most devices above 340px of width.

1. When opening the website, the first view will be the "Play" View.
   ![Play View](/docs/play_small.png/)
    - **Join Game**: After selecting "Join Game", you will be asked to input your preferred username and a Game ID provided to you by the Lobby Host. This option also allows you to join back to game you left accidentaly, by inputing previous Game ID and name.
    - **Create Game**: After selecting "Create Game", you will be asked to input your preferred username. After providing the username, a new lobby will open, and the Game ID will be generated and ready to be distributed to your friends.
2. After creating or joining to the game, Lobby View will open with all currently connected players listed.
   ![Lobby View](/docs/lobby_small.png)
    - **Start Game**: Only available to Lobby Host. Game can be started by Lobby Host only if there are 2-5 Players in the lobby.
    - **Close Game**: Only available to Lobby Host, closes lobby and disconnects every player in that game.
    - **Leave Game**: Only availabe to Clients, leaves the lobby.
3. After Lobby Host starts the game, following view will be shown.
   ![Game View](/docs/game.png)
    - **Raise**: Only available to person who's turn currently it is. Showcases a list of possible Hand Rankings to select. Afterwards next person has a turn.
    - **Check**: Only available to person who's turn currently it is. Immediately checks previous Hand Ranking bet.
    - **Host Functionality**: Additionally, Lobby Host always has available option to Close Game or Kick Player.
4. There is also available navbar on which "What's Blef" will showcase idea and rules of the game similarly to [Rules of the Game](#rules-of-the-game).

After the game ends, Lobby Host can start another game from same Lobby once everyone is ready and close winner's popup.

## Rules of the Game

The rules of the game are based on the ones described on page it's Polish Wikipedia page: https://pl.wikipedia.org/wiki/Blef_(gra)

1. There is a standard deck of 52 cards in the game.

2. At the start of the game, each player gets 1 random card.

3. Once it is your turn during the round, there are 2 possible moves: Raise and Check.

    **Raise** - You can choose a Hand Ranking, for example, a Pair of Aces. That means that you bet there are 2 Aces among ALL dealt cards in the current round. The new bet must have a higher ranking than the previous bet.

    **Check** - You can check the previous player's bet. If his bet was correct, then you will be the one to receive another card. If his bet was incorrect, then the previous player will receive an additional card and he will begin the next round. For example, if the previous player bets there is One King and you check it, and there are no dealt kings in the current round => The Previous Player loses that round.

4. A player is eliminated once they lose a round with 5 cards.

5. There can be a maximum of 5 players in 1 game.

6. There is a 45-second timer for each turn during a round. If it ends, a move is made automatically.

## Planned features:

-   Full UI Design Rework
-   User interface improvements
-   Possibility to play against AI
-   Accounts

## Built with ❤️ using:

-   [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
-   [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
-   [Svelte.js](https://svelte.dev/) - Javascript framework
