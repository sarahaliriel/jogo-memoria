const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');
const starfall = document.querySelector('.starfall');

const maxLength = 8;

const validateInput = ({ target }) => {
  if (target.value.length > maxLength) {
    target.value = target.value.slice(0, maxLength);
  }

  if (target.value.length > 2) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'true');
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  form.style.display = 'none';
  if (starfall) starfall.classList.add('hide');

  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loading');

  const dots = document.createElement('div');
  dots.classList.add('loading-dots');
  dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';

  loadingDiv.appendChild(dots);
  document.body.appendChild(loadingDiv);

  localStorage.setItem('player', input.value);

  setTimeout(() => {
    window.location = 'pages/game.html';
  }, 4000);
};


input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);
