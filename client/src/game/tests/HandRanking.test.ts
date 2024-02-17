import * as HandRankings from '../HandRankings';
import { Rank, CardColor } from '../../model/Card';
import type { CardDict } from '../HandRankings';

test('One cardCheck', () => {
    let checker = new HandRankings.OneChecker(Rank.King);
});
