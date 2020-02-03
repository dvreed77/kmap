import { KPolygon, KPolygonGroup } from "../kcanvas";
import Shape2 from "./shape2";

const createShape = kgrid => {
  const polygons = [Shape2(kgrid)];

  for (let i = 1; i < 6; i++) {
    polygons.push(polygons[0].copy().rotate((i * 60 * Math.PI) / 180));
  }

  return new KPolygon(
    [
      [2, 2, 0, 0],
      [0, 2, -2, 0],
      [-2, 0, -2, 0],
      [-2, -2, 0, 0],
      [0, -2, 2, 0],
      [2, 0, 2, 0]
    ].map(p => kgrid.createKPoint(p)),
    new KPolygonGroup(
      polygons,
      [
        [2, 2, 0, 0],
        [0, 2, -2, 0],
        [-2, 0, -2, 0],
        [-2, -2, 0, 0],
        [0, -2, 2, 0],
        [2, 0, 2, 0]
      ].map(p => kgrid.createKPoint(p))
    )
  );
};

export default createShape;
