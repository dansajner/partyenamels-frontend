import { RGBA } from './rgba';
import ImageData from '@canvas/image-data';

export class Image extends ImageData {
  GetPixel(x: number, y: number): RGBA {
    return new RGBA(
      this.data[this.width * x * 4 + y * 4],
      this.data[this.width * x * 4 + y * 4 + 1],
      this.data[this.width * x * 4 + y * 4 + 2],
      this.data[this.width * x * 4 + y * 4 + 3]
    );
  }

  SetPixel(x: number, y: number, c: RGBA) {
    this.data[this.width * x * 4 + y * 4] = c.r;
    this.data[this.width * x * 4 + y * 4 + 1] = c.g;
    this.data[this.width * x * 4 + y * 4 + 2] = c.b;
    this.data[this.width * x * 4 + y * 4 + 3] = c.a;
  }

  SetPixels(x: number, y: number, imgData: Image) {
    for (let i: number = 0; i < imgData.width; i++) {
      for (let j: number = 0; j < imgData.height; j++) {
        this.SetPixel(i + x, j + y, imgData.GetPixel(i, j));
      }
    }
  }

  FlipOverY() {
    let newData: Image = new Image(this.width, this.height);
    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        newData.SetPixel(i, this.height - 1 - j, this.GetPixel(i, j));
      }
    }
    for (let i: number = 0; i < this.data.length; i++) {
      this.data[i] = newData.data[i];
    }
  }

  FlipOverX() {
    let newData: Image = new Image(this.width, this.height);
    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        newData.SetPixel(this.width - 1 - i, j, this.GetPixel(i, j));
      }
    }
    for (let i: number = 0; i < this.data.length; i++) {
      this.data[i] = newData.data[i];
    }
  }

  Transpose() {
    let newData: Image = new Image(this.height, this.width);
    for (let i: number = 0; i < this.width; i++) {
      for (let j: number = 0; j < this.height; j++) {
        newData.SetPixel(j, i, this.GetPixel(i, j));
      }
    }
    for (let i: number = 0; i < this.data.length; i++) {
      this.data[i] = newData.data[i];
    }
  }
}
