import { isNil } from "ramda";
import { quadtree } from "d3";
export const SQRT_3 = Math.sqrt(3);

export const isOdd = (d: number) => !!(d % 2);

export function* GridGenerator(
  nCols: number,
  nRows: number
): IterableIterator<[number, number, number]> {
  // See page 68 of notes
  let cStart, cEnd;
  if (isOdd(nCols)) {
    cStart = -(nCols + 1) / 2;
    cEnd = (nCols + 1) / 2 - 1;
  } else {
    cStart = -nCols / 2 - 1;
    cEnd = nCols / 2;
  }

  let rStart, rEnd;
  if (isOdd(nRows)) {
    rStart = -(nRows + 1) / 2 + 1;
    rEnd = (nRows + 1) / 2;
  } else {
    rStart = -nRows / 2;
    rEnd = nRows / 2;
  }

  let idx = 0;
  for (let i = cStart; i <= cEnd; i++) {
    for (let j = rStart; j <= rEnd; j++) {
      yield [idx, i, j];
      idx++;
    }
  }
}

type Point = [number, number];

export class KGrid {
  cols: number;
  rows: number;
  width: number;
  height: number;
  qTree: any;
  hexDims: {
    hexWidth: number;
    F: number;
    G: number;
    H: number;
  };
  pts: Point[] = [];

  constructor({
    cols,
    rows,
    width = 200,
  }: {
    cols: number;
    rows: number;
    width?: number;
  }) {
    this.cols = cols;
    this.rows = rows;
    this.width = width;

    this.qTree = quadtree()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const hexWidth = this.width / this.cols;

    const G = hexWidth / 2;
    const F = G / SQRT_3;
    const H = 2 * F;

    this.hexDims = {
      hexWidth,
      G,
      F,
      H,
    };
    this.height = this.rows * (F + H);

    const gridPoints = [];

    for (const [id, i, j] of GridGenerator(this.cols, this.rows)) {
      const c = j;
      // Page 54 in notes
      const a = isOdd(j) ? (j + 1) / 2 + i : j / 2 + i;
      const b = isOdd(j) ? (1 - j) / 2 + i : i - j / 2;

      for (let d = 0; d < 6; d++) {
        const [x, y] = this.kPtToPt0([a, b, c, d]);

        this.pts.push([x, y]);

        gridPoints.push({
          id: `${id}.${d}`,
          i,
          j,
          a,
          b,
          c,
          d,
          x,
          y,
        });
      }
    }

    this.qTree.addAll(gridPoints);
  }

  pt0ToKPt([x, y]: [number, number]) {
    const r = this.qTree.find(x, y);
    const { x: x0, y: y0 } = r;
    return [x0, y0];
  }

  kPtToPt0([a, b, c, d]: number[]): [number, number] {
    const j = c;
    const i = isOdd(j) ? a - (j + 1) / 2 : a - j / 2;
    const { hexWidth, F, G, H } = this.hexDims;
    // see page 54 of notes
    const x0 = isOdd(j) ? i * hexWidth + hexWidth / 2 : i * hexWidth;
    const y0 = j * (F + H);
    let dx, dy;
    if (d === 0) {
      dx = 0;
      dy = 0;
    } else {
      const angle = ((-30 * d + 150) * Math.PI) / 180;
      if (isOdd(d)) {
        dx = G * Math.cos(angle);
        dy = -G * Math.sin(angle);
      } else {
        dx = H * Math.cos(angle);
        dy = -H * Math.sin(angle);
      }
    }
    const xD = x0 + dx;
    const yD = y0 + dy;
    return [xD, yD];
  }
}
