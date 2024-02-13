const app = require('./app');
const socketIO = require('socket.io');

const port = process.env.PORT || 5678;

// client-sock -> host-sock
let hosts = {}

// game-code -> host-sock
let gameIds = {}

// host-sock -> [client-socks...]
let clients = {}

const server = app.listen(port, () => {
	console.log(`Server is up at port http://localhost:${port}`);
});


	
const io = socketIO(server,{cors: {
	origin: "http://localhost:5173",
	methods: ["GET", "POST"],
	allowedHeaders: ["my-custom-header"],
	credentials: true
  }}
);


// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create', (data) => {
    // console.log('Received message from client:', data,"socket: ",socket);
    
    //generate gameId
    let gameId = 1

    gameIds[gameId] = socket.id
    
    clients[socket.id] = []
    console.log("User created a game; id: ",gameId)
    socket.emit('create', gameId);
  });

  socket.on('join', (data) => {
    console.log('Received message from client:', data);

    if (! (data in gameIds))
    {
      socket.emit('join',false)
      socket.disconnect(0)
      return
    }

    clients[gameIds[data]].forEach(client=>
    {
      console.log("FAILED FOR ",client)
      let clSock = io.sockets.sockets.get(client)
      if(clSock)
      {
        clSock.emit('join',{newPlayer:'user'})
      }
    })

    let hostSocketId = gameIds[data]
    let hostSocket = io.sockets.sockets.get(hostSocketId)
    hostSocket.emit('join',{newPlayer:'user'})
    clients[hostSocketId].push(socket.id)
    socket.emit("join",{players: clients[hostSocketId].map((el)=>("user")).push("host")})
  });


  socket.on('clientHit', (data) => {
    console.log('Received message from client:', data);

    if (! (socket.id in hosts))
    {
      socket.emit('clientHit',false)
      // socket.disconnect(0)
      return
    }
    // socket.emit('clientHit',false)
    hosts[socket.id].emit('clientHit',data)

  });


  socket.on('clientCheck', (data) => {
    console.log('Received message from client:', data);

    if (! (socket.id in hosts))
    {
      socket.emit('clientCheck',false)
      return
      // socket.disconnect(0)
    }
    // socket.emit('clientCheck',false)
    hosts[socket.id].emit('clientCheck',data)

  });

  socket.on('gameUpdate', (data) => {
    console.log('Received message from client:', data);

    if (! (socket.id in clients))
    {
      socket.emit('gameUpdate',false)
      // socket.disconnect(0)
    }
    
    clients[socket.id].forEach(cl=> (cl.emit('gameUpdate',data)))

  });


  socket.on('start', (data) => {
    console.log('Received message from client:', data);

    if (! (socket.id in hosts))
    {
      socket.emit('start',false)
      return
      // socket.disconnect(0)
    }
    // socket.emit('clientCheck',false)
    clients[socket.id].forEach(cl=> (cl.emit('start',data)))
    socket.emit('start',true)

  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');

    if(socket.id in hosts)
    {
      hostSock = hosts[socket.id]
  
      let indexOfClient = clients[hostSock].indexOf(socket.id)
      if(indexOfClient >=0)
      {
        clients[hostSock].splice(indexOfClient,1)
      }
    }
    if(socket.id in clients)
    {
      hosts.filter(el=>el==socket.id)
      delete clients[socket.id]
    }

    //TODO: Implement playerLeave emit
  });
});