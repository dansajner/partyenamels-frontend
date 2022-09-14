import { Cell } from '../maze-parts/cell';
import { Generator, GeneratorData } from './generator';

export class HuntAndKillData {
  [key: string]: any;
  setStartPosition: boolean;
  startPosX: number;
  startPosY: number;

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

  //LRTB - Left to Right, then Top to Bottom
  //RLTB - Right to Left, then Top to Bottom
  //LRBT - Left to Right, then Bottom to Top
  //RLBT - Right to Left, then Bottom to Top
  //TBLR - Top to Bottom, then Left to Right
  //BTLR - Bottom to Top, then Left to Right
  //TBRL - Top to Bottom, then Right to Left
  //BTRL - Bottom to Top, then Right to Left
  //R - Random
  searchPattern: 'LRTB' | 'RLTB' | 'LRBT' | 'RLBT' | 'TBLR' | 'BTLR' | 'TBRL' | 'BTRL' | 'R';

  constructor() {
    this.setStartPosition = false;
    this.startPosX = 0;
    this.startPosY = 0;

    this.directionBias = 'Cardinal';
    this.northChance = 25;
    this.eastChance = 25;
    this.southChance = 25;
    this.westChance = 25;

    this.forwardChance = 25;
    this.leftChance = 25;
    this.rightChance = 25;
    this.backwardChance = 25;

    this.searchPattern = 'R';
  }
}

export class HuntAndKill extends Generator {
  props: HuntAndKillData;

  constructor(baseProps: GeneratorData, props: HuntAndKillData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let currentCell: Cell | undefined;
    let nextCell: Cell | undefined;
    let previousCell: Cell | undefined;

    for (let i: number = 0; i < this.baseProps.width; i++) {
      for (let j: number = 0; j < this.baseProps.height; j++) {
        if (!this.grid.cells[i][j].masked) {
          mapCells.push(this.grid.cells[i][j]);
        }
      }
    }

    if (
      this.props.setStartPosition &&
      mapCells.some((a) => a.x === this.props.startPosX && a.y === this.props.startPosY)
    ) {
      currentCell = mapCells.filter((a) => a.x === this.props.startPosX && a.y === this.props.startPosY)[0];
    } else {
      currentCell = mapCells[this.random.GetInt(mapCells.length)];
    }

    currentCell.visited = true;

    do {
      nextCell = this.pickNextCell(currentCell as Cell, previousCell);

      if (!nextCell.visited) {
        previousCell = currentCell;
        this.MergeCells(currentCell as Cell, nextCell);
        currentCell = nextCell;
        currentCell.visited = true;
      } else {
        currentCell = undefined;

        if (this.props.searchPattern === 'R') {
          let cellsToChooseFrom = mapCells.filter(
            (a) => !a.visited && a.adjacentCells.some((b) => b !== undefined && b.visited)
          );
          currentCell = cellsToChooseFrom[this.random.GetInt(cellsToChooseFrom.length)];

          previousCell = undefined;

          this.MergeCells(
            currentCell as Cell,
            (currentCell as Cell).adjacentCells.filter((a) => a !== undefined && a.visited)[0]
          );
          (currentCell as Cell).visited = true;
        } else {
          let iIncrement = -1;
          let jIncrement = -1;

          let i = this.baseProps.width - 1;
          let j = this.baseProps.height - 1;

          let iStart = this.baseProps.width - 1;
          let jStart = this.baseProps.height - 1;

          let iEnd = 0;
          let jEnd = 0;

          switch (this.props.searchPattern) {
            case 'LRTB':
            case 'TBLR':
              i = 0;
              j = this.baseProps.height - 1;
              iIncrement = 1;
              jIncrement = -1;
              iStart = i;
              jStart = j;
              iEnd = this.baseProps.width - 1;
              jEnd = 0;
              break;
            case 'RLTB':
            case 'TBRL':
              i = this.baseProps.width - 1;
              j = this.baseProps.height - 1;
              iIncrement = -1;
              jIncrement = -1;
              iStart = i;
              jStart = j;
              iEnd = 0;
              jEnd = 0;
              break;
            case 'LRBT':
            case 'BTLR':
              i = 0;
              j = 0;
              iIncrement = 1;
              jIncrement = 1;
              iStart = i;
              jStart = j;
              iEnd = 0;
              jEnd = 0;
              break;
            case 'RLBT':
            case 'BTRL':
              i = this.baseProps.width - 1;
              j = 0;
              iIncrement = -1;
              jIncrement = 1;
              iStart = i;
              jStart = j;
              iEnd = 0;
              jEnd = this.baseProps.height - 1;
              break;
          }

          if (
            this.props.searchPattern === 'LRTB' ||
            this.props.searchPattern === 'RLTB' ||
            this.props.searchPattern === 'LRBT' ||
            this.props.searchPattern === 'RLBT'
          ) {
            do {
              i = iStart;
              do {
                if (
                  !this.grid.cells[i][j].masked &&
                  !this.grid.cells[i][j].visited &&
                  this.grid.cells[i][j].adjacentCells.some((a) => a !== undefined && a.visited)
                ) {
                  currentCell = this.grid.cells[i][j];
                }
                i += iIncrement;
              } while (currentCell === undefined && i * iIncrement <= iEnd * iIncrement);
              j += jIncrement;
            } while (currentCell === undefined && j * jIncrement <= jEnd * jIncrement);
          } else {
            do {
              j = jStart;
              do {
                if (
                  !this.grid.cells[i][j].masked &&
                  !this.grid.cells[i][j].visited &&
                  this.grid.cells[i][j].adjacentCells.some((a) => a !== undefined && a.visited)
                ) {
                  currentCell = this.grid.cells[i][j];
                  alert(currentCell.ToString());
                }
                j += jIncrement;
              } while (currentCell === undefined && j * jIncrement <= jEnd * jIncrement);
              i += iIncrement;
            } while (currentCell === undefined && i * iIncrement <= iEnd * iIncrement);
          }

          previousCell = undefined;

          this.MergeCells(
            currentCell as Cell,
            (currentCell as Cell).adjacentCells.filter((a) => a !== undefined && a.visited)[0]
          );
          (currentCell as Cell).visited = true;
        }
      }
    } while (mapCells.some((a) => !a.visited));
  }

