import { Cell } from '../';
import { Random } from './random';

export class MathUtils {
  public static MaxX(mapCells: Cell[]): number {
    let retVal: number = -Infinity;
    for (let i: number = 0; i < mapCells.length; i++) {
      retVal = mapCells[i].x > retVal ? mapCells[i].x : retVal;
    }
    return retVal;
  }

  public static MinX(mapCells: Cell[]): number {
    let retVal: number = Infinity;
    for (let i: number = 0; i < mapCells.length; i++) {
      retVal = mapCells[i].x < retVal ? mapCells[i].x : retVal;
    }
    return retVal;
  }

  public static MaxY(mapCells: Cell[]): number {
    let retVal: number = -Infinity;
    for (let i: number = 0; i < mapCells.length; i++) {
      retVal = mapCells[i].y > retVal ? mapCells[i].y : retVal;
    }
    return retVal;
  }

  public static MinY(mapCells: Cell[]): number {
    let retVal: number = Infinity;
    for (let i: number = 0; i < mapCells.length; i++) {
      retVal = mapCells[i].y < retVal ? mapCells[i].y : retVal;
    }
    return retVal;
  }

  public static Shuffle<Type>(items: Type[], random: Random): Type[] {
    let n: number = items.length;
    while (n > 1) {
      n--;
      let k: number = random.GetInt(n + 1);
      let item: Type = items[k];
      items[k] = items[n];
      items[n] = item;
    }
    return items;
  }
}
