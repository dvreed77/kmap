import * as React from "react";
import { KGrid } from "./generateGrid";
import { shapes } from "./shapes";
import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoints,
  inverse,
} from "transformation-matrix";
import { genPathString, getBounds } from "../../utils";
import { KGridContext, NPolygon } from ".";
import { Polygon } from "./Polygon";

interface ICanvas {
  width: number;
  boundingPolygon: [number, number][];
  polygons: NPolygon[];
  addPolygon: any;
  action: any;
  setAction: any;
}

export const Canvas = ({
  width,
  boundingPolygon,
  polygons,
  addPolygon,
  action,
  setAction,
}: ICanvas) => {
  const kGrid = React.useContext(KGridContext);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [clickedPoints, setClickedPoints] = React.useState([]);

  if (!kGrid) return <div></div>;

  const mouseMove = ({
    clientX: cX,
    clientY: cY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    const node = svgRef.current;
    if (node) {
      const {
        x: rX,
        y: rY,
        width: rW,
        height: rH,
      } = node.getBoundingClientRect();

      const x = cX - rX - rW / 2 - padding;
      const y = cY - rY - rH / 2 - padding;

      // if (pt === clickedPoints[0]) {
      // const id = Math.random().toString(36).slice(2);
      // setPolygons(
      //   (polygons) =>
      //     [
      //       ...polygons,
      //       {
      //         grpId: id,
      //         id,
      //         kPts: clickedPoints,
      //         color: "green",
      //       },
      //     ] as any
      // );
      // setClickedPoints([]);
      // setAction({ action: null, data: null });
      // } else {

      // }
    }

    // const mY = cY - rY - dims.height / 2 - padding;
    // const cursorPt = kGrid.qTree.find(mX, mY);
    // return onMouseMove(kGrid, cursorPt);
  };

  const onMouseClick = ({
    clientX: cX,
    clientY: cY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    const node = svgRef.current;

    if (node) {
      const {
        x: rX,
        y: rY,
        width: rW,
        height: rH,
      } = node.getBoundingClientRect();

      const x = cX - rX - rW / 2 - padding;
      const y = cY - rY - rH / 2 - padding;

      console.log(x, y);

      if (action.action === "MOVE") {
        setAction({ action: null, data: null });
      } else if (action.action === "NEW") {
        if (clickedPoints.length) {
          const [x0, y0] = clickedPoints[0];
          const d = Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2));
          if (d < 3) {
            const id = Math.random().toString(36).slice(2);
            const polygon = {
              grpId: id,
              id,
              pts: applyToPoints(inverse(tmat), clickedPoints),
              color: "green",
            };
            addPolygon(polygon);
            setClickedPoints([]);
          } else {
            setClickedPoints((pts: any) => [...pts, [x, y]] as any);
          }
        } else {
          setClickedPoints((pts: any) => [...pts, [x, y]] as any);
        }
      }
    }
  };

  const { width: bWidth, height: bHeight } = getBounds(boundingPolygon);

  const padding = 10;
  const { width: gridWidth, height: gridHeight, pts } = kGrid;

  const s = width / bWidth;
  const height = s * bHeight;

  const tmat = scale(s);
  const pts2 = applyToPoints(tmat, pts);
  const bounds2 = applyToPoints(tmat, boundingPolygon);

  const dPath = genPathString(bounds2, true);

  return (
    <svg
      ref={svgRef}
      width={width + 2 * padding}
      height={height + 2 * padding}
      // onMouseMove={mouseMove}
      onClick={onMouseClick}
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
        {pts2.map(([x, y], idx) => (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r={Math.min(2 * s, 4)}
            className="text-gray-400 fill-current"
          />
        ))}

        {polygons.map(({ id, color, pts }) => (
          <Polygon key={id} id={id} color={color} pts={pts} tmat={tmat} />
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
