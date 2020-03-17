import React, { useRef, useState } from "react";
import { KGrid } from "../../utils";
import { Boundary } from "./Boundary";
import { GridPoints } from "./GridPoints";
import { Polygon } from "./Polygon";
const kGrid = new KGrid(15, 10);

const octagon = {
  pts: [
    [1, 0, 1, 0],
    [0, -1, 1, 0],
    [-1, -1, 0, 0],
    [-1, 0, -1, 0],
    [0, 1, -1, 0],
    [1, 1, 0, 0]
  ],
  color: "red"
};

const octagon2 = {
  pts: [
    [2, 4, -2, 0],
    [1, 3, -2, 0],
    [0, 3, -3, 0],
    [0, 4, -4, 0],
    [1, 5, -4, 0],
    [2, 5, -3, 0]
  ],
  color: "blue"
};

export const Canvas = ({ className, onClick, drawingPoly }) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [activePt, setActivePt] = useState({ ant: 0, bat: 0, cat: 0 });
  const [clickedPoints, setClickedPoints] = useState([]);
  const [polygons, setPolygons] = useState();

  const targetRef = useRef();
  const padding = 20;
  React.useEffect(() => {
    const clientWidth = targetRef.current.parentElement.clientWidth;

    const { width, height } = kGrid.setWidth(clientWidth - 2 * padding);
    setDims({ width, height });
    setPolygons(
      [octagon, octagon2].map(({ pts, color }, id) => ({
        id,
        pts: pts.map(([ant, bat, cat, dog]) =>
          kGrid.convertPt({ ant, bat, cat, dog })
        ),
        color
      }))
    );
  }, [targetRef]);

  const { width, height } = dims;

  const mouseClick = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const pt = kGrid.qTree.find(mX, mY);

    // onClick(pt);

    if (pt === clickedPoints[0]) {
      setPolygons(polygons => [
        ...polygons,
        {
          pts: clickedPoints.map(pt => [pt.ant, pt.bat, pt.cat, pt.dog]),
          color: "green"
        }
      ]);
      setClickedPoints([]);
    } else {
      setClickedPoints(pts => [...pts, pt]);
    }
  };

  const mouseMove = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const pt = kGrid.qTree.find(mX, mY);

    // console.log(mX, mY, pt);

    setActivePt(pt);
  };

  return (
    <div className="w-full">
      {/* {JSON.stringify([activePt.ant, activePt.bat, activePt.cat, activePt.dog])}
      {JSON.stringify(clickedPoints)} */}
      <svg
        ref={targetRef}
        width={width + 2 * padding}
        height={height + 2 * padding}
        onMouseMove={mouseMove}
        onClick={mouseClick}
      >
        {width && (
          <g
            transform={`translate(${padding + width / 2}, ${padding +
              height / 2})`}
          >
            <GridPoints kGrid={kGrid} activePt={activePt} />
            <Boundary width={width} height={height} />
            {polygons.map(polygon => (
              <Polygon
                key={polygon.id}
                id={polygon.id}
                pts={polygon.pts}
                color={polygon.color}
              />
            ))}
            {/* <Polygon
              pts={clickedPoints.map(pt => [pt.ant, pt.bat, pt.cat, pt.dog])}
              color={"green"}
              kGrid={kGrid}
              closed={false}
              anchor={{ ant: 0, bat: 0, cat: 0 }}
            /> */}
          </g>
        )}
      </svg>
    </div>
  );
};
