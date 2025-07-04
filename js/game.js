const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const characters = [
  'cry',
  'cute',
  'silly',
  'magic',
  'witch',
  'happy',
  'boo',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let lockBoard = false;

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 14) {
    clearInterval(this.loop);

    const endContainer = document.getElementById('end-container');

    endContainer.innerHTML = `
      <div class="end-message">
        <p>Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${timer.innerHTML}s</p>
        <button id="restart-btn">Jogar Novamente</button>
      </div>
    `;

    endContainer.style.display = 'flex';
    startConfetti();

    setTimeout(() => {
      const restartBtn = document.getElementById('restart-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          location.reload(); // Recarrega a página
        });
      }
    }, 100);
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';
    lockBoard = false;

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
      lockBoard = false;
    }, 800);
  }
};

const revealCard = ({ target }) => {
  if (lockBoard) return;

  const card = target.parentNode;

  if (card.className.includes('reveal-card') || card === firstCard) return;

  card.classList.add('reveal-card');

  if (firstCard === '') {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    checkCards();
  }
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
};

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

// FUNÇÃO DE CONFETTI - ESCOP0 GLOBAL
function startConfetti() {
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'confetti-canvas';
  document.body.appendChild(confettiCanvas);

  const confetti = confettiCanvas.getContext('2d');

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.top = '0';
  confettiCanvas.style.left = '0';
  confettiCanvas.style.width = '100vw';
  confettiCanvas.style.height = '100vh';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = '9999';

  const numPieces = 150;
  const pieces = [];

  for (let i = 0; i < numPieces; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * numPieces,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function draw() {
    confetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = 0; i < numPieces; i++) {
      const p = pieces[i];
      confetti.beginPath();
      confetti.lineWidth = p.r;
      confetti.strokeStyle = p.color;
      confetti.moveTo(p.x + p.tilt + p.r / 3, p.y);
      confetti.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
      confetti.stroke();
    }

    update();
    requestAnimationFrame(draw);
  }

  function update() {
    for (let i = 0; i < numPieces; i++) {
      const p = pieces[i];
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y > confettiCanvas.height) {
        p.y = -20;
        p.x = Math.random() * confettiCanvas.width;
      }
    }
  }

  draw();
}

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();
};
