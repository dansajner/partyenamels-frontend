import { Cell } from '../';
import { Generator, GeneratorData } from './generator';
import { Wall } from '../';

export class PrimData {
  direction: number; //1 = NE, 2 = SE, 3 = SW, 4 = NW
  chanceVertical: number; //1 - 99

  constructor() {
    this.direction = 1;
    this.chanceVertical = 50;
  }
}

export class Prim extends Generator {
  props: PrimData;

  constructor(baseProps: GeneratorData, props: PrimData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let usedCells: Cell[] = [];
    let currentCell: Cell | undefined;
    let nextCell: Cell | undefined;
    let direction: number = 0;

    for (let i: number = 0; i < this.baseProps.width; i++) {
      for (let j: number = 0; j < this.baseProps.height; j++) {
        if (!this.grid.cells[i][j].masked) {
          for (let k: number = 0; k < this.grid.numCellSides; k++) {
            if (
              this.grid.cells[i][j].adjacentCells[k] !== undefined &&
              this.grid.cells[i][j].walls[k].weight === 0
            ) {
              let weight = this.random.GetIntInRange(1, 100);
              this.grid.cells[i][j].walls[k].weight = weight;
              (this.grid.cells[i][j].adjacentCells[k] as Cell).walls[
                (k + this.grid.numCellSides / 2) % this.grid.numCellSides
              ].weight = weight;
            }
          }
          mapCells.push(this.grid.cells[i][j]);
        }
      }
    }

    currentCell = mapCells[this.random.GetInt(mapCells.length)];
    usedCells.push(currentCell);
    do {
      currentCell = usedCells[0];
      for (let i: number = 0; i < usedCells.length; i++) {
        if (
          usedCells[i].x !== currentCell.x ||
          usedCells[i].y !== currentCell.y
        ) {
          if (
            usedCells[i].walls
              .filter((a) => a.weight > 0)
              .sort((a, b) => this.compareWeights(a, b))[0].weight <
            currentCell.walls
              .filter((a) => a.weight > 0)
              .sort((a, b) => this.compareWeights(a, b))[0].weight
          ) {
            currentCell = usedCells[i];
          }
        }
      }

      direction = currentCell.GetWeightDirection(
        currentCell.walls
          .filter((a) => a.weight > 0)
          .sort((a, b) => this.compareWeights(a, b))[0].weight
      );

      nextCell = currentCell.adjacentCells[direction];
      if (usedCells.indexOf(nextCell as Cell) === -1) {
        this.MergeCells(currentCell, nextCell);
        usedCells.push(nextCell as Cell);
      }

      currentCell.walls[direction].weight = 9999;
      (nextCell as Cell).walls[
        (direction + this.grid.numCellSides / 2) % this.grid.numCellSides
      ].weight = 9999;
    } while (usedCells.length < mapCells.length);
  }

  private compareWeights(a: Wall, b: Wall) {
    return a.weight === b.weight ? 0 : a.weight < b.weight ? -1 : 1;
  }
}
