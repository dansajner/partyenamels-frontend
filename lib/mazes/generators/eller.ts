import { Cell } from '../maze-parts/cell';
import { Generator, GeneratorData } from './generator';
import { MathUtils } from '../utils/math';

export class EllerData {
  [key: string]: any;
  sidewaysDirection: number;
  verticalDirection: number;

  chanceMergeSideways: number;
  chanceMergeDown: number;

  constructor() {
    this.sidewaysDirection = 1;
    this.verticalDirection = 0;

    this.chanceMergeSideways = 33;
    this.chanceMergeDown = 33;
  }
}

export class Eller extends Generator {
  props: EllerData;

  constructor(baseProps: GeneratorData, props: EllerData) {
    super(baseProps);
    this.props = props;
  }

  Generate(): void {
    let mapCells: Cell[] = [];
    let currentRow: Cell[] = [];
    let currentRowSet: Cell[] = [];
    let row: number = 0;
    let finalRow: number = 0;
    let currentSet: number = 1;
    let currentRowSets: number[] = [];
    let rowIncrement: number = 0;

    for (let i: number = 0; i < this.baseProps.width; i++) {
      for (let j: number = 0; j < this.baseProps.height; j++) {
        if (!this.grid.cells[i][j].masked) {
          mapCells.push(this.grid.cells[i][j]);
        }
      }
    }

    switch (this.props.verticalDirection) {
      case 0:
        row = MathUtils.MinY(mapCells);
        finalRow = MathUtils.MaxY(mapCells);
        rowIncrement = 1;
        break;
      case 1:
        row = MathUtils.MinX(mapCells);
        finalRow = MathUtils.MaxX(mapCells);
        rowIncrement = 1;
        break;
      case 2:
        row = MathUtils.MaxY(mapCells);
        finalRow = MathUtils.MinY(mapCells);
        rowIncrement = -1;
        break;
      case 3:
        row = MathUtils.MaxX(mapCells);
        finalRow = MathUtils.MinX(mapCells);
        rowIncrement = -1;
        break;
    }

    do {
      currentRow = mapCells.filter((a) => a.y === row);
      currentRow.forEach((a) => {
        if (a.set === 0) {
          a.set = currentSet;
          currentSet++;
        }
      });

      for (let i: number = 0; i < currentRow.length; i++) {
        if (
          currentRow[i].adjacentCells[this.props.sidewaysDirection] !== undefined &&
          (currentRow[i].adjacentCells[this.props.sidewaysDirection] as Cell).set !== currentRow[i].set
        ) {
          if (this.random.GetInt(100) <= this.props.chanceMergeSideways) {
            this.MergeCells(currentRow[i], currentRow[i].adjacentCells[this.props.sidewaysDirection]);
            currentRowSet = mapCells.filter(
              (a) => a.set === (currentRow[i].adjacentCells[this.props.sidewaysDirection] as Cell).set
            );
            for (let j: number = 0; j < currentRowSet.length; j++) {
              currentRowSet[j].set = currentRow[i].set;
            }
          }
        }
      }

      currentRowSets = [];
      for (let i: number = 0; i < currentRow.length; i++) {
        if (currentRowSets.indexOf(currentRow[i].set) === -1) {
          currentRowSets.push(currentRow[i].set);
        }
      }

      for (let i: number = 0; i < currentRowSets.length; i++) {
        currentRowSet = currentRow.filter((a) => a.set === currentRowSets[i]);
        let rowMovedSouth: boolean = false;
        for (let j: number = 0; j < currentRowSet.length; j++) {
          if (
            currentRowSet[j].adjacentCells[this.props.verticalDirection] !== undefined &&
            (currentRowSet[j].adjacentCells[this.props.verticalDirection] as Cell).set !== currentRowSet[j].set
          ) {
            if (this.random.GetInt(100) <= this.props.chanceMergeDown) {
              rowMovedSouth = true;
              this.MergeCells(currentRowSet[j], currentRowSet[j].adjacentCells[this.props.verticalDirection]);
              (currentRowSet[j].adjacentCells[this.props.verticalDirection] as Cell).set = currentRowSet[j].set;
            }
          }
        }
        if (!rowMovedSouth) {
          for (let j: number = 0; j < currentRowSet.length; j++) {
            if (
              !rowMovedSouth &&
              currentRowSet[j].adjacentCells[this.props.verticalDirection] !== undefined &&
              (currentRowSet[j].adjacentCells[this.props.verticalDirection] as Cell).set !== currentRowSet[j].set
            ) {
              rowMovedSouth = true;
              this.MergeCells(currentRowSet[j], currentRowSet[j].adjacentCells[this.props.verticalDirection]);
              (currentRowSet[j].adjacentCells[this.props.verticalDirection] as Cell).set = currentRowSet[j].set;
            }
          }
        }
      }

      row += rowIncrement;
    } while (row * rowIncrement <= finalRow * rowIncrement);

    for (let i: number = 0; i < currentRow.length; i++) {
      if (
        currentRow[i].adjacentCells[this.props.sidewaysDirection] !== undefined &&
        (currentRow[i].adjacentCells[this.props.sidewaysDirection] as Cell).set !== currentRow[i].set
      ) {
        this.MergeCells(currentRow[i], currentRow[i].adjacentCells[this.props.sidewaysDirection]);
        currentRowSet = mapCells.filter(
          (a) => a.set === (currentRow[i].adjacentCells[this.props.sidewaysDirection] as Cell).set
        );
        for (let j: number = 0; j < currentRowSet.length; j++) {
          currentRowSet[j].set = currentRow[i].set;
        }
      }
    }
  }
}
