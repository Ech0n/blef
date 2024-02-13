
const router = require('express').Router();

const games = []


function createGame()
{

}

function joinGame(id)
{
  games
}

// router.post('/create', (req, res) => {
//   console.log("sesiD: ",req.sessionID)
//   console.log("sess: ",req.session)
//   let id = games.length
//   if(!req.session.gameId)
//   {
//     req.session.gameId = id
//   }
//   console.log(req.session)

//   games.push("players")
//   res.status(200).json({
//     message: id,
//   });
// });

// router.post('/join/:id', (req, res) => {
//   console.log(req.params)
// });



module.exports = router;