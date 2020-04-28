import { curry, clone } from "ramda";
import { compose, translate, applyToPoint } from "transformation-matrix";

export const movePolygon = curry((pt0: Point, polygon_: any) => {
  const polygon = clone(polygon_);
  // consol.log(polygon)
  const [x, y] = applyToPoint(polygon.transMat, polygon.pts[0]);
  polygon.transMat = translate(pt0[0], pt0[1]);
  // polygon.transMat = compose(
  //   polygon.transMat,
  //   translate(pt0[0] - x, pt0[1] - y)
  // );
  // console.log(polygon);

  return polygon;
});
