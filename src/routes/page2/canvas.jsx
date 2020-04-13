import React, { useRef, useState } from "react";
import { KGrid } from "../../utils";
import { Boundary } from "./Boundary";

import * as R from "ramda";

export const Canvas = ({
  children,
  columns,
  rows,
  onMouseMove,
  onMouseClick
}) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [kGrid, setKGrid] = useState();
  // const [activePt, setActivePt] = useState({ ant: 0, bat: 0, cat: 0 });
  // const [clickedPoints, setClickedPoints] = useState([]);
  // const [polygons, setPolygons] = useState();
  // const [action, setAction] = useState({ action: null, data: null });

  const targetRef = useRef();
  const padding = 20;

  React.useEffect(() => {
    console.log("KGrid useeffect");
    const kGrid = new KGrid(columns, rows);
    setKGrid(kGrid);

    console.log("kgrid", kGrid, targetRef);

    const clientWidth = targetRef.current.parentElement.clientWidth;
    const { width, height } = kGrid.setWidth(clientWidth - 2 * padding);
    setDims({ width, height });
  }, [columns, rows]);

  // React.useEffect(() => {
  //   console.log("target Use effect", kGrid);
  //   const clientWidth = targetRef.current.parentElement.clientWidth;

  // const { width, height } = kGrid.setWidth(clientWidth - 2 * padding);
  // setDims({ width, height });
  // setPolygons(
  //   [octagon, octagon2].map(({ pts, color }, id) => ({
  //     id,
  //     pts: pts.map(([ant, bat, cat, dog]) =>
  //       kGrid.convertPt({ ant, bat, cat, dog })
  //     ),
  //     color
  //   }))
  // );
  // }, [targetRef]);

  const { width, height } = dims;

  // const mouseClick = ({ clientX: x, clientY: y }) => {
  //   if (action.action === "MOVE") {
  //     setAction({ action: null, data: null });
  //   } else if (action.action === "NEW") {
  //     const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

  //     const mX = x - rX - dims.width / 2 - padding;
  //     const mY = y - rY - dims.height / 2 - padding;

  //     const pt = kGrid.qTree.find(mX, mY);

  //     if (pt === clickedPoints[0]) {
  //       setPolygons(polygons => [
  //         ...polygons,
  //         {
  //           pts: clickedPoints.map(pt => [pt.ant, pt.bat, pt.cat, pt.dog]),
  //           color: "green"
  //         }
  //       ]);
  //       setClickedPoints([]);
  //     } else {
  //       setClickedPoints(pts => [...pts, pt]);
  //     }
  //   }
  // };

  const mouseMove = ({ clientX: x, clientY: y }) => {
    // const { id } = action.data;
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const cursorPt = kGrid.qTree.find(mX, mY);

    return onMouseMove(cursorPt);
  };

  const mouseClick = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const cursorPt = kGrid.qTree.find(mX, mY);

    return onMouseClick(cursorPt);
    // onMouseClick
  };

  //   if (action.action === "MOVE") {
  //     const { id } = action.data;
  //     const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

  //     const mX = x - rX - dims.width / 2 - padding;
  //     const mY = y - rY - dims.height / 2 - padding;

  //     const cursorPt = kGrid.qTree.find(mX, mY);

  //     const polygon = polygons[0];

  //     const pt0 = polygon.pts[0];
  //     const dX = cursorPt.x - pt0[0];
  //     const dY = cursorPt.y - pt0[1];

  //     const newPts = polygon.pts.map(pt => [pt[0] + dX, pt[1] + dY]);

  //     const isId = R.propEq("id");

  //     const setPoints = R.evolve({ pts: () => newPts });

  //     const toggleID = (id, data) =>
  //       R.curry(R.map(R.when(isId(id), setPoints)))(data);

  //     setPolygons(toggleID(id, polygons));
  //   }
  // };

  // const setState = action => {
  //   // console.log(id, action);
  //   setAction(action);
  // };

  // const newChildren = React.Children.toArray(children).map(child => {
  //   console.log(child);
  //   return React.cloneElement(child, { kGrid });
  // });

  // );
  return (
    <div className="w-full">
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
            {children({ kGrid })}
            {/* {newChildren} */}

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
