export class RGBA {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export const Black: RGBA = new RGBA(0, 0, 0, 255);
export const White: RGBA = new RGBA(255, 255, 255, 255);
export const Red: RGBA = new RGBA(255, 0, 0, 255);
export const Green: RGBA = new RGBA(0, 255, 0, 255);
export const Blue: RGBA = new RGBA(0, 0, 255, 255);
