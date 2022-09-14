import { Cell } from '../maze-parts/cell';
import { Grid } from '../maze-parts/grid';
import { Image } from '../../image-utils/image';
import { Random } from '../utils/random';
import { Black, RGBA, White } from '../../image-utils/rgba';

export class GeneratorData {
  [key: string]: any;
  height: number;
  width: number;
  numCellSides: number;
  seed: number;
  grid!: Grid;
  weave: number;
  cullDeadEnds: number;
  generator: number;
  maskImageSelection: string;
  maskImage!: Image | undefined;

  constructor() {
    this.generator = 1;
    this.width = 10;
    this.height = 10;
    this.numCellSides = 4;
    this.seed = 1337;
    this.weave = 0;
    this.cullDeadEnds = 0;
    this.useMask = false;
    this.maskImageSelection = 'none';
  }
}

export class DisplayData {
  [key: string]: any;

  cellDimension: 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64;
  wallColor: (cell: Cell) => RGBA;
  wallColorName: string;
  floorColor: (cell: Cell) => RGBA;
  floorColorName: string;
  clearColor: (x: number, y: number) => RGBA;
  clearColorName: string;
  constructor() {
    this.cellDimension = 16;
    this.wallColor = (cell: Cell) => {
      return Black;
    };
    this.floorColor = (cell: Cell) => {
      return White;
    };
    this.clearColor = (x: number, y: number) => {
      return White;
    };
    this.wallColorName = 'black';
    this.floorColorName = 'white';
    this.clearColorName = 'white';
  }
}

export class Generator {
  baseProps: GeneratorData;
  grid!: Grid;
  random!: Random;

  constructor(baseProps: GeneratorData) {
    this.baseProps = baseProps;
    if (baseProps.cullDeadEnds > this.baseProps.width * this.baseProps.height - 1) {
      baseProps.cullDeadEnds = this.baseProps.width * this.baseProps.height - 1;
    }
  }

  RunGenerator(): void {
    this.random = new Random(this.baseProps.seed);
    this.grid = new Grid(this.baseProps.width, this.baseProps.height, this.baseProps.numCellSides);
    this.grid.InitializeGrid(this.baseProps.maskImage);

    this.Generate();
    this.Weave();
    this.RemoveDeadEnds();
  }

  protected Generate(): void {}

  protected Weave(): void {
    if (this.baseProps.weave > 0) {
      let mapCells: Cell[] = [];
      for (let i: number = 0; i < this.baseProps.width; i++) {
        for (let j: number = 0; j < this.baseProps.height; j++) {
          if (!this.grid.cells[i][j].masked && this.grid.cells[i][j].CanTunnel()) {
            mapCells.push(this.grid.cells[i][j]);
          }
        }
      }

      if (mapCells.length > 0) {
        for (let i: number = 0; i < mapCells.length; i++) {
          if (mapCells[i].CanTunnel()) {
            if (this.baseProps.weave >= this.random.GetInt(100)) {
              this.chooseTunnelDirection(mapCells[i]);
            }
          }
        }
      }
    }
  }

  private chooseTunnelDirection(currentCell: Cell): void {
    let directions: number[] = [];
    for (let i: number = 0; i < currentCell.numCellSides; i++) {
      if (currentCell.CanTunnelDirection(i)) {
        directions.push(i);
      }
    }

    this.tunnelCells(currentCell, directions[this.random.GetInt(directions.length)]);
  }

  private tunnelCells(currentCell: Cell, direction: number): void {
    let nearCell: Cell = currentCell.adjacentCells[direction] as Cell;
    let farCell: Cell = nearCell.adjacentCells[direction] as Cell;

    nearCell.underCell = new Cell(nearCell.x, nearCell.y, nearCell.numCellSides);
    nearCell.underCell.overCell = nearCell;

    currentCell.SetWallAndStairs(direction, false, true, false);

    nearCell.underCell.SetWallAndStairs(direction, false, false, true);
    nearCell.underCell.SetWallAndStairs((direction + 2) % 4, false, false, true);
    nearCell.underCell.SetWallAndStairs((direction + 1) % 4, true, false, false);
    nearCell.underCell.SetWallAndStairs((direction + 3) % 4, true, false, false);

    farCell.SetWallAndStairs((direction + 2) % 4, false, true, false);

    nearCell.SetWallAndStairs((direction + 1) % 4, false, true, false);
    nearCell.SetWallAndStairs((direction + 3) % 4, false, true, false);

    nearCell.adjacentCells[(direction + 3) % 4]?.SetWallAndStairs((direction + 1) % 4, false, false, true);
    nearCell.adjacentCells[(direction + 1) % 4]?.SetWallAndStairs((direction + 3) % 4, false, false, true);
  }

