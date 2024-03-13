// Native modules
import http from 'node:http';

// External Modules
import cors from 'cors';

// Servers
import express from 'express';
import { setupWebSockets } from './ws/eventsWs.js';

// Group
import { groups } from './game/gameLogic.js';

// Instance servers
const app = express();
const serverHttp = http.createServer(app);

// Middlewares
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
 
// Routes
app.post('/room', async (req, res) => {
  const roomId = req.body.roomId;
  if(!roomId) {
    return res.status(422).json({
      error: 'Código da sala não informado!',
    });
  };
  const findRoomId = groups.find(group => group.id === roomId);
  if(findRoomId) {
    return res.status(422).json({
      error: 'Sala já existente!',
    });
  };

  groups.push({
    id: roomId,
    players: [],
    fruits: [],
  });

  return res.status(201).json({ id: roomId });
});

app.get('/room/:id', async (req, res) => {
  const groupId = req.params.id;
  if(!groupId) {
    return res.status(422).json({
      error: 'Código da sala não informado!',
    });
  };
  const findGroup = groups.find(group => group.id === groupId);
  if(!findGroup) {
    return res.status(404).json({
      error: 'Grupo não encontrado!',
    });
  };

  return res.json({ group: findGroup });
});  

 
// Listen
serverHttp.listen(3333, () => {
  console.log('Server running...');
});

// Sockets
const serverWs = setupWebSockets(serverHttp); 

// Exports
export { serverWs };  
 