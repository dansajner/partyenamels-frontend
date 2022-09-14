export class Random {
  seed: number;
  private i: number = 0;

  constructor(seed: number) {
    this.seed = seed;
  }

  GetInt(max: number) {
    return Math.floor(this.mulberry32() * max);
  }

  GetIntInRange(min: number, max: number) {
    return Math.floor(this.mulberry32() * (max - min)) + min;
  }

  private mulberry32(): number {
    this.i++;
    let t: number = (this.seed + this.i) ^ 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
