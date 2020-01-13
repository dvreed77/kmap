import { SQRT_3, GridGenerator, isOdd } from "./utils";
import * as d3 from "d3";

class KGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.setup2();
  }

  setup1() {
    this.N_HEX_COLS = 7;
    this.HEX_W = this.width / this.N_HEX_COLS;
    this.F = this.HEX_W / (2 * SQRT_3);
    this.H = this.HEX_W / SQRT_3;
    this.G = this.HEX_W / 2;
    this.N_HEX_ROWS = Math.ceil(this.height / (this.F + this.H));

    this.createGrid();
    this.createLines();
  }

  setup2() {
    this.F = 20;
    this.H = 2 * this.F;
    this.G = SQRT_3 * this.F;

    this.HEX_W = 2 * this.G;
    this.N_HEX_COLS = Math.ceil(this.width / this.HEX_W);
    this.N_HEX_ROWS = Math.ceil(this.height / (this.F + this.H));
  }

  genGrid(density = 1) {
    const pts = [];
    const lines = [];

    // this.F = 20 / density;
    // this.H = 2 * this.F;
    // this.G = SQRT_3 * this.F;

    // this.HEX_W = 2 * this.G;
    // this.N_HEX_COLS = Math.ceil(this.width / this.HEX_W);
    // this.N_HEX_ROWS = Math.ceil(this.height / (this.F + this.H));

    for (const [i, j] of GridGenerator(this.N_HEX_COLS, this.N_HEX_ROWS)) {
      let x0, ant, bat;
      if (isOdd(j)) {
        x0 = i * this.HEX_W + this.HEX_W / 2 + this.width / 2;
        ant = (j + 1) / 2 + i;
        bat = (1 - j) / 2 + i;
      } else {
        x0 = i * this.HEX_W + this.width / 2;
        ant = j / 2 + i;
        bat = i - j / 2;
      }

      for (let d = 0; d < 6; d++) {
        const cat = j;
        const dog = d;

        const y0 = j * (this.F + this.H) + this.height / 2;

        let dx, dy;
        if (d === 0) {
          dx = 0;
          dy = 0;
        } else {
          const angle = ((-30 * d + 150) * Math.PI) / 180;
          if (isOdd(d)) {
            dx = this.G * Math.cos(angle);
            dy = -this.G * Math.sin(angle);
          } else {
            dx = this.H * Math.cos(angle);
            dy = -this.H * Math.sin(angle);
          }
        }

        const xD = x0 + dx;
        const yD = y0 + dy;

        pts.push({
          i,
          j,
          x: xD,
          y: yD,
          ant,
          bat,
          cat,
          dog
        });

        // Gen Spokes
        for (let d = 0; d < 12; d++) {
          const angle = (d * 2 * Math.PI) / 12;

          let dx, dy;

          if (d % 2) {
            dx = this.H * Math.cos(angle);
            dy = -this.H * Math.sin(angle);
          } else {
            dx = this.G * Math.cos(angle);
            dy = -this.G * Math.sin(angle);
          }

          lines.push([
            [x0, y0],
            [x0 + dx, y0 + dy]
          ]);
        }

        // Gen Edges
        // See Page 60 of notes
        for (let d = 0; d < 6; d++) {
          const angle1 = ((-30 * d + 150) * Math.PI) / 180;
          const angle2 = ((-30 * (d + 1) + 150) * Math.PI) / 180;

          let dx1, dy1, dx2, dy2;

          if (d % 2) {
            dx1 = this.G * Math.cos(angle1);
            dy1 = -this.G * Math.sin(angle1);
            dx2 = this.H * Math.cos(angle2);
            dy2 = -this.H * Math.sin(angle2);
          } else {
            dx1 = this.H * Math.cos(angle1);
            dy1 = -this.H * Math.sin(angle1);
            dx2 = this.G * Math.cos(angle2);
            dy2 = -this.G * Math.sin(angle2);
          }

          lines.push([
            [x0 + dx1, y0 + dy1],
            [x0 + dx2, y0 + dy2]
          ]);
        }
      }
    }

    return {
      pts,
      lines
    };
  }

  convertHexPointToCanvasPoint(kP) {
    const j0 = kP.cat;
    let i0, x0;
    if (j0 % 2) {
      i0 = kP.ant - (j0 + 1) / 2;
      x0 = i0 * this.HEX_W + this.HEX_W / 2 + this.width / 2;
    } else {
      i0 = kP.ant - j0 / 2;
      x0 = i0 * this.HEX_W + this.width / 2;
    }

    const y0 = (j0 * 3 * this.HEX_W) / (2 * SQRT_3) + this.height / 2;

    let dx, dy;
    if (kP.dog === 0) {
      dx = 0;
      dy = 0;
    } else {
      const angle = ((-30 * kP.dog + 150) * Math.PI) / 180;
      if (kP.dog % 2) {
        dx = this.G * Math.cos(angle);
        dy = -this.G * Math.sin(angle);
      } else {
        dx = this.H * Math.cos(angle);
        dy = -this.H * Math.sin(angle);
      }
    }

    return [x0 + dx, y0 + dy];
  }

  rotateKPoint(kPoint, rotationAngle = 0) {
    const cP = this.convertHexPointToCanvasPoint(kPoint);
    const xP = cP[0] - this.width / 2;
    const yP = cP[1] - this.height / 2;

    const r = Math.sqrt(Math.pow(xP, 2) + Math.pow(yP, 2));
    const angle = Math.atan2(yP, xP);
    const newAngle = angle + rotationAngle;

    const newX = r * Math.cos(newAngle);
    const newY = r * Math.sin(newAngle);

    console.log("ROTATE", xP, yP, newX, newY);
  }
}

class KPoint {
  constructor(ant, bat, cat, dog) {
    this.ant = ant;
    this.bat = bat;
    this.cat = cat;
    this.dog = dog;
  }
}

export class KPolygon {
  constructor(pts) {
    this.pts = pts;
  }

  draw(grid) {
    var path = d3.path();

    const pts = this.pts.map(pt =>
      grid.convertHexPointToCanvasPoint({
        ant: pt[0],
        bat: pt[1],
        cat: pt[2],
        dog: pt[3]
      })
    );
    if (pts.length) {
      path.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < pts.length; i++) {
        path.lineTo(pts[i][0], pts[i][1]);
      }
      path.closePath();
    }

    return path.toString();
  }
}

export default KGrid;
