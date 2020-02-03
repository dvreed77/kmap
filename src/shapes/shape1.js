import { KPolygon, KPolygonGroup } from "../kcanvas";
import { colors } from "../colors";
// Triangle with Red center hexagon and green tips

const createShape = kgrid => {
  // Octagon
  const octagon = new KPolygon(
    [
      kgrid.createKPoint([1, 0, 1, 0]),
      kgrid.createKPoint([0, -1, 1, 0]),
      kgrid.createKPoint([-1, -1, 0, 0]),
      kgrid.createKPoint([-1, 0, -1, 0]),
      kgrid.createKPoint([0, 1, -1, 0]),
      kgrid.createKPoint([1, 1, 0, 0])
    ],
    colors.A
  );

  const triangle = new KPolygon(
    [
      kgrid.createKPoint([-2, 2, -4, 0]),
      kgrid.createKPoint([-2, 0, -2, 0]),
      kgrid.createKPoint([0, 2, -2, 0])
    ],
    colors.B
  );

  const fillShape = new KPolygon(
    [
      kgrid.createKPoint([-1, 1, -2, 0]),
      kgrid.createKPoint([-2, 0, -2, 0]),
      kgrid.createKPoint([-2, -1, -1, 0]),
      kgrid.createKPoint([-1, -1, 0, 3]),
      kgrid.createKPoint([-1, 0, -1, 0]),
      kgrid.createKPoint([-1, 0, -1, 5])
    ],
    colors.C
  );

  const polygons = [octagon, triangle, fillShape];

  for (let i = 1; i < 6; i++) {
    polygons.push(fillShape.copy().rotate((i * 60 * Math.PI) / 180));
  }

  for (let i = 1; i < 3; i++) {
    polygons.push(triangle.copy().rotate((i * 120 * Math.PI) / 180));
  }

  const polygonGroup = new KPolygonGroup(polygons, [
    kgrid.createKPoint([-2, -4, 2, 0]),
    kgrid.createKPoint([-2, 2, -4, 0]),
    kgrid.createKPoint([4, 2, 2, 0])
  ]);

  return polygonGroup;
};

export default createShape;
