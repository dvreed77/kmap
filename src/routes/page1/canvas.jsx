import React, { useRef, useEffect, useState, useCallback } from "react";
import KGrid, { KPolygon, KPolygonGroup } from "../../kcanvas";
import { GridLines, GridPoints } from "../../Grid";
import { compose } from "transformation-matrix";
import * as d3 from "d3"; // See Page 58 in Notes
import { Menu, Dropdown } from "antd";

const poly = kgrid =>
  new KPolygon(
    [
      [3, 4, -1, 0],
      [2, 4, -2, 0],
      [2, 5, -3, 0],
      [3, 6, -3, 0],
      [4, 6, -2, 0],
      [4, 5, -1, 0]
    ].map(p => kgrid.createKPoint(p)),
    "red"
  );

const poly2 = kgrid =>
  new KPolygon(
    [
      [0, -1, 1, 0],
      [-1, -1, 0, 0],
      [-1, 0, -1, 0],
      [0, 1, -1, 0],
      [1, 1, 0, 0],
      [1, 0, 1, 0]
    ].map(p => kgrid.createKPoint(p)),
    "red"
  );

const poly3 = kgrid =>
  new KPolygon(
    [
      [1, 1, 0, 0],
      [1, 2, -1, 0],
      [0, 1, -1, 0]
    ].map(p => kgrid.createKPoint(p)),
    "green"
  );

const Canvas = ({ className, onClick, drawingPoly }) => {
  const cRef = useRef(null);

  const [canvasDims, setCanvasDims] = useState({ width: 800, height: 500 });
  const [activePoint, setActivePoint] = useState(null);
  const [gridPoints, setGridPoints] = useState([]);
  const [activePolygon, setActivePolygon] = useState(null);
  const [gridLines, setGridLines] = useState([]);
  const [kGrid] = useState(new KGrid());
  const [polygons, setPolygons] = useState([]);
  const [clickedPoints, setClickedPoints] = useState([]);
  const [canvasState, setCanvasState] = useState(null);

  const mouseMove = ({ clientX: x, clientY: y }) => {
    if (activePolygon >= 0 && canvasState === "MOVE") {
      const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
      const pt = kGrid.qTree.find(
        x - rX - canvasDims.width / 2,
        y - rY - canvasDims.height / 2
      );

      console.log(pt, polygons[activePolygon]);
      if (polygons[activePolygon]) {
        const nP = polygons[activePolygon].copy().position({
          ant: pt.ant,
          bat: pt.bat,
          cat: pt.cat
        });

        console.log(
          activePolygon,
          polygons.slice(0, activePolygon),
          polygons.slice(activePolygon + 1, polygons.length)
        );

        setPolygons([
          ...polygons.slice(0, activePolygon),
          nP,
          ...polygons.slice(activePolygon + 1, polygons.length)
        ]);
      }
    }
  };

  const mouseClick = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
    const pt = kGrid.qTree.find(
      x - rX - canvasDims.width / 2,
      y - rY - canvasDims.height / 2
    );

    onClick(pt);

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

  const duplicate = () => {
    console.log("DUPL", activePolygon);
  };

  useEffect(() => {
    const width = cRef.current.parentNode.clientWidth;
    const height = cRef.current.clientHeight;

    setCanvasDims({ width, height });
  }, [cRef]);

  useEffect(() => {
    const { width, height } = canvasDims;

    kGrid.intitialize(width, height);

    const { pts, lines } = kGrid.getGrid();

    setPolygons([poly(kGrid), poly(kGrid).center()]);

    setGridPoints(pts);
    setGridLines(lines);
  }, []);

  var path = d3.path();

  const points = clickedPoints.map(d => [d.x, d.y]);

  if (points.length) {
    path.moveTo(points[0][0], points[0][1]);
    points.forEach(([x, y]) => path.lineTo(x, y));
    path.closePath();
  }

  const pString = path.toString();

  const setActive = idx => {
    console.log("ACTIVE", idx);
    setActivePolygon(idx);
  };

  console.log("DP", drawingPoly);
  if (drawingPoly) {
    console.log(drawingPoly.draw());
  }

  return (
    <div className={className}>
      <svg
        ref={cRef}
        width={canvasDims.width}
        height={canvasDims.height}
        onClick={mouseClick}
        onMouseMove={mouseMove}
      >
        <g
          transform={`translate(${canvasDims.width / 2}, ${canvasDims.height /
            2})`}
        >
          <GridLines lines={gridLines} />
          <GridPoints points={gridPoints} activePoint={activePoint} />
          {polygons.map((kPolygon, idx) => (
            <Polygon
              key={idx}
              kPolygon={kPolygon}
              setActive={() => setActive(idx)}
              setState={setCanvasState}
            />
          ))}
          {/* {drawingPoly && (
            <path
              d={drawingPoly.draw()}
              stroke="red"
              fill="red"
              opacity="0.3"
            />
          )} */}
        </g>
      </svg>
    </div>
  );
};

const Polygon = React.memo(
  ({ kPolygon, tMat, setActive: setActive2, setState }) => {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const onMouseOver = () => {
      setHover(true);
    };

    const onMouseLeave = () => {
      setHover(false);
    };

    const onMouseClick = event => {
      event.stopPropagation();
      setActive(!active);

      setActive2();
    };

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => setState("MOVE")}>
          move
        </Menu.Item>
        <Menu.Item key="2">duplicate</Menu.Item>
      </Menu>
    );

    if (kPolygon.color instanceof KPolygonGroup) {
      let tMat2;
      if (tMat) {
        tMat2 = compose([tMat, kPolygon.tMat()]);
      } else {
        tMat2 = kPolygon.tMat();
      }

      return (
        <>
          {kPolygon.color.kPolygons.map((kPolygon, idx) => (
            <Polygon key={idx} kPolygon={kPolygon} tMat={tMat2} />
          ))}
        </>
      );
    } else {
      return (
        <Dropdown overlay={menu} trigger={["contextMenu"]}>
          <path
            d={kPolygon.pathString(tMat)}
            fill={active ? "red" : hover ? "orange" : kPolygon.color}
            fillOpacity={0.4}
            stroke={"black"}
            strokeWidth={3}
            strokeLinejoin="round"
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onMouseClick}
          />
        </Dropdown>
      );
    }
  }
);

export default Canvas;
