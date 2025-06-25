export interface HandInfo {
    selectedRanking: string;
    primaryCard: string;
    secondaryCard: string;
    selectedColor: string;
    startingCard: string;
}

export type Card = [string, string];

export type CardCountTable = { [cardKey: number]: { [colorKey: number]: number } };
