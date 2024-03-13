function renderGame (players, fruits, currentId, plate) {
  plate.innerHTML = '';
  ctx.clearRect(0, 0, 30, 30);

  for(const player of players) {
    player.id === currentId ? 
    ctx.fillStyle = "#0f0" : 
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

    plate.innerHTML += `
      <div class="infoPalyer">
        <h3>${player.name}</h3>
        <p>Score: <strong>${player.score}</strong></p>
      </div>
    `;

    ctx.fillRect(player.x, player.y, 1, 1);
  };

  for(const fruit of fruits) {
    ctx.fillStyle = "rgb(0, 162, 255)";
    ctx.fillRect(fruit.x, fruit.y, 1, 1);
  };
};