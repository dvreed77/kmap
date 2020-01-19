import React, { useRef, useEffect, useState } from "react";
import KGrid, { KPolygon, KPolygonGroup } from "./kcanvas";
import { GridLines, GridPoints } from "./Grid";
import Shapes from "./Shapes";
import { startShapes } from "./data";
// See Page 58 in Notes

const kgrid = new KGrid();

const Canvas = ({ mouseOver }) => {
  const cRef = useRef(null);

  const [canvasDims] = useState({ width: 800, height: 500 });
  const [activePoint, setActivePoint] = useState(null);
  const [gridPoints, setGridPoints] = useState([]);
  const [gridLines, setGridLines] = useState([]);
  const [polygonGroups, setPolygonGroups] = useState([]);

  const mouseMove = ({ x, y }) => {
    const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
    const pt = kgrid.qTree.find(
      x - rX - canvasDims.width / 2,
      y - rY - canvasDims.height / 2
    );
    if (pt && pt !== activePoint) {
      setActivePoint(pt);
      mouseOver(pt);
    }
  };

  useEffect(() => {
    const width = cRef.current.clientWidth;
    const height = cRef.current.clientHeight;

    kgrid.intitialize(width, height);

    const svgNode = cRef.current;

    const polygons = startShapes.map(
      ({ kPoints, color }) =>
        new KPolygon(
          kPoints.map(kPoint => kgrid.createKPoint(kPoint)),
          color
        )
    );

    console.log("MS", polygons);

    for (let i = 1; i < 6; i++) {
      polygons.push(polygons[2].copy().rotate((i * 60 * Math.PI) / 180));
    }

    for (let i = 1; i < 3; i++) {
      polygons.push(polygons[1].copy().rotate((i * 120 * Math.PI) / 180));
    }

    const kG1 = new KPolygonGroup(polygons);

    const kG2 = kG1.copy().translate({ dBat: -1, dCat: 1 });

    kG1.rotate((60 * Math.PI) / 180).translate({ dAnt: 2, dBat: 3, dCat: -1 });

    setPolygonGroups([kG1, kG2]);

    // kgrid.rotateKPoint(
    //   {
    //     ant: -2,
    //     bat: -1,
    //     cat: -1,
    //     dog: 0
    //   },
    //   (60 * Math.PI) / 180
    // );

    const { pts, lines } = kgrid.getGrid();

    setGridPoints(pts);
    setGridLines(lines);

    svgNode.addEventListener("mousemove", mouseMove);

    return () => {
      svgNode.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div>
      <svg ref={cRef} width={canvasDims.width} height={canvasDims.height}>
        <g
          transform={`translate(${canvasDims.width / 2}, ${canvasDims.height /
            2})`}
        >
          <GridLines lines={gridLines} />
          <GridPoints points={gridPoints} activePoint={activePoint} />
          {polygonGroups.map(pG => (
            <Shapes shapes={pG.kPolygons} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
