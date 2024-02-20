import aceOfSpades from '../assets/svg_playing_cards/fronts/spades_ace.svg';
import twoOfSpades from '../assets/svg_playing_cards/fronts/spades_2.svg';
import threeOfSpades from '../assets/svg_playing_cards/fronts/spades_3.svg';
import fourOfSpades from '../assets/svg_playing_cards/fronts/spades_4.svg';
import fiveOfSpades from '../assets/svg_playing_cards/fronts/spades_5.svg';
import sixOfSpades from '../assets/svg_playing_cards/fronts/spades_6.svg';
import sevenOfSpades from '../assets/svg_playing_cards/fronts/spades_7.svg';
import eightOfSpades from '../assets/svg_playing_cards/fronts/spades_8.svg';
import nineOfSpades from '../assets/svg_playing_cards/fronts/spades_9.svg';
import tenOfSpades from '../assets/svg_playing_cards/fronts/spades_10.svg';
import jackOfSpades from '../assets/svg_playing_cards/fronts/spades_jack.svg';
import queenOfSpades from '../assets/svg_playing_cards/fronts/spades_queen.svg';
import kingOfSpades from '../assets/svg_playing_cards/fronts/spades_king.svg';

import aceOfHearts from '../assets/svg_playing_cards/fronts/hearts_ace.svg';
import twoOfHearts from '../assets/svg_playing_cards/fronts/hearts_2.svg';
import threeOfHearts from '../assets/svg_playing_cards/fronts/hearts_3.svg';
import fourOfHearts from '../assets/svg_playing_cards/fronts/hearts_4.svg';
import fiveOfHearts from '../assets/svg_playing_cards/fronts/hearts_5.svg';
import sixOfHearts from '../assets/svg_playing_cards/fronts/hearts_6.svg';
import sevenOfHearts from '../assets/svg_playing_cards/fronts/hearts_7.svg';
import eightOfHearts from '../assets/svg_playing_cards/fronts/hearts_8.svg';
import nineOfHearts from '../assets/svg_playing_cards/fronts/hearts_9.svg';
import tenOfHearts from '../assets/svg_playing_cards/fronts/hearts_10.svg';
import jackOfHearts from '../assets/svg_playing_cards/fronts/hearts_jack.svg';
import queenOfHearts from '../assets/svg_playing_cards/fronts/hearts_queen.svg';
import kingOfHearts from '../assets/svg_playing_cards/fronts/hearts_king.svg';

import aceOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_ace.svg';
import twoOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_2.svg';
import threeOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_3.svg';
import fourOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_4.svg';
import fiveOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_5.svg';
import sixOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_6.svg';
import sevenOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_7.svg';
import eightOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_8.svg';
import nineOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_9.svg';
import tenOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_10.svg';
import jackOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_jack.svg';
import queenOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_queen.svg';
import kingOfDiamonds from '../assets/svg_playing_cards/fronts/diamonds_king.svg';

import aceOfClubs from '../assets/svg_playing_cards/fronts/clubs_ace.svg';
import twoOfClubs from '../assets/svg_playing_cards/fronts/clubs_2.svg';
import threeOfClubs from '../assets/svg_playing_cards/fronts/clubs_3.svg';
import fourOfClubs from '../assets/svg_playing_cards/fronts/clubs_4.svg';
import fiveOfClubs from '../assets/svg_playing_cards/fronts/clubs_5.svg';
import sixOfClubs from '../assets/svg_playing_cards/fronts/clubs_6.svg';
import sevenOfClubs from '../assets/svg_playing_cards/fronts/clubs_7.svg';
import eightOfClubs from '../assets/svg_playing_cards/fronts/clubs_8.svg';
import nineOfClubs from '../assets/svg_playing_cards/fronts/clubs_9.svg';
import tenOfClubs from '../assets/svg_playing_cards/fronts/clubs_10.svg';
import jackOfClubs from '../assets/svg_playing_cards/fronts/clubs_jack.svg';
import queenOfClubs from '../assets/svg_playing_cards/fronts/clubs_queen.svg';
import kingOfClubs from '../assets/svg_playing_cards/fronts/clubs_king.svg';


class CardImageHandler {
    private cardImages: { [key: string]: string };

    constructor() {
        this.cardImages = {
            "ace spade": aceOfSpades,
            "two spade": twoOfSpades,
            "three spade": threeOfSpades,
            "four spade": fourOfSpades,
            "five spade": fiveOfSpades,
            "six spade": sixOfSpades,
            "seven spade": sevenOfSpades,
            "eight spade": eightOfSpades,
            "nine spade": nineOfSpades,
            "ten spade": tenOfSpades,
            "jack spade": jackOfSpades,
            "queen spade": queenOfSpades,
            "king spade": kingOfSpades,
            "ace heart": aceOfHearts,
            "two heart": twoOfHearts,
            "three heart": threeOfHearts,
            "four heart": fourOfHearts,
            "five heart": fiveOfHearts,
            "six heart": sixOfHearts,
            "seven heart": sevenOfHearts,
            "eight heart": eightOfHearts,
            "nine heart": nineOfHearts,
            "ten heart": tenOfHearts,
            "jack heart": jackOfHearts,
            "queen heart": queenOfHearts,
            "king heart": kingOfHearts,
            "ace diamond": aceOfDiamonds,
            "two diamond": twoOfDiamonds,
            "three diamond": threeOfDiamonds,
            "four diamond": fourOfDiamonds,
            "five diamond": fiveOfDiamonds,
            "six diamond": sixOfDiamonds,
            "seven diamond": sevenOfDiamonds,
            "eight diamond": eightOfDiamonds,
            "nine diamond": nineOfDiamonds,
            "ten diamond": tenOfDiamonds,
            "jack diamond": jackOfDiamonds,
            "queen diamond": queenOfDiamonds,
            "king diamond": kingOfDiamonds,
            "ace club": aceOfClubs,
            "two club": twoOfClubs,
            "three club": threeOfClubs,
            "four club": fourOfClubs,
            "five club": fiveOfClubs,
            "six club": sixOfClubs,
            "seven club": sevenOfClubs,
            "eight club": eightOfClubs,
            "nine club": nineOfClubs,
            "ten club": tenOfClubs,
            "jack club": jackOfClubs,
            "queen club": queenOfClubs,
            "king club": kingOfClubs
        };
        
    }

    public getCardImage(cardName: string): string | null {
        // console.log(cardName);
        const normalizedCardName = cardName.toLowerCase();
        return this.cardImages[normalizedCardName] || null;
    }
}

export default CardImageHandler;
