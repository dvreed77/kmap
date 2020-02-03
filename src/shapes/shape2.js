import { KPolygon, KPolygonGroup } from "../kcanvas";
import Shape1 from "./shape1";
import Shape3 from "./shape3";
import { colors } from "../colors";

const createShape = kgrid => {
  const kG1 = Shape1(kgrid);

  const p3 = new KPolygon(
    [
      [0, 1, -1, 0],
      [0, 2, -2, 0],
      [2, 2, 0, 0],
      [1, 1, 0, 0]
    ].map(p => kgrid.createKPoint(p)),
    Shape3(kgrid)
  );

  const t1Polygons = [
    new KPolygon(
      [
        kgrid.createKPoint([0, 0, 0, 0]),
        kgrid.createKPoint([0, 1, -1, 0]),
        kgrid.createKPoint([1, 1, 0, 0])
      ],
      kG1
    ),
    p3
  ];

  // for (let i = 1; i < 6; i++) {
  //   t1Polygons.push(t1Polygons[0].copy().rotate((i * 60 * Math.PI) / 180));
  // }

  const pg1 = new KPolygonGroup(
    t1Polygons,
    [
      [0, 0, 0, 0],
      [2, 2, 0, 0],
      [0, 2, -2, 0]
    ].map(p => kgrid.createKPoint(p))
  );

  return new KPolygon(
    [
      [0, 0, 0, 0],
      [2, 2, 0, 0],
      [0, 2, -2, 0]
    ].map(p => kgrid.createKPoint(p)),
    pg1
  );
};

export default createShape;
