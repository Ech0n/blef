class Game { // This 100% should be an Interface or maybe removed who knows.

    // Method to join a game with a specific id
    joinGame(id: string): void {
        // Implementation will be added here
    }
    
    // Method to create a new game and return its id
    createGame(): number {
        let id: number = 2137; // Example id, should be replaced with actual game creation logic
        return id;
    }

    // Method to attempt a check in the game
    tryCheck(): void {
        // Implementation will be added here
    }

    // Method to attempt a raise in the game
    tryRaise(): void {
        // Implementation will be added here
    }

    // Method to respond to a raise in the game
    resRaise(): void {
        // Implementation will be added here
    }

    // Method to respond to a check in the game
    resCheck(): void {
        // Implementation will be added here
    }
}
