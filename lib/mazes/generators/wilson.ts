import { Cell } from '../';
import { Generator, GeneratorData } from './generator';

export class WilsonData {
  [key: string]: any;
  setStartPosition: boolean;
  startPosX: number;
  startPosY: number;

  setVisitedStartPosition: boolean;
  startVisitedPosX: number;
  startVisitedPosY: number;

  //Directional bias can be immplemented using either the cardinal directions
  // or the direction to turn
  directionBias: 'Cardinal' | 'Turn';
  northChance: number;
  eastChance: number;
  southChance: number;
  westChance: number;

  forwardChance: number;
  leftChance: number;
  rightChance: number;
  backwardChance: number; //Allowed because we aren't forced to not choose a previously visited cell

  constructor() {
    this.setStartPosition = false;
    this.startPosX = 0;
    this.startPosY = 0;

    this.setVisitedStartPosition = false;
    this.startVisitedPosX = 0;
    this.startVisitedPosY = 0;

    this.directionBias = 'Cardinal';
    this.northChance = 25;
    this.eastChance = 25;
    this.southChance = 25;
    this.westChance = 25;

    this.forwardChance = 25;
    this.leftChance = 25;
    this.rightChance = 25;
    this.backwardChance = 25;
  }
}

export class Wilson extends Generator {
  props: WilsonData;

  constructor(baseProps: GeneratorData, props: WilsonData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let currentLoop: Cell[] = []; //functions as stack
    let currentCell: Cell;
    let previousCell: Cell | undefined;
    let copyCell: Cell | undefined;
    let firstLoop: boolean = false;

    for (let i: number = 0; i < this.baseProps.width; i++) {
      for (let j: number = 0; j < this.baseProps.height; j++) {
        if (!this.grid.cells[i][j].masked) {
          mapCells.push(this.grid.cells[i][j]);
        }
      }
    }

    if (
      this.props.setVisitedStartPosition &&
      mapCells.some(
        (a) =>
          a.x === this.props.startVisitedPosX &&
          a.y === this.props.startVisitedPosY
      )
    ) {
      mapCells.filter(
        (a) =>
          a.x === this.props.startVisitedPosX &&
          a.y === this.props.startVisitedPosY
      )[0].visited = true;
    } else {
      mapCells[this.random.GetInt(mapCells.length)].visited = true;
    }

    do {
      currentLoop = [];
      if (firstLoop) {
        if (
          this.props.setStartPosition &&
          mapCells.some(
            (a) =>
              a.x === this.props.startPosX &&
              a.y === this.props.startPosY &&
              !a.visited
          )
        ) {
          currentCell = mapCells.filter(
            (a) => a.x === this.props.startPosX && a.y === this.props.startPosY
          )[0];
        } else {
          currentCell = mapCells[this.random.GetInt(mapCells.length)];
        }
      } else {
        let unvisitedCount = mapCells.filter((a) => !a.visited).length;
        currentCell = mapCells.filter((a) => !a.visited)[
          this.random.GetInt(unvisitedCount)
        ];
      }
      currentLoop.push(currentCell);
      while (!currentCell.visited) {
        copyCell = currentCell;
        currentCell = this.pickNextCell(currentCell, previousCell);
        previousCell = copyCell;
        let x = currentCell.x,
          y = currentCell.y;
        if (currentLoop.some((a) => a.x === x && a.y === y)) {
          while (
            currentLoop[currentLoop.length - 1].x !== x ||
            currentLoop[currentLoop.length - 1].y !== y
          ) {
            currentLoop.pop();
          }
          currentCell = currentLoop[currentLoop.length - 1];
          if (currentLoop.length > 1) {
            previousCell = currentLoop[currentLoop.length - 2];
          } else {
            previousCell = undefined;
          }
        } else {
          currentLoop.push(currentCell);
        }
      }

      for (let i: number = 0; i < currentLoop.length - 1; i++) {
        this.MergeCells(currentLoop[i], currentLoop[i + 1]);
        currentLoop[i].visited = true;
      }
      currentLoop[currentLoop.length - 1].visited = true;
    } while (mapCells.some((a) => !a.visited));
  }

