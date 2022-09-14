import { Image } from '../../image-utils/image';
import { RGBA } from '../../image-utils/rgba';
import { DisplayData } from '../generators/generator';
import { Wall } from './wall';

export class Cell {
  x: number;
  y: number;

  visited!: boolean;
  adjacentCells!: (Cell | undefined)[];
  walls!: Wall[];
  numCellSides: number;

  set!: number;
  masked!: boolean;

  overCell!: Cell | undefined;
  underCell!: Cell | undefined;

  constructor(x: number, y: number, numCellSides: number = 4) {
    this.x = x;
    this.y = y;

    this.visited = false;
    this.set = 0;
    this.masked = false;

    this.adjacentCells = [];
    this.walls = [];
    this.numCellSides = numCellSides;

    for (let i: number = 0; i < numCellSides; i++) {
      let wall = new Wall();
      wall.direction = i;
      wall.isWall = false;
      wall.isStairsUp = false;
      wall.isStairsDown = false;
      this.walls.push(wall);
    }
  }

  SetWall(direction: number, isWall: boolean): void {
    this.walls[direction].isWall = isWall;
  }

  SetWallAndStairs(direction: number, isWall: boolean, isStairsUp: boolean, isStairsDown: boolean): void {
    this.walls[direction].isWall = isWall;
    this.walls[direction].isStairsUp = isStairsUp;
    this.walls[direction].isStairsDown = isStairsDown;
  }

  CanTunnel(): boolean {
    let i: number = 0;
    let canTunnel: boolean = false;
    do {
      canTunnel = this.CanTunnelDirection(i);
      i++;
    } while (!canTunnel && i < this.adjacentCells.length);
    return canTunnel;
  }

  CanTunnelDirection(direction: number): boolean {
    let canTunnel: boolean = false;

    canTunnel =
      this.adjacentCells[direction] !== undefined &&
      this.adjacentCells[direction]?.underCell === undefined &&
      this.adjacentCells[direction]?.adjacentCells[direction] !== undefined &&
      this.checkPassage(direction) &&
      (this.adjacentCells[direction] as Cell).adjacentCells[(direction + 1) % 4]?.underCell === undefined &&
      (this.adjacentCells[direction] as Cell).adjacentCells[(direction + 3) % 4]?.underCell === undefined;
    return canTunnel;
  }

  private checkPassage(direction: number): boolean {
    let retVal: boolean = false;

    if (direction === 0 || direction === 2) {
      retVal =
        (this.adjacentCells[direction] as Cell).walls[0].isWall &&
        !(this.adjacentCells[direction] as Cell).walls[1].isWall &&
        (this.adjacentCells[direction] as Cell).walls[2].isWall &&
        !(this.adjacentCells[direction] as Cell).walls[3].isWall;
    } else {
      retVal =
        !(this.adjacentCells[direction] as Cell).walls[0].isWall &&
        (this.adjacentCells[direction] as Cell).walls[1].isWall &&
        !(this.adjacentCells[direction] as Cell).walls[2].isWall &&
        (this.adjacentCells[direction] as Cell).walls[3].isWall;
    }

    return retVal;
  }

  ColumnExists(direction: number): boolean | undefined {
    let retVal: boolean | undefined = true;
    if (this.numCellSides === 4) {
      retVal =
        this.adjacentCells[direction] !== undefined &&
        this.walls[direction] !== undefined &&
        this.walls[direction].IsFlat() &&
        this.adjacentCells[direction]?.adjacentCells[(direction + 1) % 4] !== undefined &&
        this.adjacentCells[direction]?.walls[(direction + 1) % 4].IsFlat() &&
        this.adjacentCells[direction]?.adjacentCells[(direction + 1) % 4]?.adjacentCells[(direction + 2) % 4] !==
          undefined &&
        this.adjacentCells[direction]?.adjacentCells[(direction + 1) % 4]?.walls[(direction + 2) % 4].IsFlat() &&
        this.adjacentCells[direction]?.adjacentCells[(direction + 1) % 4]?.adjacentCells[(direction + 2) % 4]
          ?.adjacentCells[(direction + 3) % 4] !== undefined &&
        this.adjacentCells[direction]?.adjacentCells[(direction + 1) % 4]?.adjacentCells[(direction + 2) % 4]?.walls[
          (direction + 3) % 4
        ].IsFlat();
    }
    return retVal;
  }

  Display(displayProps: DisplayData, iOffset: number, jOffset: number): Image {
    const dimension = displayProps.cellDimension;
    const floorColor = displayProps.floorColor(this);
    const wallColor = displayProps.wallColor(this);

    let imgData = new Image(dimension, dimension);
    let paintColor: RGBA = floorColor;

    for (let i: number = 0; i < dimension; i++) {
      for (let j: number = 0; j < dimension; j++) {
        imgData.SetPixel(i, j, displayProps.clearColor(i + iOffset, j + jOffset));
      }
    }

    if (this.walls.filter((a) => a.isWall).length === 4 || this.masked) {
      /*paintColor = wallColor;
      for (let i: number = 0; i < dimension; i++) {
        for (let j: number = 0; j < dimension; j++) imgData.SetPixel(i, j, paintColor);
      }*/
    } else {
      paintColor = floorColor;
      for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) imgData.SetPixel(i, j, paintColor);
      }

