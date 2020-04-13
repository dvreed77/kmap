import { isNil } from "ramda";
import { quadtree as d3QuadTree } from "d3";
export const SQRT_3 = Math.sqrt(3);

export const isOdd = d => !!(d % 2);

export function* GridGenerator(nCols, nRows) {
  console.log("nCols", nCols);
  console.log("nRows", nRows);

  // See page 68 of notes
  let cStart, cEnd;
  if (isOdd(nCols)) {
    cStart = -(nCols + 1) / 2;
    cEnd = (nCols + 1) / 2 - 1;
  } else {
    cStart = -nCols / 2 - 1;
    cEnd = nCols / 2;
  }

  console.log("cStart->cEnd", cStart, cEnd);

  let rStart, rEnd;
  if (isOdd(nRows)) {
    rStart = -(nRows + 1) / 2 + 1;
    rEnd = (nRows + 1) / 2;
  } else {
    rStart = -nRows / 2;
    rEnd = nRows / 2;
  }

  console.log("rStart-rEnd", rStart, rEnd);

  let idx = 0;
  for (let i = cStart; i <= cEnd; i++) {
    for (let j = rStart; j <= rEnd; j++) {
      yield [idx, i, j];
      idx++;
    }
  }
}

export const KGrid = function(nCols, nRows) {
  this.nCols = nCols;
  this.nRows = nRows;
  this.cWidth = null;
  this.cHeight = null;
  this.hexDims = {};

  this.qTree = d3QuadTree()
    .x(d => d.x)
    .y(d => d.y);

  this.setWidth = function(width) {
    this.cWidth = width;

    const hexWidth = this.cWidth / this.nCols;

    const G = hexWidth / 2;
    const F = G / SQRT_3;
    const H = 2 * F;

    this.hexDims = {
      hexWidth,
      G,
      F,
      H
    };
    this.cHeight = this.nRows * (F + H);

    return {
      width: this.cWidth,
      height: this.cHeight
    };
  };

  this.generateGrid = function() {
    const gridPoints = [];
    // const gridLines = [];

    for (const [idx, i, j] of GridGenerator(nCols, nRows)) {
      let ant, bat;

      const cat = j;

      // Page 54 in notes
      if (isOdd(j)) {
        ant = (j + 1) / 2 + i;
        bat = (1 - j) / 2 + i;
      } else {
        ant = j / 2 + i;
        bat = i - j / 2;
      }

      for (let d = 0; d < 6; d++) {
        const dog = d;

        const [x, y] = this.convertPt({ i, j, d });

        gridPoints.push({
          idx: `${idx}.${d}`,
          i,
          j,
          ant,
          bat,
          cat,
          dog,
          x,
          y
        });

        // Gen Spokes
        // for (let d = 0; d < 12; d++) {
        //   const angle = (d * 2 * Math.PI) / 12;

        //   let dx, dy;

        //   if (d % 2) {
        //     dx = this.H * Math.cos(angle);
        //     dy = -this.H * Math.sin(angle);
        //   } else {
        //     dx = this.G * Math.cos(angle);
        //     dy = -this.G * Math.sin(angle);
        //   }

        //   lines.push([
        //     [x0, y0],
        //     [x0 + dx, y0 + dy]
        //   ]);
        // }

        // Gen Edges
        // See Page 60 of notes
        // for (let d = 0; d < 6; d++) {
        //   const angle1 = ((-30 * d + 150) * Math.PI) / 180;
        //   const angle2 = ((-30 * (d + 1) + 150) * Math.PI) / 180;

        //   let dx1, dy1, dx2, dy2;

        //   if (d % 2) {
        //     dx1 = this.G * Math.cos(angle1);
        //     dy1 = -this.G * Math.sin(angle1);
        //     dx2 = this.H * Math.cos(angle2);
        //     dy2 = -this.H * Math.sin(angle2);
        //   } else {
        //     dx1 = this.H * Math.cos(angle1);
        //     dy1 = -this.H * Math.sin(angle1);
        //     dx2 = this.G * Math.cos(angle2);
        //     dy2 = -this.G * Math.sin(angle2);
        //   }

        //   lines.push([
        //     [x0 + dx1, y0 + dy1],
        //     [x0 + dx2, y0 + dy2]
        //   ]);
        // }
      }
    }

    this.qTree.addAll(gridPoints);

    return gridPoints;
  };

  this.convertPt = function({ ant, bat, cat, dog, i, j, d }) {
    if (isNil(j)) {
      j = cat;
    }

    if (isNil(i)) {
      i = isOdd(j) ? ant - (j + 1) / 2 : ant - j / 2;
    }
    if (isNil(d)) {
      d = dog;
    }
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
  };
};
