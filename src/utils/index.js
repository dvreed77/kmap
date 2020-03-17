import { path as d3Path } from "d3";

export * from "./generateGrid";
export * from "./convertPt";

export const SQRT_3 = Math.sqrt(3);

export const isOdd = d => !!(d % 2);

export const genPathString = (pts, closed = true) => {
  var path = d3Path();

  if (pts.length) {
    path.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(([x, y]) => path.lineTo(x, y));
    if (closed) path.closePath();
    // path.closePath();
  }
  return path.toString();
};
