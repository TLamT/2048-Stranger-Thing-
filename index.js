
document.addEventListener('DOMContentLoaded', function () {
    function getMaxNumber() {
        let max = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] > max) {
                    max = grid[i][j];
                }
            }
        }
        return max;
    }
    const size = 4;
    let grid = [];
    let hasMerged = [];
    function init() {
        // 初始化格子
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            hasMerged[i] = [];
            for (let j = 0; j < size; j++) {
                grid[i][j] = 0;
                hasMerged[i][j] = false;
            }
        }
        // 放兩個隨機數字
        generateNumber();
        generateNumber();
        draw();
    }

    function generateNumber() {
        let emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({ i, j });
                }
            }
        }
        if (emptyCells.length === 0) return;
        const rand = Math.floor(Math.random() * emptyCells.length);
        const cell = emptyCells[rand];
        grid[cell.i][cell.j] = Math.random() < 0.9 ? 2 : 4;
    }

    function draw() {
        const container = document.getElementById('container');
        container.innerHTML = '';
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const tile = document.createElement('div');
                tile.className = 'cell';
                tile.innerText = grid[i][j] === 0 ? '' : grid[i][j];
                tile.style.backgroundColor = getColor(grid[i][j]);
                container.appendChild(tile);
            }
        }
        const maxScore = getMaxNumber();
        document.getElementById('highScore').innerText = maxScore;
        document.getElementById('highScore').style.color = "red";
        document.getElementById('highScore').style.fontSize = "1.5em";
        if (maxScore >= 2048) {
            document.body.style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/260/579/821/stranger-things-netflix-hd-wallpaper-preview.jpg')";
            document.body.style.backgroundSize = "cover";
        } else if (maxScore >= 1024) {
            document.body.style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/165/989/92/tv-show-stranger-things-wallpaper-preview.jpg')";
            document.body.style.backgroundSize = "cover";
        } else if (maxScore >= 512) {
            document.body.style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/781/234/453/stranger-things-netflix-tv-millie-bobby-brown-wallpaper-preview.jpg')";
            document.body.style.backgroundSize = "cover";
        } else if (maxScore >= 256) {
            document.body.style.backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/154/534/421/tv-show-stranger-things-dustin-henderson-gaten-matarazzo-joe-keery-hd-wallpaper-preview.jpg')";
            document.body.style.backgroundSize = "cover";
        } else if (maxScore >= 128) {
            document.body.style.backgroundImage = "url('https://www.roomie.tw/wp-content/uploads/2025/07/StrangerThings5.jpg')";
            document.body.style.backgroundSize = "cover";
        } else if (maxScore >= 32) {
            document.body.style.backgroundImage = "url('https://hips.hearstapps.com/amv-prod-elletw.s3.amazonaws.com/new-dossier/guai_qi_wu_yu_2_zhu_shi_jue_hai_bao_.jpg')";
            document.body.style.backgroundSize = "cover";
        }
    }
    function getColor(value) {
        switch (value) {
            case 0: return '#cdc1b4';
            case 2: return '#eee4da';
            case 4: return '#ede0c8';
            case 8: return '#f2b179';
            case 16: return '#f59563';
            case 32: return '#f67c5f';
            case 64: return '#f65e3b';
            case 128: return '#edcf72';
            case 256: return '#edcc61';
            case 512: return '#edc850';
            case 1024: return '#edc53f';
            case 2048: return '#edc22e';
            default: return '#3c3a32';
        }
    }
    document.addEventListener('keydown', function (e) {
        let moved = false;
        if (e.key === 'ArrowLeft') {
            moved = moveLeft();
        } else if (e.key === 'ArrowRight') {
            moved = moveRight();
        } else if (e.key === 'ArrowUp') {
            moved = moveUp();
        } else if (e.key === 'ArrowDown') {
            moved = moveDown();
        }
        if (moved) {
            generateNumber();
            draw();
            if (isGameOver()) {
                clearInterval(timerInterval);
                timerInterval = null;
                const container = document.getElementById('container');
                container.innerHTML = '<h2>Game Over!</h2>';
                container.style.cssText = ' background: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red); background-clip: text; -webkit-background-clip: text; color: transparent; font-size: 5em; display: flex; justify-content: center; align-items: center; animation: fadeIn 5s linear infinite;';
            }
        }
    });


    function moveLeft() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let row = grid[i];
            let newRow = compressAndMerge(row);
            if (!arraysEqual(row, newRow)) {
                grid[i] = newRow;
                moved = true;
            }
        }
        resetMergeFlags();
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let row = [...grid[i]].reverse();
            let newRow = compressAndMerge(row);
            newRow.reverse();
            if (!arraysEqual(grid[i], newRow)) {
                grid[i] = newRow;
                moved = true;
            }
        }
        resetMergeFlags();
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < size; j++) {
            let column = [];
            for (let i = 0; i < size; i++) column.push(grid[i][j]);
            let newCol = compressAndMerge(column);
            for (let i = 0; i < size; i++) {
                if (grid[i][j] !== newCol[i]) {
                    grid[i][j] = newCol[i];
                    moved = true;
                }
            }
        }
        resetMergeFlags();
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < size; j++) {
            let column = [];
            for (let i = size - 1; i >= 0; i--) column.push(grid[i][j]);
            let newCol = compressAndMerge(column);
            newCol.reverse();
            for (let i = 0; i < size; i++) {
                if (grid[i][j] !== newCol[i]) {
                    grid[i][j] = newCol[i];
                    moved = true;
                }
            }
        }
        resetMergeFlags();
        return moved;
    }
    function compressAndMerge(line) {
        let newLine = line.filter(val => val !== 0);
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                newLine[i + 1] = 0;
            }
        }
        newLine = newLine.filter(val => val !== 0);
        while (newLine.length < size) {
            newLine.push(0);
        }
        return newLine;
    }

    function arraysEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function resetMergeFlags() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                hasMerged[i][j] = false;
            }
        }
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
    const time =document.getElementById("time")
   let startTime = null;
    let timerInterval = null;
    
    document.getElementById('restart').addEventListener('click', function () {
        document.getElementById('restart').innerText = "Restart";
            startTime = Date.now();
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                time.innerText = elapsed;
            }, 1000);
        init()
    });
   
});