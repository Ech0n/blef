const router = require('express').Router();
const emojis = require('./emojis/emojis.route');
const game = require('./game/game.route');



router.get('/', (req, res) => {
  res.status(200).json({
    message: '🍕 Api route 🍕',
  });
});


router.post('/', (req, res) => {
  res.status(200).json({
    message: '🍕 Api route 🍕',
  });
});



// routes registration
router.use('/emojis', emojis);
router.use('/game', game);

module.exports = router;