  protected RemoveDeadEnds(): void {
    if (this.baseProps.cullDeadEnds > 0) {
      let mapCells: Cell[] = [];
      for (let i: number = 0; i < this.baseProps.width; i++) {
        for (let j: number = 0; j < this.baseProps.height; j++) {
          if (!this.grid.cells[i][j].masked) {
            mapCells.push(this.grid.cells[i][j]);
          }
        }
      }

      let numProcessed: number = 0;
      let currentCell: Cell;
      let nextCell: Cell;
      let direction: number = 0;
      do {
        currentCell = mapCells.filter((a) => a.walls.filter((b) => b.isWall).length === 3)[
          this.random.GetInt(mapCells.filter((a) => a.walls.filter((b) => b.isWall).length === 3).length)
        ];

        direction = currentCell.walls.filter((a) => !a.isWall)[0].direction;
        nextCell = currentCell.walls[direction].isStairsDown
          ? ((currentCell.adjacentCells[direction] as Cell).underCell as Cell)
          : (currentCell.adjacentCells[direction] as Cell);

        currentCell.SetWallAndStairs(direction, true, false, false);
        nextCell.SetWallAndStairs((direction + 2) % 4, true, false, false);

        numProcessed++;
      } while (
        numProcessed < this.baseProps.cullDeadEnds &&
        mapCells.filter((a) => a.walls.filter((b) => b.isWall).length === 3).length > 0
      );

      if (mapCells.filter((a) => a.underCell !== undefined).length > 0) {
        mapCells
          .filter((a) => a.underCell !== undefined)
          .forEach((a) => {
            if (
              a.walls.filter((b) => b.isWall).length !== 2 ||
              (a.underCell as Cell).walls.filter((b) => b.isWall).length !== 2
            ) {
              for (let k: number = 0; k < a.numCellSides; k++) {
                (a.underCell as Cell).SetWallAndStairs(k, true, false, false);
                (a.adjacentCells[k] as Cell).SetWallAndStairs((k + 2) % 4, true, false, false);
              }
              a.underCell = undefined;
            }
          });
      }
    }
  }

  protected MergeCells(currentCell: Cell, nextCell: Cell | undefined): void {
    if (this.baseProps.numCellSides === 4) {
      if (
        currentCell.adjacentCells[0] !== undefined &&
        currentCell.adjacentCells[0]?.x === nextCell?.x &&
        currentCell.adjacentCells[0]?.y === nextCell?.y
      ) {
        currentCell.SetWall(0, false);
        nextCell.SetWall(2, false);
      } else if (
        currentCell.adjacentCells[1] !== undefined &&
        currentCell.adjacentCells[1]?.x === nextCell?.x &&
        currentCell.adjacentCells[1]?.y === nextCell?.y
      ) {
        currentCell.SetWall(1, false);
        nextCell.SetWall(3, false);
      } else if (
        currentCell.adjacentCells[2] !== undefined &&
        currentCell.adjacentCells[2]?.x === nextCell?.x &&
        currentCell.adjacentCells[2]?.y === nextCell?.y
      ) {
        currentCell.SetWall(2, false);
        nextCell.SetWall(0, false);
      } else if (
        currentCell.adjacentCells[3] !== undefined &&
        currentCell.adjacentCells[3]?.x === nextCell?.x &&
        currentCell.adjacentCells[3]?.y === nextCell?.y
      ) {
        currentCell.SetWall(3, false);
        nextCell.SetWall(1, false);
      }
    }
  }

  Display(displayProps: DisplayData): Image {
    return this.grid.Display(displayProps);
  }
}
