import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { colors } from "./colors";
import * as R from "ramda";
import KGrid, { KPolygon } from "./kcanvas";

const Canvas = ({ gridDensity, mouseOver }) => {
  const cRef = useRef();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [points, setPoints] = useState([]);
  const [kgrid, setKGrid] = useState(null);

  const [shape, setShape] = useState([]);
  const [activeIdx, setActiveIdx] = useState(null);

  // See Page 58 in Notes
  const shapes = [
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
        [-2, -2, 0, 0],
        [-2, -4, 2, 0],
        [0, -2, 2, 0]
      ],
      color: "green"
    },
    {
      pts: [
        [2, 2, 0, 0],
        [2, 0, 2, 0],
        [4, 2, 2, 0]
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
    },
    {
      pts: [
        [1, 2, -1, 0],
        [0, 2, -2, 0],
        [-1, 1, -2, 0],
        [-1, 0, -1, 5],
        [0, 1, -1, 0],
        [1, 1, 0, 1]
      ],
      color: "orange"
    }
  ].map(shape => ({
    color: shape.color,
    polygon: new KPolygon(shape.pts)
  }));

  useEffect(() => {
    const kgrid = new KGrid(width, height);

    setKGrid(kgrid);

    console.log(shapes[4]);
    const pt1 = shapes[4].polygon.pts[0];

    console.log(pt1);

    kgrid.rotateKPoint(
      {
        ant: pt1[0],
        bat: pt1[1],
        cat: pt1[2],
        dog: pt1[3]
      },
      -Math.PI / 4
    );
    const shape = [
      [1, 0, 1, 0],
      [0, -1, 1, 0],
      [-1, -1, 0, 0],
      [-1, 0, -1, 0],
      [0, 1, -1, 0],
      [1, 1, 0, 0]
    ];

    const pts = [];
    for (let kPt of shape) {
      pts.push(
        kgrid.convertHexPointToCanvasPoint({
          ant: kPt[0],
          bat: kPt[1],
          cat: kPt[2],
          dog: kPt[3]
        })
      );
    }
    setShape(pts);
  }, []);

  const setActive = (pt, idx) => {
    mouseOver(pt);
    setActiveIdx(idx);
  };

  if (!kgrid) return <div></div>;

  const { pts, lines } = kgrid.genGrid(gridDensity);

  const polygons = Object.entries(R.groupBy(d => `${d.i}.${d.j}`)(pts)).map(
    ([k, v]) => {
      var path = d3.path();
      path.moveTo(v[0].x, v[0].y);
      for (let i = 0; i < v.length; i++) {
        path.lineTo(v[i].x, v[i].y);
      }
      path.closePath();

      return path.toString();
    }
  );

  var path = d3.path();
  if (shape.length) {
    path.moveTo(shape[0][0], shape[0][1]);
    for (let i = 0; i < shape.length; i++) {
      path.lineTo(shape[i][0], shape[i][1]);
    }
    path.closePath();
  }

  const shapePath = path.toString();

  return (
    <div>
      <svg ref={cRef} width={width} height={height}>
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
        {polygons.map((path, idx) => (
          <path key={idx} d={path} fill={"#eee"} fillOpacity={0.5} />
        ))}
        {pts.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={idx === activeIdx ? 5 : 2}
            fill={idx === activeIdx ? colors.highlight : "#ddd"}
          />
        ))}

        {shapes.map(({ polygon, color }, idx) => (
          <path
            key={idx}
            d={polygon.draw(kgrid)}
            fill={color}
            fillOpacity={0.4}
            stroke={"black"}
            strokeWidth={3}
          />
        ))}
        {pts.map((pt, idx) => (
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
        ))}
      </svg>
    </div>
  );
};

export default Canvas;
