import express, { Request, Response } from 'express';

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

export default router;
