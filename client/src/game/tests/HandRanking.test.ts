import * as HandRankings from '../../../../src/types/HandRankings';
import { Rank, CardColor } from '../../model/Card';
import type { CardDict } from '../../../../src/types/HandRankings';

test('One cardCheck', () => {
    let checker = new HandRankings.OneChecker(Rank.King);
});
