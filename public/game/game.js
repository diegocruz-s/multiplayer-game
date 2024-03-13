const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const startGame = document.getElementById("start_game");
const generateFruit = document.getElementById("generate_fruit");
const timeGame = document.getElementById("time_game");
const infosGame = document.getElementById("infosGame");
const plate = document.getElementById("plate");
const leader = document.getElementById("leader");

const socket = io('http://localhost:3333');
const canvaWidth = canvas.width;
const canvaHeight = canvas.height;

const urlSearch = new URLSearchParams(window.location.search);
const groupId = urlSearch.get('group');
const username = urlSearch.get('username');

// Add listeners
document.addEventListener('keydown', event => {
  if (event.target.tagName.toLowerCase() !== 'input') {
    const datasMovePlayer = {
      groupId,
      playerId: socket.id,
      key: event.key,
    };
    socket.emit('move_player', datasMovePlayer);
  };
});

startGame.addEventListener('click', () => {
  leader.style.display = 'none';
  if(!timeGame.value || !generateFruit.value) return;

  if(!startGame.disable) {
    socket.emit('start_game', {
      groupId,
      timeGame: +timeGame.value,
      timeGenerateFruit: +generateFruit.value,
    });
    startGame.disable = true;
    startGame.textContent = 'Jogando...';
  };
});

// Datas room
socket.emit('select_room', {
  groupId,
  username,
});

socket.on('finish_game', dataFinal => {
  startGame.disable = false;
  startGame.textContent = 'Começar';
  leader.style.display = 'block';
  leader.innerHTML = `Líder: ${dataFinal.order[0].name} - <span>${dataFinal.order[0].score}</span> frutas coletadas`;
});

// Player events
socket.on('add_player', data => {
  renderGame(data.players, data.fruits, socket.id, plate);
  const player = data.players.find(player => player.id === socket.id);
  if (player.host) {
    infosGame.style.display = 'flex';
  };
});
socket.on('move_player', data => {
  renderGame(data.players, data.fruits, socket.id, plate);
  const player = data.players.find(player => player.id === socket.id);
  if (player.host) {
    infosGame.style.display = 'flex';
  };
});
socket.on('removed_player', data => {
  renderGame(data.players, data.fruits, socket.id, plate);
});


// Fruit events
socket.on('add_fruit', data => {
  renderGame(data.players, data.fruits, socket.id, plate);
});


// Connect
socket.on('connect', datas => {
  socket.emit('datas_canvas', {
    width: canvaWidth,
    height: canvaHeight,
  });
}); 



