import { randomUUID } from 'node:crypto';
let maxWidth = 30;
let maxHeight = 30;

export const groups = [
  {
    id: 'groupId',
    players: [],
    fruits: [],
    // timer: 5,
  },
  {
    id: 'groupId2',
    players: [],
    fruits: [],
    // timer: 5,
  },
];

export function setCanvasSize (width, height) {
  if(typeof (width) === "number" && typeof(height) === "number") {
    maxWidth = width;
    height = height;
    return;
  };

  maxHeight = 10;
  maxWidth = 10;
}

export function findGroupById (groupId) {
  const findGroup = groups.find(group => group.id === groupId);
  if(!findGroup) {
    throw new Error('Group not found!');
  };

  return findGroup;

};

export function findPlayerByGroup (groupId, playerId) {
  const findGroup = findGroupById(groupId);
  const player = findGroup.players.find(player => player.id === playerId);

  if(!player) {
    throw new Error('Group not found!');
  };

  return player;
}

export function addFruit (groupId) {
  const findGroup = findGroupById(groupId);
  findGroup.fruits.push({
    id:randomUUID(), 
    x: Math.floor(Math.random() * maxWidth), 
    y: Math.floor(Math.random() * maxHeight),
  });
};

export function removeFruit (group, fruitId) {
  group.fruits = group.fruits.filter(fruit => fruit.id !== fruitId);
};

export function addPlayer (groupId, datasPlayer) {
  const findGroup = findGroupById(groupId);
  findGroup.players.push({
    id: datasPlayer.id, 
    name: datasPlayer.name, 
    x: Math.floor(Math.random() * maxWidth), 
    y: Math.floor(Math.random() * maxHeight),
    host: findGroup.players.length === 0 ? true : false,
    score: 0,
  });
};

export function removedPlayer (groupId, playerId) {
  const findGroup = findGroupById(groupId);
  findGroup.players = findGroup.players.filter(player => player.id !== playerId);
  if (
    findGroup.players.length > 0 && !findGroup.players[0].host
  ) findGroup.players[0].host = true;
};
 
export function checkColision (groupId, playerId) {
  const findGroup = findGroupById(groupId);
  const player = findPlayerByGroup(groupId, playerId);

  for(const fruit of findGroup.fruits) {
    if(player.x === fruit.x && player.y === fruit.y) {
      console.log(`Player: ${playerId} collect fruit ${fruit.id}`);
      removeFruit(findGroup, fruit.id);
      player.score += 1; 
    };
  };
};

export const optionsMovePlayer = {
  valueMove: 1,
  ArrowUp (groupId, playerId) {
    const player = findPlayerByGroup(groupId, playerId);
    if(player.y > 0) {
      player.y = player.y - optionsMovePlayer.valueMove; 
    }
    optionsMovePlayer.infoLogsMove(player);
  },
  ArrowLeft (groupId, playerId) {
    const player = findPlayerByGroup(groupId, playerId);
    if(player.x > 0) {
      player.x = player.x - optionsMovePlayer.valueMove; 
    };

    optionsMovePlayer.infoLogsMove(player);
  },
  ArrowDown (groupId, playerId) {
    const player = findPlayerByGroup(groupId, playerId);
    if(player.y < maxHeight - 1) {
      player.y = player.y + optionsMovePlayer.valueMove; 
    };

    optionsMovePlayer.infoLogsMove(player);
  }, 
  ArrowRight (groupId, playerId) {
    const player = findPlayerByGroup(groupId, playerId);
    if (player.x < maxWidth - 1) {
      player.x = player.x + optionsMovePlayer.valueMove; 
    }
  
    optionsMovePlayer.infoLogsMove(player);
  },
  infoLogsMove (player) {
    console.log({ name: player.name, x: player.x, y: player.y, score: player.score });
  },
};
 