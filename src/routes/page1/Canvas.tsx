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
  applyToPoint,
  Matrix,
} from "transformation-matrix";
import { genPathString, getBounds } from "../../utils";
import { NPolygon } from "./types";
import { AppContext } from ".";
import { Polygon, ClickablePolygon } from "./Polygon";
import * as R from "ramda";

interface ICanvas {
  width: number;
  shapeId: string;
  polygons: NPolygon[];
  kGrid: KGrid;
  state: any;
  setState: any;
  active: any;
  setActive: any;
  movePolygon: any;
  duplicatePolygon: any;
  deletePolygon: any;
}

export const Canvas = React.memo(
  ({
    width,
    shapeId,
    polygons,
    kGrid,
    state,
    setState,
    active,
    setActive,
    movePolygon,
    duplicatePolygon,
    deletePolygon,
  }: ICanvas) => {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [clickedPoints, setClickedPoints] = React.useState([]);

    console.log("render canvas");
    const polygon = polygons.find(
      (d: NPolygon) => d.id === shapeId
    ) as NPolygon;

    polygon.children = polygon.children.map(({ id, transMat }, idx) => {
      const polygon = polygons.find((d: NPolygon) => d.id === id) as NPolygon;
      return {
        ...polygon,
        // id: `${id}.${idx}`,
        transMat,
      };
    });

    if (!kGrid) return <div></div>;

    const mouseMove = ({
      clientX: cX,
      clientY: cY,
    }: {
      clientX: number;
      clientY: number;
    }) => {
      if (state === "MOVE") {
        const node = svgRef.current;
        if (node) {
          const {
            x: rX,
            y: rY,
            width: rW,
            height: rH,
          } = node.getBoundingClientRect();
          const xe = cX - rX - rW / 2;
          const ye = cY - rY - rH / 2;
          const [x0e, y0e] = applyToPoint(inverse(tmat), [xe, ye]);
          const [x0, y0] = kGrid.pt0ToKPt([x0e, y0e]);
          movePolygon([x0, y0]);
        }
      }
    };

    const onMouseClick = ({
      clientX: cX,
      clientY: cY,
    }: {
      clientX: number;
      clientY: number;
    }) => {
      if (state === "MOVE") {
        setState(null);
      }
      // else if (action.action === "NEW") {
      //   const node = svgRef.current;
      //   if (node) {
      //     const {
      //       x: rX,
      //       y: rY,
      //       width: rW,
      //       height: rH,
      //     } = node.getBoundingClientRect();
      //     const xe = cX - rX - rW / 2;
      //     const ye = cY - rY - rH / 2;
      //     // console.log(x, y, );
      //     const [x0e, y0e] = applyToPoint(inverse(tmat), [xe, ye]);
      //     const [x0, y0] = kGrid.pt0ToKPt([x0e, y0e]);
      //     const [x, y] = applyToPoint(tmat, [x0, y0]);
      //     if (clickedPoints.length) {
      //       const [x0, y0] = clickedPoints[0];
      //       const d = Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2));
      //       if (d < 3) {
      //         const id = Math.random().toString(36).slice(2);
      //         const polygon = {
      //           grpId: id,
      //           id,
      //           pts: applyToPoints(inverse(tmat), clickedPoints),
      //           color: "green",
      //         };
      //         addPolygon(polygon);
      //         setClickedPoints([]);
      //       } else {
      //         setClickedPoints((pts: any) => [...pts, [x, y]] as any);
      //       }
      //     } else {
      //       setClickedPoints((pts: any) => [...pts, [x, y]] as any);
      //     }
      //   }
      // }
    };

    const { width: bWidth, height: bHeight } = getBounds(polygon.pts);

    const padding = 10;
    const { width: gridWidth, height: gridHeight, pts } = kGrid;

    const s = width / bWidth;
    const height = s * bHeight;

    const tmat = scale(s);
    const pts2 = applyToPoints(tmat, pts);
    const bounds2 = applyToPoints(tmat, polygon.pts) as [number, number][];

    const dPath = genPathString(bounds2, true);

    return (
      <svg
        style={{ userSelect: "none" }}
        ref={svgRef}
        width={width + 2 * padding}
        height={height + 2 * padding}
        onMouseMove={mouseMove}
        onClick={onMouseClick}
      >
        <defs>
          <clipPath id="clipPath">
            <path d={dPath} />
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
              r={Math.min(2 * s, 2)}
              className="text-gray-400 fill-current"
            />
          ))}

          {polygon.children.map(({ id: refId, transMat, pts, color }, idx) => (
            <ClickablePolygon
              key={idx}
              id={`${shapeId}.${idx}.${refId}`}
              transMat={compose(tmat, transMat)}
              pts={pts}
              color={color}
              setState={setState}
              setActive={setActive}
              duplicatePolygon={duplicatePolygon}
              deletePolygon={deletePolygon}
            />
          ))}

          {clickedPoints.map(([x, y], idx) => (
            <circle cx={x} cy={y} r={2} />
          ))}

          <path
            d={dPath}
            className="text-gray-300 stroke-current stroke-2"
            fill="none"
          />
        </g>
      </svg>
    );
  },
  (prevProps, nextProps) => {
    return (
      R.equals(prevProps.polygons, nextProps.polygons) &&
      prevProps.state === nextProps.state &&
      prevProps.active === nextProps.active
    );
  }
);
