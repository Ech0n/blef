const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

var session = require('express-session')

const app = express();

const api = require('./api');
const { notFound, errorHandler } = require('./middlewares/errors.middleware');


//session

// const sess = {
// 	genid: function(req) {
// 		let uid  =uuidv4()
// 		return uid
// 	},
// 	resave: false,
// 	saveUninitialized: false,
// 	secret: 'keyboard cat',
// 	cookie:{
// 		secure: true,
// 		httpOnly: true,
// 		sameSite: 'none',
// 		maxAge: 60 * 60 * 24 * 1000
// 	}
// }

// if (app.get('env') === 'production') {
	// app.set('trust proxy', 1) // trust first proxy
	// sess.cookie.secure = true // serve secure cookies
	// }
	
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({resave:false}))


if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/public'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
	});
}

app.use(cors({
	origin: ['http://localhost:5173', 'http://localhost:5678','http://localhost:5678/socket.i'],  // Update with your actual frontend origins
	methods: [ 'GET','HEAD','PUT','PATCH','POST','DELETE'],  // Specify the allowed HTTP methods
	credentials: true,  // Enable credentials (cookies, headers) cross-origin
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cors())

app.set('trust proxy', 1) // trust first proxy
app.use(session({resave:true,saveUninitialized:true,secret:"pizda",rolling:false}))


app.get('/', (req, res) => {
	res.status(200).json({
		message: '📦 Svelte Express Boilerplate 📦',
	});
});

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
