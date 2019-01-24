export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getObjKey = (obj, val) =>
  Object.keys(obj).find(key => obj[key] === val);

export const hardClone = obj => JSON.parse(JSON.stringify(obj));

export const generateRandomShipsCoordinates = (ships = [4, 3, 2, 1]) => {
  let busyCellsMatrix = Array.from(Array(10), () => Array(10).fill(0));
  let ship = {};
  const shipsOnGrid = [];

  for (let i = 0; i < ships.length; i++) {
    const currentShipType = ships[i];
    for (let j = 0; j <= i; j++) {
      ({ busyCellsMatrix, ship } = getRandomCoordinates(
        currentShipType,
        busyCellsMatrix
      ));
      shipsOnGrid.push(ship);
    }
  }
  return { busyCellsMatrix, ships: shipsOnGrid }; // TODO: надо это распилить наверное
};

export const createBusyCells = (min, max) => [
  min == 0 ? min : min - 1,
  max == 9 ? max : max + 1, //т.к. в циклах i<smth, a ne i<=smth
];

export const getRandomCoordinates = (length, busyCellsMatrix) => {
  const isHorizontal = getRandomInt(0, 1);
  const width = isHorizontal ? length : 1;
  const height = !isHorizontal ? length : 1;

  const x = getRandomInt(0, 10 - width);
  const y = getRandomInt(0, 10 - height);

  const coordinates = [];

  for (let i = 0; i < length; i++) {
    if (busyCellsMatrix[x + i * isHorizontal][y + i * !isHorizontal] > 0) {
      return getRandomCoordinates(length, busyCellsMatrix);
    }
  }

  const busyCellsX = createBusyCells(x, x + width - 1);
  const busyCellsY = createBusyCells(y, y + height - 1);

  for (let i = busyCellsX[0]; i <= busyCellsX[1]; i++) {
    for (let j = busyCellsY[0]; j <= busyCellsY[1]; j++) {
      busyCellsMatrix[i][j] = busyCellsMatrix[i][j] + 1;
    }
  }

  for (let i = 0; i < length; i++) {
    const xc = x + i * isHorizontal;
    const yc = y + i * !isHorizontal;
    coordinates.push({ x: xc, y: yc, isDestroyed: false });
    busyCellsMatrix[xc][yc] = 5;
  }

  return {
    busyCellsMatrix,
    ship: {
      length,
      width,
      height,
      x,
      y,
      coordinates,
      busyCellsX,
      busyCellsY,
      isDestroyed: false,
    },
  };
};
