import { curry, clone } from "ramda";
import { compose, translate } from "transformation-matrix";

export const movePolygon = curry((pt0: Point, polygon_: any) => {
  const polygon = clone(polygon_);
  // consol.log(polygon)
  // const [x, y] = polygon.pts[0];
  polygon.transMat = translate(pt0[0], pt0[1]);
  // console.log(polygon);

  return polygon;
});
