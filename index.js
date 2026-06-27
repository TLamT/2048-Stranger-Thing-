document.addEventListener('DOMContentLoaded', function () {
  const size = 4;
  let grid = [];
  let timerInterval = null;
  let startTime = null;
  let lastMax = 0;
  const timeEl = document.getElementById('time');
  const highScoreEl = document.getElementById('highScore');
  const container = document.getElementById('container');
  const restartBtn = document.getElementById('restart');

  const tileClass = value =>
    value === 0 ? ''
    : value <= 2048 ? 'tile-' + value
    : 'tile-super';

  function getTileText(value) {
    if (value === 0) return '';
    return value >= 1000 ? (value / 1000).toFixed(1) + 'K' : String(value);
  }

  function createEmptyGrid() {
    return Array.from({ length: size }, () => Array(size).fill(0));
  }

  function getEmptyCells() {
    const cells = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) cells.push({ i, j });
      }
    }
    return cells;
  }

  function generateNumber() {
    const empty = getEmptyCells();
    if (empty.length === 0) return;
    const { i, j } = empty[Math.floor(Math.random() * empty.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  function getMaxNumber() {
    let max = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] > max) max = grid[i][j];
      }
    }
    return max;
  }

  function draw(merged) {
    container.innerHTML = '';
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = document.createElement('div');
        tile.className = 'cell ' + tileClass(grid[i][j]);
        tile.textContent = getTileText(grid[i][j]);
        container.appendChild(tile);
      }
    }
    const max = getMaxNumber();
    highScoreEl.textContent = max;
    if (typeof updateDemogorgon === 'function') {
      updateDemogorgon(max, merged);
    }
  }

  function compressAndMerge(line) {
    const filtered = line.filter(v => v !== 0);
    const merged = [];
    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }
    while (merged.length < size) merged.push(0);
    return merged;
  }

  function arraysEqual(a, b) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (a[i][j] !== b[i][j]) return false;
      }
    }
    return true;
  }

  function moveLeft() {
    const before = grid.map(row => [...row]);
    for (let i = 0; i < size; i++) grid[i] = compressAndMerge(grid[i]);
    return !arraysEqual(before, grid);
  }

  function moveRight() {
    const before = grid.map(row => [...row]);
    for (let i = 0; i < size; i++) grid[i] = compressAndMerge(grid[i].reverse()).reverse();
    return !arraysEqual(before, grid);
  }

  function moveUp() {
    const before = grid.map(row => [...row]);
    for (let j = 0; j < size; j++) {
      const col = [];
      for (let i = 0; i < size; i++) col.push(grid[i][j]);
      const merged = compressAndMerge(col);
      for (let i = 0; i < size; i++) grid[i][j] = merged[i];
    }
    return !arraysEqual(before, grid);
  }

  function moveDown() {
    const before = grid.map(row => [...row]);
    for (let j = 0; j < size; j++) {
      const col = [];
      for (let i = size - 1; i >= 0; i--) col.push(grid[i][j]);
      const merged = compressAndMerge(col);
      for (let i = 0; i < size; i++) grid[size - 1 - i][j] = merged[i];
    }
    return !arraysEqual(before, grid);
  }

  function isGameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 0) return false;
        if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }

  function showGameOver() {
    container.innerHTML =
      '<div class="game-over">' +
        '<div class="text">GAME OVER</div>' +
        '<div class="sub">the upside down claims another</div>' +
      '</div>';
  }

  function handleMove(dir) {
    let moved = false;
    switch (dir) {
      case 'left':  moved = moveLeft(); break;
      case 'right': moved = moveRight(); break;
      case 'up':    moved = moveUp(); break;
      case 'down':  moved = moveDown(); break;
    }
    if (moved) {
      generateNumber();
      const max = getMaxNumber();
      const merged = max > lastMax;
      lastMax = max;
      draw(merged);
      if (isGameOver()) {
        clearInterval(timerInterval);
        timerInterval = null;
        showGameOver();
      }
    }
  }

  function init() {
    grid = createEmptyGrid();
    lastMax = 0;
    generateNumber();
    generateNumber();
    draw(false);
  }

  function startGame() {
    clearInterval(timerInterval);
    restartBtn.textContent = '↻ RESTART';
    startTime = Date.now();
    timerInterval = setInterval(() => {
      timeEl.textContent = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    init();
  }

  restartBtn.addEventListener('click', startGame);

  document.addEventListener('keydown', function (e) {
    const map = {
      ArrowLeft: 'left', ArrowRight: 'right',
      ArrowUp: 'up', ArrowDown: 'down',
    };
    const dir = map[e.key];
    if (dir) {
      e.preventDefault();
      handleMove(dir);
    }
  });

  document.querySelectorAll('[data-dir]').forEach(btn => {
    btn.addEventListener('click', function () {
      handleMove(this.dataset.dir);
    });
  });

  let touchStartX = 0, touchStartY = 0;
  container.addEventListener('touchstart', function (e) {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  container.addEventListener('touchend', function (e) {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    if (absDx > absDy) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });
});
