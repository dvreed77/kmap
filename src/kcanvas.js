import { SQRT_3, GridGenerator, isOdd } from "./utils";
import { fromTriangles, applyToPoints } from "transformation-matrix";
import * as d3 from "d3";
import { find, zipObject } from "lodash";
import { polygonHull } from "d3-polygon";

// Using https://github.com/chrvadala/transformation-matrix for transformations
class KGrid {
  constructor() {
    this.kPoints = [];
    this.lines = [];

    const qTree = d3
      .quadtree()
      .x(d => d.x)
      .y(d => d.y);

    this.qTree = qTree;
  }

  intitialize(width, height) {
    this.width = width;
    this.height = height;

    this.setup();
  }

  setup() {
    this.F = 20;
    this.H = 2 * this.F;
    this.G = SQRT_3 * this.F;

    this.HEX_W = 2 * this.G;
    this.N_HEX_COLS = Math.ceil(this.width / this.HEX_W);
    this.N_HEX_ROWS = Math.ceil(this.height / (this.F + this.H));

    this.genGrid();
  }

  // THIS DRAWS THE POLYGON THAT REPRESENT DOG COORDS
  // const polygons = Object.entries(R.groupBy(d => `${d.i}.${d.j}`)(pts)).map(
  //   ([k, v]) => {
  //     var path = d3.path();
  //     path.moveTo(v[0].x, v[0].y);
  //     for (let i = 0; i < v.length; i++) {
  //       path.lineTo(v[i].x, v[i].y);
  //     }
  //     path.closePath();

  //     return path.toString();
  //   }
  // );

  // var path = d3.path();
  // if (shape.length) {
  //   path.moveTo(shape[0][0], shape[0][1]);
  //   for (let i = 0; i < shape.length; i++) {
  //     path.lineTo(shape[i][0], shape[i][1]);
  //   }
  //   path.closePath();
  // }

  // const shapePath = path.toString();

  createKPoint(kPoint) {
    if (Array.isArray(kPoint) && kPoint.length === 4) {
      kPoint = zipObject(["ant", "bat", "cat", "dog"], kPoint);
    }
    return find(this.kPoints, kPoint);
  }

