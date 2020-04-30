import { path as d3Path } from "d3";

export const SQRT_3 = Math.sqrt(3);

export const isOdd = (d: number) => !!(d % 2);

export const genPathString = (pts: [number, number][], closed = true) => {
  var path = d3Path();

  if (pts.length) {
    path.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(([x, y]) => path.lineTo(x, y));
    if (closed) path.closePath();
    // path.closePath();
  }
  return path.toString();
};

export const getBounds = (pts: [number, number][]) => {
  console.log(pts);
  const minX = pts.reduce((a, b) => (a < b[0] ? a : b[0]), Infinity);
  const minY = pts.reduce((a, b) => (a < b[1] ? a : b[1]), Infinity);

  const maxX = pts.reduce((a, b) => (a > b[0] ? a : b[0]), -Infinity);
  const maxY = pts.reduce((a, b) => (a > b[1] ? a : b[1]), -Infinity);

  const boundingPts = [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
  ];

  console.log(minX, maxX, minY, maxY);

  const width = maxX - minX;
  const height = maxY - minY;
  const cX = (minX + maxX) / 2;
  const cY = (minY + maxY) / 2;
  return {
    boundingPts,
    width,
    height,
    center: [cX, cY],
  };
};
