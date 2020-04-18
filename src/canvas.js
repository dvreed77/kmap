import React, { useRef, useEffect, useState, useCallback } from "react";
import KGrid, { KPolygon, KPolygonGroup } from "./kcanvas";
import { compose } from "transformation-matrix";
import { colors } from "./colors";

// See Page 58 in Notes

// const kgrid = new KGrid();

const Canvas = ({ mouseOver }) => {
  const cRef = useRef(null);

  const [canvasDims] = useState({ width: 800, height: 500 });
  const [activePoint, setActivePoint] = useState(null);
  const [kGrid] = useState(new KGrid());
  const [polygons, setPolygons] = useState([]);
  const [clickedPoints, setClickedPoints] = useState([]);

  const mouseMove = ({ x, y }) => {
    const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
    const pt = kGrid.qTree.find(
      x - rX - canvasDims.width / 2,
      y - rY - canvasDims.height / 2
    );
    if (pt && pt !== activePoint) {
      setActivePoint(pt);
      mouseOver(pt);
    }
  };

  const mouseClick = useCallback(
    ({ x, y }) => {
      const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
      const pt = kGrid.qTree.find(
        x - rX - canvasDims.width / 2,
        y - rY - canvasDims.height / 2
      );

      setClickedPoints([...clickedPoints, pt]);
    },
    [clickedPoints]
  );

  const keyPress = ({ key }) => {
    if (key === "c") {
      setClickedPoints([]);
    }
  };

  useEffect(() => {
    const width = cRef.current.clientWidth;
    const height = cRef.current.clientHeight;

    console.log("KGRID init");
    kGrid.intitialize(width, height);

    const svgNode = cRef.current;

    const pg1 = new KPolygon(
      [
        [-5, -6, 1, 4],
        [-5, -6, 1, 2],
        [-7, -5, -2, 4],
        [-6, -4, -2, 2],
        [-4, -3, -1, 4],
        [-3, -3, 0, 2],
      ].map((p) => kGrid.createKPoint(p)),
      colors.E
    );

    const pG = new KPolygonGroup(
      [pg1],
      [
        [-5, -6, 1, 0],
        [-7, -4, -3, 0],
        [-3, -2, -1, 0],
      ].map((p) => kGrid.createKPoint(p))
    );

    const pgs = [
      new KPolygon(
        [
          [1, 1, 0, 0],
          [2, 3, -1, 0],
          [3, 2, 1, 0],
        ].map((p) => kGrid.createKPoint(p)),
        pG
      ),
    ];

    for (let i = 1; i < 6; i++) {
      pgs.push(pgs[0].copy().rotate((i * 60 * Math.PI) / 180));
    }

    setPolygons([...pgs]);

    const { pts, lines } = kGrid.getGrid();

    svgNode.addEventListener("mousemove", mouseMove);
    window.addEventListener("keypress", keyPress);

    return () => {
      svgNode.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("keypress", keyPress);
    };
  }, []);

  useEffect(() => {
    const svgNode = cRef.current;
    svgNode.addEventListener("click", mouseClick);

    return () => {
      svgNode.removeEventListener("click", mouseClick);
    };
  }, [mouseClick]);

  return (
    <div>
      {JSON.stringify(clickedPoints.map((d) => [d.ant, d.bat, d.cat, d.dog]))}
      <svg ref={cRef} width={canvasDims.width} height={canvasDims.height}>
        <g
          transform={`translate(${canvasDims.width / 2}, ${
            canvasDims.height / 2
          })`}
        >
          {/* <GridLines lines={gridLines} />
          <GridPoints points={gridPoints} activePoint={activePoint} /> */}
          {polygons.map((kPolygon, idx) => (
            <Polygon key={idx} kPolygon={kPolygon} />
          ))}
        </g>
      </svg>
    </div>
  );
};

const Polygon = React.memo(({ kPolygon, tMat }) => {
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
      <path
        d={kPolygon.pathString(tMat)}
        fill={kPolygon.color}
        fillOpacity={1}
        stroke={"black"}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    );
  }
});

export default Canvas;
