const mapDimensions = {
  x: 41,
  y: 11
};
const iterations = 300;
const timeout = 100;
const barrierCount = 150;
const positionsToRemember = 15;

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
  target: '☩',
  targetReached: '☻',
  barrier: '□',
};

const map = [];
const barriers = [];
let targetPosition;
let currPosition;
let currDistance;
let lastPositions;

function initializePositions() {
  barriers.length = 0;
  currPosition = {
    x: Math.floor(mapDimensions.x / 2),
    y: Math.floor(mapDimensions.y / 2)
  };  
  targetPosition = {
    x: Math.floor(Math.random() * mapDimensions.x), 
    y: Math.floor(Math.random() * mapDimensions.y),
  };
  for (let i = 0; i < barrierCount; i++) {
    const x = Math.floor(Math.random() * mapDimensions.x);
    const y = Math.floor(Math.random() * mapDimensions.y);
    if (!(x === currPosition.x && y === currPosition.y) && !(x === targetPosition.x && y === targetPosition.y)) {
      barriers.push({ x, y });
    };
  };
};

function createMap() {
  map.length = 0;
  initializePositions();
  for (let i = 0; i < mapDimensions.y; i++) {
    let currRow = '';
    for (let j = 0; j < mapDimensions.x; j++) {
      currRow+= chars.empty;
    }
    map.push(currRow);
    currRow = '';
  }
  drawOnMap(chars.currentLoc, currPosition);
  drawOnMap(chars.target, targetPosition);
  barriers.forEach(barrier => {
    drawOnMap(chars.barrier, barrier);
  });
  currDistance = getDistanceFromTarget(currPosition);
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

function move(breakthrough = false) {
  const randomDirection = Math.floor(Math.random() * 8);
  let nextPosition;
  let directionChar;
  switch (randomDirection) {
    case 0:
      nextPosition = {
        x: currPosition.x,
        y: currPosition.y - 1,
      };
      directionChar = chars.up;
      break;
    case 1:
      nextPosition = {
        x: currPosition.x + 1,
        y: currPosition.y,
      };
      directionChar = chars.right;
      break;
    case 2:
      nextPosition = {
        x: currPosition.x,
        y: currPosition.y + 1,
      };
      directionChar = chars.down;
      break;
    case 3:
      nextPosition = {
        x: currPosition.x - 1,
        y: currPosition.y,
      };
      directionChar = chars.left;
      break;
    case 4:
      nextPosition = {
        x: currPosition.x + 1,
        y: currPosition.y - 1,
      };
      directionChar = chars.upRight;
      break;
    case 5:
      nextPosition = {
        x: currPosition.x + 1,
        y: currPosition.y + 1,
      };
      directionChar = chars.downRight;
      break;
    case 6:
      nextPosition = {
        x: currPosition.x - 1,
        y: currPosition.y + 1,
      };
      directionChar = chars.downLeft;
      break;
    case 7:
      nextPosition = {
        x: currPosition.x - 1,
        y: currPosition.y - 1,
      };
      directionChar = chars.upLeft;
      break;
  }
  if(nextPosition.x < mapDimensions.x && nextPosition.x >= 0 && nextPosition.y < mapDimensions.y && nextPosition.y >= 0) {
    if (barriers.every(barrier => {
      return !(nextPosition.x === barrier.x && nextPosition.y === barrier.y)
    })) {
      const nextDistance = getDistanceFromTarget(nextPosition);
      if (breakthrough) {
        drawOnMap(directionChar, currPosition);
        currPosition.x = nextPosition.x;
        currPosition.y = nextPosition.y;
        drawOnMap(chars.currentLoc, currPosition);
        currDistance = nextDistance;
      } else if(nextDistance <= currDistance) {
        drawOnMap(directionChar, currPosition);
        currPosition.x = nextPosition.x;
        currPosition.y = nextPosition.y;
        drawOnMap(chars.currentLoc, currPosition);
        currDistance = nextDistance;
      };
    };
  };
  lastPositions.shift();
  lastPositions.push({ x: currPosition.x, y: currPosition.y });
}

function getDistanceFromTarget(position) {
  return Math.abs(Math.sqrt((targetPosition.x - position.x)**2 + (targetPosition.y - position.y)**2));
}

function wait(msec) {
  return new Promise(res => setTimeout(() => res(), msec));
}

(async function run() {
  createMap();
  lastPositions = Array(positionsToRemember).fill({ x: currPosition.x, y: currPosition.y });
  for(let i = 0; i < iterations; i++) {
    console.clear();
    move();
    if (lastPositions.every(position => {
      return position.x === currPosition.x && position.y === currPosition.y;
    })) {
      move(true);
      move(true);
    }
    if(currDistance === 0) {
      drawOnMap(chars.targetReached, currPosition);
      printMap();
      break;
    };
    printMap();
    await wait(timeout);
  }
  await wait(1000);
  run();
})();
