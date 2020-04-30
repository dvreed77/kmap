import * as React from "react";
import { genPathString, getBounds } from "../../utils";
import {
  scale,
  applyToPoints,
  applyToPoint,
  inverse,
  toSVG,
  compose,
  translate,
} from "transformation-matrix";
import { useStoreState, useStoreActions } from "./store";
import { ClickablePolygon } from "./ClickablePolygon";
import { NPolygon, PMaster } from "./types";

interface ICanvas {
  width: number;
  shapeId: string;
}

export const Canvas = React.memo(({ width, shapeId }: ICanvas) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [clickedPoints, setClickedPoints] = React.useState([]);

  const kGrid = useStoreState((state) => state.kGrid);

  const polygon = useStoreState((state) =>
    state.polygons.masters.find((d) => d.id === shapeId)
  ) as PMaster;

  console.log(polygon);

  const state = useStoreState((state) => state.state);
  const activePolygon = useStoreState((state) => state.activePolygon);
  const showGrid = useStoreState((state) => state.showGrid);

  if (!kGrid) return <div></div>;
  const updateState = useStoreActions((actions) => actions.updateState);

  const movePolygon = useStoreActions((actions) => actions.polygons.move);
  const addPolygon = useStoreActions((actions) => actions.polygons.add);

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
        const [x0, y0] = kGrid.pt0ToKPtCenter([x0e, y0e]);
        movePolygon({ id: activePolygon, position: [x0, y0] });
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
      updateState(null);
      // setState(null);
    } else if (state === "NEW") {
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
        const [x, y] = applyToPoint(tmat, [x0, y0]);
        console.log(clickedPoints);
        if (clickedPoints.length) {
          const [x0, y0] = clickedPoints[0];
          const d = Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2));
          if (d < 3) {
            console.log("Adding");

            const {
              center: [cX, cY],
            } = getBounds(clickedPoints);
            const [cX0, cY0] = applyToPoint(inverse(tmat), [cX, cY]);
            const [aX0, aY0] = kGrid.pt0ToKPtCenter([cX0, cY0]);
            // const [aX, aY] = applyToPoint(tmat, [aX0, aY0]);

            // console.log("ANCHOR", aX, aY);

            updateState(null);
            setClickedPoints([]);
            addPolygon({
              parentId: shapeId,
              pts: applyToPoints(inverse(tmat), clickedPoints),
              anchorPt: [aX0, aY0],
            });
            // addPolygon(shapeId, applyToPoints(inverse(tmat), clickedPoints));
          } else {
            setClickedPoints((pts: any) => [...pts, [x, y]] as any);
          }
        } else {
          setClickedPoints((pts: any) => [...pts, [x, y]] as any);
        }
      }
    }
  };

  const { width: bWidth, height: bHeight, center } = getBounds(polygon.pts);

  const padding = 10;
  const { width: gridWidth, height: gridHeight, pts } = kGrid;

  const s = width / bWidth;
  const height = s * bHeight;

  const tmat = compose(scale(s), translate(-center[0], -center[1]));
  const pts2 = applyToPoints(tmat, pts);
  const bounds2 = applyToPoints(tmat, polygon.pts) as [number, number][];

  console.log(bWidth, bHeight, toSVG(tmat));

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
        transform={`translate(${padding + width / 2}, ${padding + height / 2})`}
        clipPath="url(#clipPath)"
      >
        <g transform={`${toSVG(tmat)}`}>
          {polygon.children.map((id, idx) => (
            <ClickablePolygon key={id} parentId={shapeId} id={id} />
          ))}
        </g>

        {showGrid &&
          pts2.map(([x, y], idx) => (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={Math.min(2 * s, 2)}
              className="text-gray-400 fill-current"
              pointerEvents="none"
            />
          ))}

        {clickedPoints.map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r={5} fill="red" />
        ))}

        <path
          d={dPath}
          className="text-gray-300 stroke-current stroke-2"
          fill="none"
        />
      </g>
    </svg>
  );
});
