import { Cell } from './cell';

import { Image } from '../../image-utils/image';
import { DisplayData } from '../generators/generator';

export class Grid {
  width: number;
  height: number;
  numCellSides: number;
  cells: Cell[][];

  constructor(width: number, height: number, numCellSides: number) {
    this.width = width;
    this.height = height;
    this.numCellSides = numCellSides;
    this.cells = [];

    for (let i: number = 0; i < width; i++) {
      this.cells[i] = [];
      for (let j: number = 0; j < height; j++) {
        this.cells[i][j] = new Cell(i, j, numCellSides);
      }
    }
  }

  InitializeGrid(maskImage: Image | undefined): void {
    if (maskImage !== undefined) {
      let rotatedImage: Image = new Image(maskImage.width, maskImage.height);
      for (let i = 0; i < maskImage.data.length; i++) {
        rotatedImage.data[i] = maskImage.data[i];
      }
      rotatedImage.FlipOverX();
      rotatedImage.Transpose();
      let widthFactor: number = rotatedImage.width / this.width;
      let heightFactor: number = rotatedImage.height / this.height;

      for (let i: number = 0; i < this.width; i++) {
        for (let j: number = 0; j < this.height; j++) {
          if (
            rotatedImage.GetPixel(parseInt((i * widthFactor).toFixed(0)), parseInt((j * heightFactor).toFixed(0))).r ===
            0
          ) {
            this.cells[i][j].visited = true;
            this.cells[i][j].masked = true;
          }
        }
      }
    }

    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        if (!this.cells[i][j].masked) {
          if (this.numCellSides === 4) {
            //North
            if (j < this.height - 1) {
              this.cells[i][j].adjacentCells.push(!this.cells[i][j + 1].masked ? this.cells[i][j + 1] : undefined);
            } else {
              this.cells[i][j].adjacentCells.push(undefined);
            }
            //East
            if (i < this.width - 1) {
              this.cells[i][j].adjacentCells.push(!this.cells[i + 1][j].masked ? this.cells[i + 1][j] : undefined);
            } else {
              this.cells[i][j].adjacentCells.push(undefined);
            }
            //South
            if (j > 0) {
              this.cells[i][j].adjacentCells.push(!this.cells[i][j - 1].masked ? this.cells[i][j - 1] : undefined);
            } else {
              this.cells[i][j].adjacentCells.push(undefined);
            }
            //West
            if (i > 0) {
              this.cells[i][j].adjacentCells.push(!this.cells[i - 1][j].masked ? this.cells[i - 1][j] : undefined);
            } else {
              this.cells[i][j].adjacentCells.push(undefined);
            }
          }

          for (let w: number = 0; w < this.numCellSides; w++) {
            this.cells[i][j].SetWall(w, true);
          }
        }
      }
    }
  }

  Display(displayProps: DisplayData): Image {
    const size: number = Math.max(this.width, this.height);

    let imgData = new Image(size * displayProps.cellDimension, size * displayProps.cellDimension);
    for (let i: number = 0; i < size * displayProps.cellDimension; i++) {
      for (let j: number = 0; j < size * displayProps.cellDimension; j++) {
        imgData.SetPixel(i, j, displayProps.clearColor(i, j));
      }
    }

    let iOffset: number = 0,
      jOffset: number = 0;
    if (this.width < this.height) {
      iOffset = Math.floor((this.height - this.width) / 2);
    } else if (this.width > this.height) {
      jOffset = Math.floor((this.width - this.height) / 2);
    }

    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        let cellImgData = this.cells[i][j].Display(
          displayProps,
          (i + iOffset) * displayProps.cellDimension,
          (j + jOffset) * displayProps.cellDimension
        );
        imgData.SetPixels(
          (i + iOffset) * displayProps.cellDimension,
          (j + jOffset) * displayProps.cellDimension,
          cellImgData
        );
      }
    }

    imgData.Transpose();
    imgData.FlipOverX();

    return imgData;
  }
}
