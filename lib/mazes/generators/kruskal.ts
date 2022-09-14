import { Cell } from '../';
import { Generator, GeneratorData } from './generator';

export class KruskalData {
  direction: number; //1 = NE, 2 = SE, 3 = SW, 4 = NW
  chanceVertical: number; //1 - 99

  constructor() {
    this.direction = 1;
    this.chanceVertical = 50;
  }
}

export class Kruskal extends Generator {
  props: KruskalData;

  constructor(baseProps: GeneratorData, props: KruskalData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let currentCell: Cell | undefined;
    let nextCell: Cell | undefined;
    let currentWeight: number = 1;
    let nextSetNumber: number = 1;
    let direction: number;

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

    do {
      while (
        mapCells.some((a) => a.walls.some((b) => b.weight === currentWeight))
      ) {
        currentCell = mapCells.filter((a) =>
          a.walls.some((b) => b.weight === currentWeight)
        )[0];

        nextCell = currentCell.adjacentCells.filter(
          (a) =>
            a !== undefined &&
            a.walls.some(
              (b) =>
                b.weight === currentWeight &&
                b.direction ===
                  ((currentCell as Cell).GetWeightDirection(currentWeight) +
                    this.grid.numCellSides / 2) %
                    this.grid.numCellSides
            )
        )[0];

        if (currentCell.set === 0 || (nextCell as Cell).set === 0) {
          if (currentCell.set === 0 && (nextCell as Cell).set === 0) {
            currentCell.set = nextSetNumber;
            (nextCell as Cell).set = nextSetNumber;
            nextSetNumber++;
          } else if (currentCell.set === 0 && (nextCell as Cell).set > 0) {
            currentCell.set = (nextCell as Cell).set;
          } else if (currentCell.set > 0 && (nextCell as Cell).set === 0) {
            (nextCell as Cell).set = currentCell.set;
          }

          this.MergeCells(currentCell, nextCell);
          direction = currentCell.GetCellDirection(nextCell as Cell);

          currentCell.walls[direction].weight = 9999;
          (nextCell as Cell).walls[
            (direction + this.grid.numCellSides / 2) % this.grid.numCellSides
          ].weight = 9999;
        } else {
          if (currentCell.set === (nextCell as Cell).set) {
            direction = currentCell.GetCellDirection(nextCell as Cell);

            currentCell.walls[direction].weight = 9999;
            (nextCell as Cell).walls[
              (direction + this.grid.numCellSides / 2) % this.grid.numCellSides
            ].weight = 9999;
          } else {
            this.MergeCells(currentCell, nextCell);

            direction = currentCell.GetCellDirection(nextCell as Cell);

            currentCell.walls[direction].weight = 9999;
            (nextCell as Cell).walls[
              (direction + this.grid.numCellSides / 2) % this.grid.numCellSides
            ].weight = 9999;

            let filterSet: number, mapSet: number;
            if (currentCell.set < (nextCell as Cell).set) {
              filterSet = (nextCell as Cell).set;
              mapSet = (currentCell as Cell).set;
              mapCells
                .filter((a) => a.set === filterSet)
                .forEach((a) => (a.set = mapSet));
            } else {
              filterSet = (currentCell as Cell).set;
              mapSet = (nextCell as Cell).set;
              mapCells
                .filter((a) => a.set === filterSet)
                .forEach((a) => (a.set = mapSet));
            }
          }
        }
      }
      currentWeight++;
    } while (mapCells.filter((a) => a.set === 1).length < mapCells.length);
  }
}
