import * as React from "react";
import { KGrid } from "./generateGrid";
import { shapes } from "./shapes";
import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoints,
} from "transformation-matrix";

type Polygon = {
  dave: number;
};

export const Page1 = () => {
  const [kGrid, setKGrid] = React.useState<KGrid | undefined>();
  const [polygons, setPolygons] = React.useState<Polygon[]>([]);
  React.useEffect(() => {
    const kGrid = new KGrid({ cols: 10, rows: 8 });
    setKGrid(kGrid);
  }, []);

  if (!kGrid) {
    return <div></div>;
  }
  const padding = 10;
  const { width, height, pts } = kGrid;

  let matrix = compose(scale(2), rotate(Math.PI / 3));

  const pts2 = applyToPoints(matrix, pts);
  return (
    <div>
      <svg
        width={width + 2 * padding}
        height={height + 2 * padding}
        // onMouseMove={mouseMove}
        // onClick={mouseClick}
      >
        <defs>
          <clipPath id="clipPath">
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
            />
          </clipPath>
        </defs>
        <g
          transform={`translate(${padding + width / 2}, ${
            padding + height / 2
          })`}
          clipPath="url(#clipPath)"
        >
          {pts.map(([x, y], idx) => (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={2}
              className="text-gray-400 fill-current"
            />
          ))}
          <rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            className="text-gray-300 stroke-current stroke-2"
            fill="none"
          />
        </g>
      </svg>
      <svg
        width={width + 2 * padding}
        height={height + 2 * padding}
        // onMouseMove={mouseMove}
        // onClick={mouseClick}
      >
        <defs>
          <clipPath id="clipPath">
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
            />
          </clipPath>
        </defs>
        <g
          transform={`translate(${padding + width / 2}, ${
            padding + height / 2
          })`}
          clipPath="url(#clipPath)"
        >
          {pts2.map(([x, y], idx) => (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={2}
              className="text-gray-400 fill-current"
            />
          ))}
          <rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            className="text-gray-300 stroke-current stroke-2"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
