//Directions
//3-sides point up: 0 - Northeast, 1 - South, 2 - Northwest
//3-sides point down: 0 - North, 1 - Southeast, 2 - Southwest
//4-sides : 0 - North, 1 - East, 2 - South, 3 - West
//6-sides : 0 - North, 1 - Northeast, 2 - Southeast, 3 - South, 4 - Southwest, 5 - Northwest

export class Wall {
  direction!: number;
  isWall!: boolean;
  isStairsDown!: boolean;
  isStairsUp!: boolean;
  weight: number;

  constructor() {
    this.weight = 0;
  }

  IsFlat(): boolean {
    return !this.isWall && !this.isStairsUp && !this.isStairsDown;
  }
}
