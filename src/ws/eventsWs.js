import { Server } from "socket.io";
import { addFruit, addPlayer, checkColision, groups, optionsMovePlayer, removedPlayer, setCanvasSize } from "../game/gameLogic.js";

const setupWebSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  let interval;

  io.on('connect', socket => {
    let groupConnected;

    socket.on('select_room', datasRoom => {
      const { groupId, username } = datasRoom
      groupConnected = groups.find(group => group.id === groupId);
      socket.join(groupId); 
      addPlayer(groupConnected.id, { id: socket.id, name: username });
      io.to(groupConnected.id).emit('add_player', groupConnected);

      socket.on('disconnect', () => {
        removedPlayer(groupConnected.id, socket.id);
        io.to(groupConnected.id).emit('removed_player', groupConnected);
      });
    });

    socket.on('datas_canvas', canvas => setCanvasSize(canvas.width, canvas.height));
  
    socket.on('start_game', datasStart => {
      interval = setInterval(() => {
        addFruit(groupConnected.id);
        io.to(groupConnected.id).emit('add_fruit', {
          players: groupConnected.players,
          fruits: groupConnected.fruits, 
        });
      }, datasStart.timeGenerateFruit);

      setTimeout(() => {
        let order = [];
        groupConnected.players.map(player => {
          if(order.length === 0) return order.push(player);
          player.score > order[0].score ? 
            order.unshift(player) : 
            order.push(player);
        })
        groupConnected.fruits = [];
        io.to(groupConnected.id).emit('finish_game', { order });
        clearInterval(interval); 
      }, datasStart.timeGame);
    });
  
    socket.on('move_player', datas => {
      const { groupId, playerId, key } = datas;
      const functionMovePlayer = optionsMovePlayer[key];
      if(functionMovePlayer) { 
        functionMovePlayer(groupId, playerId);
        checkColision(groupId, playerId);
      }; 

      io.to(groupConnected.id).emit('move_player', {
        players: groupConnected.players,
        fruits: groupConnected.fruits, 
      });
    });


    

  });
};

export {
  setupWebSockets,
};