      //Columns

      //NE
      paintColor = this.ColumnExists(0) ? floorColor : wallColor;
      for (let i: number = dimension - dimension / 4; i < dimension; i++) {
        for (let j: number = dimension - dimension / 4; j < dimension; j++) {
          imgData.SetPixel(i, j, paintColor);
        }
      }

      //SE
      paintColor = this.ColumnExists(1) ? floorColor : wallColor;
      for (let i: number = dimension - dimension / 4; i < dimension; i++) {
        for (let j: number = 0; j < dimension / 4; j++) {
          imgData.SetPixel(i, j, paintColor);
        }
      }

      //SW
      paintColor = this.ColumnExists(2) ? floorColor : wallColor;
      for (let i: number = 0; i < dimension / 4; i++) {
        for (let j: number = 0; j < dimension / 4; j++) {
          imgData.SetPixel(i, j, paintColor);
        }
      }

      //NW
      paintColor = this.ColumnExists(3) ? floorColor : wallColor;
      for (let i: number = 0; i < dimension / 4; i++) {
        for (let j: number = dimension - dimension / 4; j < dimension; j++) {
          imgData.SetPixel(i, j, paintColor);
        }
      }

      //Walls

      //North
      if (this.walls[0].isWall) {
        paintColor = this.walls[0].isWall ? wallColor : floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = dimension - dimension / 4; j < dimension - dimension / 8; j++)
            imgData.SetPixel(i, j, paintColor);
        }
        paintColor = this.underCell === undefined || this.underCell.walls[0].isWall ? wallColor : floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = dimension - dimension / 8; j < dimension; j++) imgData.SetPixel(i, j, paintColor);
        }
      } else {
        paintColor = floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = dimension - dimension / 4; j < dimension; j++) imgData.SetPixel(i, j, paintColor);
        }
      }

      //East
      if (this.walls[1].isWall) {
        paintColor = this.walls[1].isWall ? wallColor : floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = dimension - dimension / 4; i < dimension - dimension / 8; i++)
            imgData.SetPixel(i, j, paintColor);
        }
        paintColor = this.underCell === undefined || this.underCell.walls[1].isWall ? wallColor : floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = dimension - dimension / 8; i < dimension; i++) imgData.SetPixel(i, j, paintColor);
        }
      } else {
        paintColor = floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = dimension - dimension / 4; i < dimension; i++) imgData.SetPixel(i, j, paintColor);
        }
      }

      //South
      if (this.walls[2].isWall) {
        paintColor = this.walls[2].isWall ? wallColor : floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = dimension / 8; j < dimension / 4; j++) imgData.SetPixel(i, j, paintColor);
        }
        paintColor = this.underCell === undefined || this.underCell.walls[2].isWall ? wallColor : floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = 0; j < dimension / 8; j++) imgData.SetPixel(i, j, paintColor);
        }
      } else {
        paintColor = floorColor;
        for (let i: number = dimension / 4; i < dimension - dimension / 4; i++) {
          for (let j: number = 0; j < dimension / 4; j++) imgData.SetPixel(i, j, paintColor);
        }
      }

      //West
      if (this.walls[3].isWall) {
        paintColor = this.walls[3].isWall ? wallColor : floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = dimension / 8; i < dimension / 4; i++) imgData.SetPixel(i, j, paintColor);
        }
        paintColor = this.underCell === undefined || this.underCell.walls[3].isWall ? wallColor : floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = 0; i < dimension / 8; i++) imgData.SetPixel(i, j, paintColor);
        }
      } else {
        paintColor = floorColor;
        for (let j: number = dimension / 4; j < dimension - dimension / 4; j++) {
          for (let i: number = 0; i < dimension / 4; i++) imgData.SetPixel(i, j, paintColor);
        }
      }
    }

    return imgData;
  }

  GetWeightDirection(weight: number) {
    let retVal: number = -1;
    let i: number = 0;
    do {
      if (this.walls[i].weight === weight) {
        retVal = i;
      }
      i++;
    } while (retVal === -1 || i < this.numCellSides);
    return retVal;
  }

  GetCellDirection(nextCell: Cell): number {
    let retVal: number = -1;
    let i: number = 0;
    do {
      if (
        this.adjacentCells[i] !== undefined &&
        (this.adjacentCells[i] as Cell).x === nextCell.x &&
        (this.adjacentCells[i] as Cell).y === nextCell.y
      ) {
        retVal = i;
      }
      i++;
    } while (retVal === -1 || i < this.numCellSides);
    return retVal;
  }

  ToString(): string {
    return '(' + this.x.toString() + ',' + this.y.toString() + ')';
  }
}
