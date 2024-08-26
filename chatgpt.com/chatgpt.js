// adapted from https://github.com/b-chen00/spicetify-themes/tree/master/StarryNight

function waitForElement(els, func, timeout = 100) {
  const queries = els.map((el) => document.querySelector(el));
  if (queries.every((a) => a)) {
    func(queries);
  } else if (timeout > 0) {
    setTimeout(waitForElement, 300, els, func, --timeout);
  }
}

function random(min, max) { // min inclusive max exclusive
  return Math.random() * (max-min) + min;
}

function randomInt(min, max) { // min inclusive max exclusive
  return Math.floor(Math.random() * (max-min)) + min;
}

function createShootingStar(backgroundContainer, rs) {
  const shootingstar = document.createElement('span');
  shootingstar.className = 'shooting-star';

  const prTopSpawn = window.innerWidth / (window.innerHeight + window.innerWidth);
  const maxStarSize = parseInt(rs.getPropertyValue('--star-max-size'), 10);
  const starGlowRadius = parseInt(rs.getPropertyValue('--shooting-star-glow-radius'), 10);
  let ssTop, ssLeft;
  if (Math.random() < prTopSpawn) { // spawn from top
    ssTop = `-${maxStarSize + 2*starGlowRadius + 1}px`;
    ssLeft = `${random(0, 100)}%`;
  } else { // spawn from left
    ssTop = `${random(0, 100)}%`;
    ssLeft = `-${maxStarSize + 2*starGlowRadius + 1}px`;
  }

  const cssText = `
    top: ${ssTop};
    left: ${ssLeft};
    animation-duration: ${random(1, 5)}s;
    animation-delay: ${random(0, 20)}s;
  `;
  shootingstar.style.cssText = cssText;

  shootingstar.addEventListener('animationend', () => {
    shootingstar.remove();
    createShootingStar(backgroundContainer, rs);
  });

  backgroundContainer.appendChild(shootingstar);
}

waitForElement(['.z-0'], ([topContainer]) => {
  const r = document.documentElement;
  const rs = window.getComputedStyle(r);

  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'star-bg-container';
  topContainer.appendChild(backgroundContainer);

  // position stars and shooting stars between the background and everything else
  const rootElement = document.querySelector('.z-0');
  rootElement.style.zIndex = '0';

  // static stars
  const canvasSize = backgroundContainer.clientWidth * backgroundContainer.clientHeight;
  const starsFraction = canvasSize / 5000;
  for (let i = 0; i < starsFraction; i++) {
    const star = document.createElement('div');
    const size = randomInt(1, parseInt(rs.getPropertyValue('--star-max-size'))+1, 10);
    const cssText = `
      position: absolute;
      left: ${random(0, 100)}%;
      top: ${random(0, 100)}%;
      opacity: ${random(0.2, 0.8)};
      width: ${size}px;
      height: ${size}px;
      background-color: ${rs.getPropertyValue('--star')};
      z-index: -1;
      border-radius: 50%;
    `;
    star.style.cssText = cssText;

    if (Math.random() < 0.5) {
      star.style.animation = `twinkle${randomInt(1,5)} 5s infinite`;
    }

    backgroundContainer.appendChild(star);
  }

  // shooting stars
  for (let i = 0; i < 4; i++) {
    createShootingStar(backgroundContainer, rs);
  }
});