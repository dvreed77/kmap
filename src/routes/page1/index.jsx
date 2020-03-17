import React, { useState } from "react";
import * as d3 from "d3";

import Canvas from "./canvas";
import Sidebar from "./sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

const UnFinishedPolygon = function() {
  this.pts = [];

  this.addPoint = function(pt) {
    this.pts.push(pt);

    console.log(this.pts);
  };

  this.draw = function() {
    const points = this.pts.map(d => [d.x, d.y]);

    var path = d3.path();

    if (points.length) {
      path.moveTo(points[0][0], points[0][1]);
      points.forEach(([x, y]) => path.lineTo(x, y));
      path.closePath();
    }

    return path.toString();
  };

  return this;
};

// console.log("DAVE", UnFinishedPolygon, new UnFinishedPolygon());

const Page1 = () => {
  const [appState, setAppState] = useState(null);

  const [drawingPoly, setDrawingPoly] = useState(null);

  const createNew = () => {
    console.log("create new");
    setAppState("CREATE");
    setDrawingPoly(new UnFinishedPolygon());
  };

  const onClick = pt => {
    drawingPoly.addPoint(pt);
    // if (pt === clickedPoints[0]) {
    //   setPolygons([
    //     ...polygons,
    //     new KPolygon(
    //       clickedPoints.map(p => kGrid.createKPoint(p)),
    //       "blue"
    //     )
    //   ]);
    //   setClickedPoints([]);
    // } else {
    //   setClickedPoints([...clickedPoints, pt]);
    // }
  };
  return (
    <div className="flex mx-auto w-full">
      <Canvas
        className="flex-grow"
        onClick={onClick}
        drawingPoly={drawingPoly}
      />
      <div className="flex flex-column border rounded p-4">
        <FontAwesomeIcon
          className="hover:text-gray-600 active:text-gray-700"
          onClick={createNew}
          icon={faPlusSquare}
          size="4x"
        />
      </div>
    </div>
  );
};

export default Page1;
