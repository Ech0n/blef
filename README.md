# svelte-express-boilerplate 📦

> Boilerplate for developing full stack apps with Express and Svelte.js

1. Widok pokazuje dwie opcje: "Dołącz do gry", "Stwórz grę"
2A. Po wybraniu opcji "Dołącz do gry" użytkownik proszony jest o podanie kodu sesji
2B. Po wybraniu opcji "Stwórz grę" użytkownik widzi kod sesji, liczbę graczy, którzy dołączyli do sesji oraz przycisk "Start gry" (Problem: Stan gry powinien być optymalnie przechowywany w pamięci podręcznej nie w bazie danych, Rozwiązanie?: Redis)
3. Gra została wystartowana przyciskiem "Start gry". (Problem: nalezy powiadomić uzytkowników o starcie gry bez wcześniejszego requestu od użytkownika(Sockety?). PlanB: Użytkownik regularnie requestuje informacje o stanie gry)
4. Losowany jest gracz startujący rozgrywke (przez serwer)
5. Każdy gracz dostaje od serwera karty (Ilość kart które powinien mieć każdy użytkownik przechowywana w stanie gry)
6. Obecny gracz dostaję opcje Zaproponować ułożenie albo Sprawdzić poprzedniego gracza (Wykluczone dla pierwszego ruchu w turze)
7. Kroki 5-6 powtarzają się do momentu pierwszego sprawdzenia

Alternatywne rozwiązanie: Logika rozgrywki zarządzana jest lokalnie na komputerze hosta, do którego dochodzą zapytania przez serwer od użytkowników. (Plusem tego rozwiązania jest odciążenie serwera, minusem obciążenie urządzenia użytkownika)

### Prerequisites  

For this project you need [__Node__](https://nodejs.org/en/) installed on your machine with [__Npm__](https://www.npmjs.com/) or [__Yarn__](https://yarnpkg.com).

### Download

You can clone this repository using __Git__:
```bash
git clone https://github.com/dj0nny/svelte-express-boilerplate.git
```

Or download the repository [here](https://github.com/dj0nny/svelte-express-boilerplate/archive/develop.zip)

### Quick start

```bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run serve:server

# Run the Svelte client only
npm run serve:client

# Server runs on http://localhost:5678 and client on http://localhost:5000
```

## Built with ❤️ using:

* [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [Svelte.js](https://svelte.dev/) - Javascript framework

## Contributing

Pull Requests for adding features ⇄ and ★ are welcome 😎
