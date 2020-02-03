import { KPolygon, KPolygonGroup } from "../kcanvas";
import { colors } from "../colors";

const shape1 = [
  [-3, -2, -1, 4],
  [-3, -1, -2, 0],
  [-1, 1, -2, 0],
  [-1, 0, -1, 4],
  [-1, 0, -1, 2],
  [-2, -1, -1, 4],
  [-2, -1, -1, 2]
];

const shape2 = [
  [-2, -2, 0, 0],
  [-2, -2, 0, 1],
  [-2, -2, 0, 2],
  [-3, -2, -1, 4],
  [-2, -1, -1, 0],
  [-2, -1, -1, 5],
  [-1, -1, 0, 2]
];

const shape3 = [
  [-2, -2, 0, 0],
  [-1, -1, 0, 2],
  [0, 0, 0, 0]
];

const shape4 = [
  [0, 0, 0, 0],
  [-1, -1, 0, 2],
  [-2, -1, -1, 5],
  [-1, 0, -1, 0],
  [-1, 0, -1, 4],
  [0, 0, 0, 2],
  [0, 0, 0, 3]
];

const shape5 = [
  [-3, -2, -1, 4],
  [-2, -1, -1, 2],
  [-2, -1, -1, 4],
  [-1, 0, -1, 2],
  [-1, 0, -1, 4],
  [-1, 0, -1, 0],
  [-2, -1, -1, 0]
];
const createShape = kgrid => {
  const p1 = new KPolygon(
    shape1.map(p => kgrid.createKPoint(p)),
    colors.A
  );

  const p2 = new KPolygon(
    shape2.map(p => kgrid.createKPoint(p)),
    colors.B
  );

  const p3 = new KPolygon(
    shape3.map(p => kgrid.createKPoint(p)),
    colors.C
  );

  const p4 = new KPolygon(
    shape4.map(p => kgrid.createKPoint(p)),
    colors.D
  );

  const p5 = new KPolygon(
    shape5.map(p => kgrid.createKPoint(p)),
    colors.E
  );

  return new KPolygonGroup(
    [p1, p2, p3, p4, p5],
    [
      kgrid.createKPoint([-2, -2, 0, 0]),
      kgrid.createKPoint([-4, -2, -2, 0]),
      kgrid.createKPoint([0, 2, -2, 0]),
      kgrid.createKPoint([0, 0, 0, 0])
    ]
  );
};

export default createShape;
