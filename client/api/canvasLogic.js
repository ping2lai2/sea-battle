//параметры много где используются, впринципе многие функции здесь можно сделать чстыми, просто п
const lineGridSize = 1,
  gridColor = '#666',
  cellsNumber = 10,
  cellSize = 32, //px
  offsetLeft = 30, //px
  offsetTop = 30, //px
  fullCellSize = cellSize + lineGridSize,
  gridSize = cellsNumber * (cellSize + lineGridSize) + lineGridSize;

const mainColor = 'rgba(50,50,150,0.3)',
  mainStrokeColor = '#0101c1',
  destroyedMainColor = 'rgba(250,50,100,0.3)',
  destroyedMainStrokeColor = '#a10141',
  strokeWidth = 1, //px
  frameWidth = 3, //px
  resolveColor = 'rgba(50,200,0,0.7)',
  forbidColor = 'rgba(200,50,0,0.7)';

export const gridParams = {
  lineGridSize,
  gridColor,
  cellsNumber,
  cellSize,
  offsetLeft,
  offsetTop,
  fullCellSize,
};

export const shipsParams = {
  mainColor,
  destroyedMainColor,
  destroyedMainStrokeColor,
  mainStrokeColor,
  strokeWidth,
  resolveColor,
  forbidColor,
  gridSize,
};

export const shipsData = [4, 3, 2, 1]; // 4-cell: 1, 3-cell: 2...

export const createCanvasData = ships => {
  return ships.map(ship => {
    const length = ship.coordinates.length - 1;
    const coordinates = ship.coordinates;
    const x0 = coordinates[0][0],
      y0 = coordinates[0][1];
    const canvasX0 = x0 * fullCellSize + offsetLeft,
      canvasY0 = y0 * fullCellSize + offsetTop;

    return {
      x: canvasX0,
      y: canvasY0,
      width: (coordinates[length][0] - x0 + 1) * fullCellSize,
      height: (coordinates[length][1] - y0 + 1) * fullCellSize,
      isDestroyed: ship.isDestroyed,
    };
  });
};

export const restoreToCellsType = ship => {
  const restoredShip = getCellCoordinate(ship);
  //restoredShip.x = Math.round((ship.x - offsetLeft) / fullCellSize);
  //restoredShip.y = Math.round((ship.y - offsetTop) / fullCellSize);

  restoredShip.coordinates = [];

  const isHorizontal = ship.width > ship.height;
  restoredShip.width = Math.round(ship.width / fullCellSize);
  restoredShip.height = Math.round(ship.height / fullCellSize);
  restoredShip.isDestroyed = false;

  restoredShip.length = isHorizontal ? restoredShip.width : restoredShip.height;

  for (let i = 0; i < restoredShip.length; i++) {
    const xc = restoredShip.x + i * isHorizontal;
    const yc = restoredShip.y + i * !isHorizontal;
    restoredShip.coordinates.push([xc, yc, false]);
  }

  return restoredShip;
};

export const generateShipsWithabroadPosition = (ships = [4, 3, 2, 1]) => {
  const canvasAdroadSips = [];
  for (let i = 0; i < ships.length; i++) {
    const currentShipType = ships[i];
    for (let j = 0; j <= i; j++) {
      const ship = {
        width: currentShipType * fullCellSize,
        height: fullCellSize,
        isDestroyed: false,
      };
      ship.x = offsetLeft + gridSize + fullCellSize + (ship.width + 10) * j;
      ship.y = offsetTop + (fullCellSize + 10) * i;
      canvasAdroadSips.push(ship);
    }
  }

  return canvasAdroadSips;
};
//TODO: сомнительное решение, в итоге нам приходится клонировать объект, с.м. placement-ships, в добавок, я же её эспорчу
export const abroadShips = generateShipsWithabroadPosition(); 

export const isShipOnGrid = ship =>
  gridSize + offsetLeft + cellSize / 2 > ship.x + ship.width &&
  offsetLeft - cellSize / 2 < ship.x &&
  gridSize + offsetTop + cellSize / 2 > ship.y + ship.height &&
  offsetTop - cellSize / 2 < ship.y;

export const canPutShipInCell = (ship, busyCellsMatrix) => {
  //if (isShipOnGrid(ship)) {
  const checkShip = restoreToCellsType(ship);

  const isHorizontal = checkShip.width > checkShip.height;
  if (checkShip) {
    for (let i = 0; i < checkShip.length; i++) {
      if (
        busyCellsMatrix[checkShip.x + i * isHorizontal][
          checkShip.y + i * !isHorizontal
        ] > 0
      ) {
        return false;
      }
    }
    return checkShip;
  }

  //}
};

