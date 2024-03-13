const formRoom = document.getElementById('formRoom');
const roomIdInput = document.getElementById('roomIdInput');
const roomUserNameInput = document.getElementById('roomUserNameInput');
const btnCreateRoom = document.getElementById('btnCreateRoom');
const btnChooseIdRoom = document.getElementById('btnChooseIdRoom');
const roomOptions = document.getElementById('roomOptions');
const removeRoomOptions = document.getElementById('removeRoomOptions');
const textError = document.getElementById('textError');

function restartOptionsRoom () {
  roomIdInput.value = '';
  roomUserNameInput.value = '';
};

const optionRoom = {
  create: false,
  chooseId: false,
};

btnCreateRoom.addEventListener('click', () => {
  optionRoom.chooseId = false;
  optionRoom.create = true;
  roomOptions.style.display = 'flex';
  restartOptionsRoom();
});

btnChooseIdRoom.addEventListener('click', () => {
  optionRoom.chooseId = true;
  optionRoom.create = false;
  roomOptions.style.display = 'flex';
  restartOptionsRoom();
});

removeRoomOptions.addEventListener('click', () => {
  optionRoom.chooseId = false;
  optionRoom.create = false;
  roomOptions.style.display = 'none';
  restartOptionsRoom();
});

formRoom.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const roomId = roomIdInput.value;
    const roomUserName = roomUserNameInput.value;
    if(!roomId || !roomUserName) return;

    if(optionRoom.create) {
      await fetch(`http://localhost:3333/room`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId }),
      })
        .then(async (datas) => {
          const response = await datas.json();

          if(response.error) {
            textError.textContent = response.error;
            setTimeout(() => {
              textError.textContent = '';
            }, 2000);

            return;
          };
          window.location.href = `./game/game.html?group=${response.id}&username=${roomUserName}`;
        })
        .catch(err => {
          console.log('errorRequest: ', err);
        });

      return;
    };

    await fetch(`http://localhost:3333/room/${roomId}`)
      .then(async (datas) => {
        const response = await datas.json();
        if(response.error) {
          textError.textContent = response.error;
          setTimeout(() => {
            textError.textContent = '';
          }, 2000);

          return;
        };
        window.location.href = `./game/game.html?group=${response.group.id}&username=${roomUserName}`;
      })
      .catch(err => {
        console.log('errorRequest: ', err);
      });

  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
  };
});