  private pickNextCell(currentCell: Cell, previousCell: Cell | undefined): Cell {
    let nextCell: Cell;
    let randomMax: number = 0;

    const adjacentCells = currentCell.adjacentCells.filter((a) => a !== undefined);

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
        } else if (eastMax > northMax && (northMax === 0 || randomValue > northMax) && randomValue <= eastMax) {
          nextCell = currentCell.adjacentCells[1] as Cell;
        } else if (southMax > eastMax && (eastMax === 0 || randomValue > eastMax) && randomValue <= southMax) {
          nextCell = currentCell.adjacentCells[2] as Cell;
        } else {
          nextCell = currentCell.adjacentCells[3] as Cell;
        }
      } else {
        nextCell = adjacentCells[this.random.GetInt(adjacentCells.length)] as Cell;
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
        } else if (leftMax > forwardMax && (forwardMax === 0 || randomValue > forwardMax) && randomValue <= leftMax) {
          nextCell = currentCell.adjacentCells[leftIndex] as Cell;
        } else if (rightMax > leftMax && (leftMax === 0 || randomValue > leftMax) && randomValue <= rightMax) {
          nextCell = currentCell.adjacentCells[rightIndex] as Cell;
        } else {
          nextCell = currentCell.adjacentCells[backwardIndex] as Cell;
        }
      } else {
        nextCell = adjacentCells[this.random.GetInt(adjacentCells.length)] as Cell;
      }
    }

    return nextCell;
  }
}
