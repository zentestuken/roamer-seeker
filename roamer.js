const mapDimensions = {
  x: 21,
  y: 21
};

const chars = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
  upRight: '↗',
  downRight: '↘',
  downLeft: '↙',
  upLeft: '↖',
  currentLoc: '⬦',
  topBorder: '🭶',
  rightBorder: '🭵',
  bottomBorder: '🭻',
  leftBorder: '🭰',
  empty: ' ',
};

const map = [];

const currPosition = {
  x: Math.floor(mapDimensions.x / 2),
  y: Math.floor(mapDimensions.y / 2)
};

const iterations = 300;

const timeout = 100;

function createMap() {
  for (let i = 0; i < mapDimensions.y; i++) {
    let currRow = '';
    for (let j = 0; j < mapDimensions.x; j++) {
      currRow+= chars.empty;
    }
    map.push(currRow);
    currRow = '';
  }
  drawOnMap(chars.currentLoc, {x: currPosition.x, y: currPosition.y});
}

function printMap() {
  let mapString = '';
  map.forEach((row, index) => {
    const currRow = row.split('').join(chars.empty + chars.empty);
    if (!index) mapString+= `${chars.leftBorder}${Array(currRow.length).fill(chars.topBorder).join('')}${chars.rightBorder}\n`;
    mapString+= chars.leftBorder + currRow + chars.rightBorder + '\n';
    if (index === map.length - 1) mapString+= `${chars.leftBorder}${Array(currRow.length).fill(chars.bottomBorder).join('')}${chars.rightBorder}`;
  })
  console.log(mapString);
}

function drawOnMap(char, { x, y }) {
  const targetRow = map[y].split('');
  targetRow[x] = char;
  map[y] = targetRow.join('');
}

function move() {
  const randomDirection = Math.floor(Math.random() * 8);
  switch (randomDirection) {
    case 0:
      if (currPosition.y - 1 >= 0) {
        drawOnMap(chars.up, currPosition);
        currPosition.y--;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 1:
      if (currPosition.x + 1 < mapDimensions.x) {
        drawOnMap(chars.right, currPosition);
        currPosition.x++;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 2:
      if (currPosition.y + 1 < mapDimensions.y) {
        drawOnMap(chars.down, currPosition);
        currPosition.y++;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 3:
      if (currPosition.x - 1 >= 0) {
        drawOnMap(chars.left, currPosition);
        currPosition.x--;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 4:
      if (currPosition.x + 1 < mapDimensions.x && currPosition.y - 1 >= 0) {
        drawOnMap(chars.upRight, currPosition);
        currPosition.x++;
        currPosition.y--;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 5:
      if (currPosition.x + 1 < mapDimensions.x && currPosition.y + 1 < mapDimensions.y) {
        drawOnMap(chars.downRight, currPosition);
        currPosition.x++;
        currPosition.y++;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 6:
      if (currPosition.x - 1 >= 0 && currPosition.y + 1 < mapDimensions.y) {
        drawOnMap(chars.downLeft, currPosition);
        currPosition.x--;
        currPosition.y++;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
    case 7:
      if (currPosition.x - 1 >= 0 && currPosition.y - 1 >= 0) {
        drawOnMap(chars.upLeft, currPosition);
        currPosition.x--;
        currPosition.y--;
        drawOnMap(chars.currentLoc, currPosition);
      }
      break;
  }
}

function wait(msec) {
  return new Promise(res => setTimeout(() => res(), msec));
}

(async function run() {
  createMap();
  for(let i = 0; i < iterations; i++) {
    console.clear();
    move();
    printMap();
    await wait(timeout);
  }
})();
