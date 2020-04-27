import { curry, clone } from "ramda";
import { compose, rotate } from "transformation-matrix";

export const rotatePolygon = curry((polygon_: any) => {
  const polygon = clone(polygon_);
  polygon.transMat = compose(polygon.transMat, rotate(Math.PI / 3));

  return polygon;
});
