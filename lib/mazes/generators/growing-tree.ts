import { Cell } from '../maze-parts/cell';
import { Generator, GeneratorData } from './generator';

export class GrowingTreeData {
  [key: string]: any;
  setStartPosition: boolean;
  startPosX: number;
  startPosY: number;
  treeGrammar: string;

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

  constructor() {
    this.setStartPosition = false;
    this.startPosX = 0;
    this.startPosY = 0;
    this.treeGrammar = 'R';

    this.directionBias = 'Cardinal';
    this.northChance = 25;
    this.eastChance = 25;
    this.southChance = 25;
    this.westChance = 25;

    this.forwardChance = 34;
    this.leftChance = 33;
    this.rightChance = 33;
  }
}

export class GrowingTree extends Generator {
  props: GrowingTreeData;

  constructor(baseProps: GeneratorData, props: GrowingTreeData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let usedCells: Cell[] = [];
    let currentCell: Cell;
    let nextCell: Cell | undefined;
    let pickCount: number;
    let grammarPosition: number = 0;
    let firstCell: Cell;

    for (let i: number = 0; i < this.baseProps.width; i++) {
      for (let j: number = 0; j < this.baseProps.height; j++) {
        if (!this.grid.cells[i][j].masked) {
          mapCells.push(this.grid.cells[i][j]);
        }
      }
    }

    if (
      this.props.setStartPosition &&
      mapCells.some(
        (a) =>
          a.x.toString() === this.props.startPosX.toString() &&
          a.y.toString() === this.props.startPosY.toString()
      )
    ) {
      currentCell = mapCells.filter(
        (a) =>
          a.x.toString() === this.props.startPosX.toString() &&
          a.y.toString() === this.props.startPosY.toString()
      )[0];
    } else {
      currentCell = mapCells[this.random.GetInt(mapCells.length)];
    }
    firstCell = currentCell;
    currentCell.visited = true;
    usedCells.push(currentCell);
    do {
      do {
        pickCount = usedCells.filter((a) =>
          a.adjacentCells.some((b) => b !== undefined && !b.visited)
        ).length;

        //First
        if (this.props.treeGrammar[grammarPosition] === 'F') {
          currentCell = usedCells.filter((a) =>
            a.adjacentCells.some((b) => b !== undefined && !b.visited)
          )[0];
        }
        //Last
        else if (this.props.treeGrammar[grammarPosition] === 'L') {
          currentCell = usedCells.filter((a) =>
            a.adjacentCells.some((b) => b !== undefined && !b.visited)
          )[pickCount - 1];
        } //Fallthrough for case R (Random)
        else {
          currentCell = usedCells.filter((a) =>
            a.adjacentCells.some((b) => b !== undefined && !b.visited)
          )[this.random.GetInt(pickCount)];
        }
      } while (
        !currentCell.adjacentCells.some((a) => a !== undefined && !a.visited)
      );

      let cellIndex: number = -1;
      let cellDist: number = 9999;
      for (let i: number = 0; i < currentCell.numCellSides; i++) {
        if (
          currentCell.adjacentCells[i] !== undefined &&
          (currentCell.adjacentCells[i] as Cell).visited
        ) {
          if (cellIndex === -1) {
            cellIndex = i;
            cellDist =
              Math.pow(
                (currentCell.adjacentCells[i] as Cell).x - firstCell.x,
                2
              ) +
              Math.pow(
                (currentCell.adjacentCells[i] as Cell).y - firstCell.y,
                2
              );
          } else {
            let newCellDist: number =
              Math.pow(
                (currentCell.adjacentCells[i] as Cell).x - firstCell.x,
                2
              ) +
              Math.pow(
                (currentCell.adjacentCells[i] as Cell).y - firstCell.y,
                2
              );
            if (newCellDist < cellDist) {
              cellDist = newCellDist;
              cellIndex = i;
            }
          }
        }
      }
      nextCell = this.pickNextCell(
        currentCell,
        currentCell.adjacentCells[cellIndex]
      );

      grammarPosition = (grammarPosition + 1) % this.props.treeGrammar.length;

      (nextCell as Cell).visited = true;
      this.MergeCells(currentCell, nextCell);
      usedCells.push(nextCell as Cell);
    } while (mapCells.some((a) => !a.visited));
  }

  private pickNextCell(
    currentCell: Cell,
    previousCell: Cell | undefined
  ): Cell {
    let nextCell: Cell;
    let randomMax: number = 0;
    const adjacentCells = currentCell.adjacentCells.filter(
      (a) => a !== undefined && !a.visited
    );

    if (this.props.directionBias === 'Cardinal') {
      if (adjacentCells.length === 1) {
        nextCell = adjacentCells[0] as Cell;
      } else if (previousCell !== undefined) {
        let northMax = 0;
        let eastMax = 0;
        let southMax = 0;
        let westMax = 0;

        if (
          currentCell.adjacentCells[0] !== undefined &&
          !(currentCell.adjacentCells[0] as Cell).visited
        ) {
          northMax = this.props.northChance - 1;
          randomMax += this.props.northChance;
        }
        if (
          currentCell.adjacentCells[1] !== undefined &&
          !(currentCell.adjacentCells[1] as Cell).visited
        ) {
          eastMax = randomMax + this.props.eastChance - 1;
          randomMax += this.props.eastChance;
        }
        if (
          currentCell.adjacentCells[2] !== undefined &&
          !(currentCell.adjacentCells[2] as Cell).visited
        ) {
          southMax = randomMax + this.props.southChance - 1;
          randomMax += this.props.southChance;
        }
        if (
          currentCell.adjacentCells[3] !== undefined &&
          !(currentCell.adjacentCells[3] as Cell).visited
        ) {
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
      if (adjacentCells.length === 1) {
        nextCell = adjacentCells[0] as Cell;
      } else if (previousCell !== undefined) {
        let previousCellIndex = currentCell.adjacentCells.indexOf(previousCell);
        let forwardIndex = (previousCellIndex + 2) % 4;
        let forwardMax = 0;
        let leftIndex = (previousCellIndex + 1) % 4;
        let leftMax = 0;
        let rightIndex = (previousCellIndex + 3) % 4;
        let rightMax = 0;

        if (
          currentCell.adjacentCells[forwardIndex] !== undefined &&
          !(currentCell.adjacentCells[forwardIndex] as Cell).visited
        ) {
          forwardMax = this.props.forwardChance - 1;
          randomMax += this.props.forwardChance;
        }
        if (
          currentCell.adjacentCells[leftIndex] !== undefined &&
          !(currentCell.adjacentCells[leftIndex] as Cell).visited
        ) {
          leftMax = randomMax + this.props.leftChance - 1;
          randomMax += this.props.leftChance;
        }
        if (
          currentCell.adjacentCells[rightIndex] !== undefined &&
          !(currentCell.adjacentCells[rightIndex] as Cell).visited
        ) {
          rightMax = randomMax + this.props.rightChance - 1;

          randomMax += this.props.rightChance;
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
        } /*if (
          (leftMax === 0 || randomValue > leftMax) &&
          randomValue <= rightMax
        ) */ else {
          nextCell = currentCell.adjacentCells[rightIndex] as Cell;
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