  private pickNextCell(
    currentCell: Cell,
    previousCell: Cell | undefined
  ): Cell {
    let nextCell: Cell;
    let randomMax: number = 0;

    const adjacentCells = currentCell.adjacentCells.filter(
      (a) => a !== undefined
    );

    if (this.props.directionBias === 'Cardinal') {
      if (previousCell !== undefined) {
        let northMax = 0;
        let eastMax = 0;
        let southMax = 0;
        let westMax = 0;
        if (currentCell.adjacentCells[0] !== undefined) {
          northMax = this.props.northChance - 1;
          randomMax += this.props.northChance;
        }
        if (currentCell.adjacentCells[1] !== undefined) {
          eastMax = randomMax + this.props.eastChance - 1;
          randomMax += this.props.eastChance;
        }
        if (currentCell.adjacentCells[2] !== undefined) {
          southMax = randomMax + this.props.southChance - 1;
          randomMax += this.props.southChance;
        }
        if (currentCell.adjacentCells[3] !== undefined) {
          westMax = randomMax + this.props.westChance - 1;
          randomMax += this.props.westChance;
        }

        let randomValue = this.random.GetInt(randomMax);

        if (northMax > 0 && randomValue <= northMax) {
          nextCell = currentCell.adjacentCells[0] as Cell;
        } else if (
          eastMax > northMax &&
          (northMax === 0 || randomValue > northMax) &&
          randomValue <= eastMax
        ) {
          nextCell = currentCell.adjacentCells[1] as Cell;
        } else if (
          southMax > eastMax &&
          (eastMax === 0 || randomValue > eastMax) &&
          randomValue <= southMax
        ) {
          nextCell = currentCell.adjacentCells[2] as Cell;
        } else {
          nextCell = currentCell.adjacentCells[3] as Cell;
        }
      } else {
        nextCell = adjacentCells[
          this.random.GetInt(adjacentCells.length)
        ] as Cell;
      }
    } else {
      if (previousCell !== undefined) {
        let previousCellIndex = currentCell.adjacentCells.indexOf(previousCell);
        let forwardIndex = (previousCellIndex + 2) % 4;
        let forwardMax = 0;
        let leftIndex = (previousCellIndex + 1) % 4;
        let leftMax = 0;
        let rightIndex = (previousCellIndex + 3) % 4;
        let rightMax = 0;
        let backwardIndex = previousCellIndex;
        let backwardMax = 0;

        if (currentCell.adjacentCells[forwardIndex] !== undefined) {
          forwardMax = this.props.forwardChance - 1;
          randomMax += this.props.forwardChance;
        }
        if (currentCell.adjacentCells[leftIndex] !== undefined) {
          leftMax = randomMax + this.props.leftChance - 1;
          randomMax += this.props.leftChance;
        }
        if (currentCell.adjacentCells[rightIndex] !== undefined) {
          rightMax = randomMax + this.props.rightChance - 1;
          randomMax += this.props.rightChance;
        }
        if (currentCell.adjacentCells[backwardIndex] !== undefined) {
          backwardMax = randomMax + this.props.backwardChance - 1;
          randomMax += this.props.backwardChance;
        }

        let randomValue = this.random.GetInt(randomMax);

        if (forwardMax > 0 && randomValue <= forwardMax) {
          nextCell = currentCell.adjacentCells[forwardIndex] as Cell;
        } else if (
          leftMax > forwardMax &&
          (forwardMax === 0 || randomValue > forwardMax) &&
          randomValue <= leftMax
        ) {
          nextCell = currentCell.adjacentCells[leftIndex] as Cell;
        } else if (
          rightMax > leftMax &&
          (leftMax === 0 || randomValue > leftMax) &&
          randomValue <= rightMax
        ) {
          nextCell = currentCell.adjacentCells[rightIndex] as Cell;
        } else {
          nextCell = currentCell.adjacentCells[backwardIndex] as Cell;
        }
      } else {
        nextCell = adjacentCells[
          this.random.GetInt(adjacentCells.length)
        ] as Cell;
      }
    }

    return nextCell;
  }
}
