import express, { Request, Response } from 'express';
import emojis from './emojis/emojis.route';
import game from './game/game.route';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🍕 Api route 🍕',
  });
});

router.post('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🍕 Api route 🍕',
  });
});

// routes registration
router.use('/emojis', emojis);
router.use('/game', game);

export default router;
