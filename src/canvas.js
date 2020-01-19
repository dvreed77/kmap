import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { colors } from "./colors";
import * as R from "ramda";
import KGrid, { KPolygon, KPoint } from "./kcanvas";

// See Page 58 in Notes
const startShapes = [
  {
    pts: [
      [1, 0, 1, 0],
      [0, -1, 1, 0],
      [-1, -1, 0, 0],
      [-1, 0, -1, 0],
      [0, 1, -1, 0],
      [1, 1, 0, 0]
    ],
    color: "red"
  },
  {
    pts: [
      [-2, 2, -4, 0],
      [-2, 0, -2, 0],
      [0, 2, -2, 0]
    ],
    color: "green"
  },
  {
    pts: [
      [-1, 1, -2, 0],
      [-2, 0, -2, 0],
      [-2, -1, -1, 0],
      [-1, -1, 0, 3],
      [-1, 0, -1, 0],
      [-1, 0, -1, 5]
    ],
    color: "orange"
  }
];

const kgrid = new KGrid();

const GridLines = React.memo(({ lines }) => (
  <>
    {lines.map((line, idx) => (
      <line
        key={idx}
        x1={line[0][0]}
        y1={line[0][1]}
        x2={line[1][0]}
        y2={line[1][1]}
        stroke={"#eee"}
      />
    ))}
  </>
));

const GridPoints = React.memo(({ points, activePoint }) => (
  <>
    {points.map((pt, idx) => (
      <circle
        key={idx}
        cx={pt.x}
        cy={pt.y}
        // r={pt.idx === activeIdx ? 5 : 2}
        r={3}
        fill={pt === activePoint ? colors.highlight : "#ddd"}
      />
    ))}
  </>
));

const Shapes = React.memo(({ shapes }) => (
  <>
    {shapes.map(({ polygon, color }, idx) => (
      <path
        key={idx}
        d={polygon.draw(kgrid)}
        fill={color}
        fillOpacity={0.4}
        stroke={"black"}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    ))}
  </>
));
const Canvas = ({ gridDensity, mouseOver }) => {
  const cRef = useRef(null);
  const [activePoint, setActivePoint] = useState(null);
  const [gridPoints, setGridPoints] = useState([]);
  const [gridLines, setGridLines] = useState([]);
  const [shapes, setShapes] = useState([]);

  const mouseMove = ({ x, y }) => {
    const { x: rX, y: rY } = cRef.current.getBoundingClientRect();
    const pt = kgrid.qTree.find(x - rX, y - rY);
    if (pt && pt !== activePoint) {
      setActivePoint(pt);
      mouseOver(pt);
    }
  };

  useEffect(() => {
    const width = cRef.current.clientWidth;
    const height = cRef.current.clientHeight;

    kgrid.intitialize(width, height);

    const myShapes = startShapes.map(({ pts, color }) => ({
      color,
      polygon: new KPolygon(
        pts.map(pt =>
          KPoint({ ant: pt[0], bat: pt[1], cat: pt[2], dog: pt[3] })
        ),
        kgrid
      )
    }));

    console.log(kgrid.rotateKPoint({ ant: -2, bat: -1, cat: -1, dog: 0 }));

    for (let i = 1; i < 6; i++) {
      myShapes.push({
        color: myShapes[2].color,
        polygon: kgrid.rotateKPolygon(
          myShapes[2].polygon,
          (i * 60 * Math.PI) / 180
        )
      });
    }

    for (let i = 1; i < 3; i++) {
      myShapes.push({
        color: myShapes[1].color,
        polygon: kgrid.rotateKPolygon(
          myShapes[1].polygon,
          i * 120 * (Math.PI / 180)
        )
      });
    }

    const otherShapes = myShapes.map(shape => ({
      color: shape.color,
      polygon: kgrid.translateKPolygon(
        kgrid.rotateKPolygon(shape.polygon, 180 * (Math.PI / 180)),
        {}
      )
    }));

    setShapes(myShapes.concat(otherShapes));

    kgrid.rotateKPoint(
      {
        ant: -2,
        bat: -1,
        cat: -1,
        dog: 0
      },
      (60 * Math.PI) / 180
    );

    const { pts, lines } = kgrid.getGrid();

    setGridPoints(pts);
    setGridLines(lines);

    cRef.current.addEventListener("mousemove", mouseMove);

    return () => {
      cRef.current.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  // const setActive = (pt, idx) => {
  //   mouseOver(pt);
  //   setActiveIdx(idx);
  // };

  // console.log(gridPoints);

  // if (!kgrid) return <div></div>;

  // const polygons = Object.entries(R.groupBy(d => `${d.i}.${d.j}`)(pts)).map(
  //   ([k, v]) => {
  //     var path = d3.path();
  //     path.moveTo(v[0].x, v[0].y);
  //     for (let i = 0; i < v.length; i++) {
  //       path.lineTo(v[i].x, v[i].y);
  //     }
  //     path.closePath();

  //     return path.toString();
  //   }
  // );

  // var path = d3.path();
  // if (shape.length) {
  //   path.moveTo(shape[0][0], shape[0][1]);
  //   for (let i = 0; i < shape.length; i++) {
  //     path.lineTo(shape[i][0], shape[i][1]);
  //   }
  //   path.closePath();
  // }

  // const shapePath = path.toString();

  return (
    <div>
      <svg ref={cRef} width={800} height={500}>
        {/* {polygons.map((path, idx) => (
          <path key={idx} d={path} fill={"#eee"} fillOpacity={0.5} />
        ))} */}
        <GridLines lines={gridLines} />

        <GridPoints points={gridPoints} activePoint={activePoint} />

        <Shapes shapes={shapes} />
        {/* {pts.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={6}
            fill={"black"}
            fillOpacity="0"
            onMouseOver={() => setActive(pt, idx)}
            onMouseLeave={() => setActive(null)}
          />
        ))} */}
      </svg>
    </div>
  );
};

export default Canvas;
