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
import { genPathString } from "../../utils";

type Polygon = {
  dave: number;
};

const KGridContext = React.createContext<KGrid | null>(null);

interface ICanvas {
  bounds: [number, number][];
}
const Canvas = ({ bounds }: ICanvas) => {
  const kGrid = React.useContext(KGridContext);

  if (!kGrid) return <div></div>;

  console.log(kGrid);
  const padding = 10;
  const { width, height, pts } = kGrid;

  const dPath = genPathString(bounds, true);

  return (
    <svg
      width={width + 2 * padding}
      height={height + 2 * padding}
      // onMouseMove={mouseMove}
      // onClick={mouseClick}
    >
      <defs>
        <clipPath id="clipPath">
          <path d={dPath} />
        </clipPath>
      </defs>
      <g
        transform={`translate(${padding + width / 2}, ${padding + height / 2})`}
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

        <path
          d={dPath}
          className="text-gray-300 stroke-current stroke-2"
          fill="none"
        />
      </g>
    </svg>
  );
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

  console.log(kGrid);

  const { width, height, pts } = kGrid;

  const bounds = [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
  ];

  return (
    <KGridContext.Provider value={kGrid}>
      <Canvas bounds={bounds} />
    </KGridContext.Provider>
  );
};