export const getCellCoordinate = coord => ({
  x: Math.round((coord.x - offsetLeft) / fullCellSize),
  y: Math.round((coord.y - offsetTop) / fullCellSize),
});

export const restoreCellCoordinate = cell => ({
  x: cell.x * fullCellSize + offsetLeft,
  y: cell.y * fullCellSize + offsetTop,
});


/**********************/
/****canvas draving****/
/**********************/

export const drawGrid = ctx => {
  ctx.beginPath();
  ctx.lineWidth = lineGridSize;
  ctx.strokeStyle = gridColor;

  for (let i = 0; i <= cellsNumber; i++) {
    ctx.moveTo(offsetLeft + i * fullCellSize, offsetTop);
    ctx.lineTo(
      offsetLeft + i * fullCellSize,
      fullCellSize * cellsNumber + offsetTop
    );
    ctx.moveTo(offsetLeft, offsetTop + i * fullCellSize);
    ctx.lineTo(
      fullCellSize * cellsNumber + offsetLeft,
      offsetTop + i * fullCellSize
    );
  }

  ctx.stroke();
  ctx.closePath();
};

export const drawShips = (ctx, ships) => {
  for (let ship of ships) {
    ctx.beginPath();
    ctx.rect(ship.x, ship.y, ship.width, ship.height);
    ctx.fillStyle = ship.isDestroyed ? destroyedMainColor : mainColor;
    ctx.fill();
    ctx.strokeStyle = ship.isDestroyed
      ? destroyedMainStrokeColor
      : mainStrokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(ship.x, ship.y, ship.width, ship.height);

    ctx.closePath();
  }
};

export const drawMatrixState = (ctx, matrix) => {
  matrix.forEach((row, i) =>
    row.forEach((cell, j) => {
      switch (cell) {
      case 1:
      case 2:
      case 3:
      case 4:
        drawBusyCell(ctx, { x: i, y: j });
        return false;
      case 6:
        drawMissCell(ctx, { x: i, y: j });
        return false;
      case 7:
        drawHitCell(ctx, { x: i, y: j });
        return false;
      }
    })
  );
};

const drawMissCell = (ctx, cell) => {
  const { x, y } = restoreCellCoordinate(cell);
  ctx.beginPath();
  ctx.fillStyle = '#444';
  ctx.strokeStyle = forbidColor;
  ctx.arc(x + fullCellSize / 2, y + fullCellSize / 2, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

const drawBusyCell = (ctx, cell) => {
  const { x, y } = restoreCellCoordinate(cell);
  ctx.beginPath();
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = strokeWidth + 1;
  ctx.arc(x + fullCellSize / 2, y + fullCellSize / 2, 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

const drawHitCell = (ctx, cell) => {
  const { x, y } = restoreCellCoordinate(cell);
  ctx.beginPath();
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = strokeWidth;
  ctx.moveTo(x, y);
  ctx.lineTo(x + fullCellSize, y + fullCellSize);
  ctx.moveTo(x + fullCellSize, y);
  ctx.lineTo(x, y + fullCellSize);
  ctx.stroke();
  ctx.closePath();
};

export const drawFrame = (ctx, ship, isCanPut) => {
  ctx.strokeStyle = isCanPut ? resolveColor : forbidColor;
  ctx.lineWidth = frameWidth;
  ctx.strokeRect(
    ship.x - frameWidth,
    ship.y - frameWidth,
    ship.width + frameWidth * 2,
    ship.height + frameWidth * 2
  );

  ctx.closePath();
};
export const drawAccessFrame = (ctx, currentCanvasShip, busyCellsMatrix) => {
  if (isShipOnGrid(currentCanvasShip)) {
    if (
      canPutShipInCell(currentCanvasShip, busyCellsMatrix)
    ) {
      drawFrame(ctx, currentCanvasShip, true);
    } else {
      drawFrame(ctx, currentCanvasShip, false);
    }
  }
};

export const drawShootAccessFrame = (ctx, x, y) => {
  if (
    x > offsetLeft &&
    x < gridSize + offsetLeft &&
    y > offsetTop &&
    y < gridSize + offsetTop
  ) {
    const canvasX = Math.round(x / fullCellSize - 0.5) * fullCellSize;
    const canvasY = Math.round(y / fullCellSize - 0.5) * fullCellSize;
    ctx.strokeStyle = forbidColor;
    ctx.lineWidth = frameWidth;
    ctx.strokeRect(
      canvasX - frameWidth,
      canvasY - frameWidth,
      fullCellSize,
      fullCellSize
    );
  }

  ctx.closePath();
};