  genGrid() {
    const kPoints = [];
    const lines = [];

    for (const [idx, i, j] of GridGenerator(this.N_HEX_COLS, this.N_HEX_ROWS)) {
      let x0, ant, bat;
      if (isOdd(j)) {
        x0 = i * this.HEX_W + this.HEX_W / 2;
        ant = (j + 1) / 2 + i;
        bat = (1 - j) / 2 + i;
      } else {
        x0 = i * this.HEX_W;
        ant = j / 2 + i;
        bat = i - j / 2;
      }

      for (let d = 0; d < 6; d++) {
        const cat = j;
        const dog = d;

        const y0 = j * (this.F + this.H);

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

        kPoints.push(
          KPoint(
            {
              idx: `${idx}.${d}`,
              i,
              j,
              x: xD,
              y: yD,
              ant,
              bat,
              cat,
              dog
            },
            this
          )
        );

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

    this.qTree.addAll(kPoints);
    this.kPoints = kPoints;
    this.lines = lines;
  }

  getGrid() {
    return {
      pts: this.kPoints,
      lines: this.lines
    };
  }
}

export const KPoint = (kPoint, kgrid) => {
  kPoint.rotate = rotationAngle => {
    const { x, y } = kPoint;

    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const angle = Math.atan2(y, x);
    const newAngle = angle + rotationAngle;

    const newX = r * Math.cos(newAngle);
    const newY = r * Math.sin(newAngle);

    return kgrid.qTree.find(newX, newY);
  };

  kPoint.translate = ({ dAnt = 0, dBat = 0, dCat = 0, dDog = 0 }) => {
    return kgrid.createKPoint({
      ant: kPoint.ant + dAnt,
      bat: kPoint.bat + dBat,
      cat: kPoint.cat + dCat,
      dog: kPoint.dog + dDog
    });
  };

  return kPoint;
};

export class KPolygon {
  constructor(kPoints, color) {
    this.kPoints = kPoints;
    this.color = color;
  }

  tMat() {
    const hull1 = this.color.hull;
    const hull2 = this.kPoints;

    // get transMatrix from hull1 to hull2
    const triangle1 = hull1.slice(0, 3).map(d => [d.x, d.y]);
    const triangle2 = hull2.slice(0, 3).map(d => [d.x, d.y]);
    return fromTriangles(triangle1, triangle2);
  }

  copy() {
    return new KPolygon(this.kPoints, this.color);
  }

  rotate(rotationAngle) {
    this.kPoints = this.kPoints.map(d => d.rotate(rotationAngle));
    return this;
  }

  translate(translation) {
    this.kPoints = this.kPoints.map(d => d.translate(translation));
    return this;
  }

  position({ ant, bat, cat }) {
    // console.log(this.kPoints[0].ant, this.kPoints[0].bat, this.kPoints[0].cat);
    // console.log(ant, bat, cat);
    const dAnt = ant - this.kPoints[0].ant;
    const dBat = bat - this.kPoints[0].bat;
    const dCat = cat - this.kPoints[0].cat;

    // console.log(dAnt, dBat, dCat);

    this.kPoints = this.kPoints.map(kPt => kPt.translate({ dAnt, dBat, dCat }));

    // console.log(this.kPoints[0].ant, this.kPoints[0].bat, this.kPoints[0].cat);
    // console.log(ant, bat, cat);

    // console.log("====");

    return this;
  }

  center() {
    const aMin = Math.min(...this.kPoints.map(d => d.ant));
    const bMin = Math.min(...this.kPoints.map(d => d.bat));
    const cMin = Math.min(...this.kPoints.map(d => d.cat));

    const aMax = Math.max(...this.kPoints.map(d => d.ant));
    const bMax = Math.max(...this.kPoints.map(d => d.bat));
    const cMax = Math.max(...this.kPoints.map(d => d.cat));

    this.kPoints = this.kPoints.map(d =>
      d.translate({
        dAnt: -(aMin + aMax) / 2,
        dBat: -(bMin + bMax) / 2,
        dCat: -(cMin + cMax) / 2
      })
    );
    return this;
  }

  pathString(tMat) {
    var path = d3.path();

    const points = this.kPoints.map(d => [d.x, d.y]);

    const newPoints = tMat ? applyToPoints(tMat, points) : points;

    if (newPoints.length) {
      path.moveTo(newPoints[0][0], newPoints[0][1]);
      newPoints.forEach(([x, y]) => path.lineTo(x, y));
      path.closePath();
    }

    return path.toString();
  }
}

export class KPolygonGroup {
  constructor(kPolygons = [], hull = []) {
    this.kPolygons = kPolygons;
    this.hull = hull;
  }

  add(kPolygon) {
    this.kPolygons.push(kPolygon);
  }

  copy() {
    return new KPolygonGroup(this.kPolygons.map(kP => kP.copy()));
  }

  rotate(rotationAngle) {
    this.kPolygons = this.kPolygons.map(kP => kP.rotate(rotationAngle));
    return this;
  }

  hullString() {
    const pts = this.kPolygons.flatMap(kPolygon =>
      kPolygon.kPoints.map(kPoint => kPoint)
    );

    const hull = polygonHull(
      pts.map(kPoint => [kPoint.x, kPoint.y, kPoint.idx])
    );

    console.log(
      pts,
      hull,
      pts.find(pt => pt.idx === "96.0")
    );

    var path = d3.path();

    if (this.hull.length) {
      path.moveTo(this.hull[0].x, this.hull[0].y);
      this.hull.forEach(kP => path.lineTo(kP.x, kP.y));
      path.closePath();
    }

    return path.toString();
  }

  translate(translation) {
    this.kPolygons = this.kPolygons.map(kP => kP.translate(translation));
    return this;
  }
}

export default KGrid;
