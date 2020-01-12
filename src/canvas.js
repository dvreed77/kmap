import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { colors } from "./colors";
import * as R from "ramda";
import KGrid from "./kcanvas";

const Canvas = ({ mouseOver }) => {
  const cRef = useRef();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [points, setPoints] = useState([]);
  const [kgrid, setKGrid] = useState(null);

  const [shape, setShape] = useState([]);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const kgrid = new KGrid(width, height);

    setKGrid(kgrid);

    const shape = [
      { ant: 0, bat: 0, cat: 0, dog: 0 },
      { ant: -1, bat: -1, cat: 0, dog: 0 },
      { ant: -1, bat: 0, cat: -1, dog: 0 }
    ];

    const pts = [];
    for (let kPt of shape) {
      pts.push(kgrid.convertHexPointToCanvasPoint(kPt));
    }
    setShape(pts);

    setPoints(kgrid.grid);
  }, []);

  const setActive = idx => {
    mouseOver(points[idx]);
    setActiveIdx(idx);
  };

  const polygons = Object.entries(R.groupBy(d => `${d.i}.${d.j}`)(points)).map(
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
        {kgrid &&
          kgrid.gridLines.map((line, idx) => (
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
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={idx === activeIdx ? 5 : 2}
            fill={idx === activeIdx ? colors.highlight : "#ddd"}
          />
        ))}
        <path d={shapePath} fill={"green"} fillOpacity={0.4} />
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={6}
            fill={"black"}
            fillOpacity="0"
            onMouseOver={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>
    </div>
  );
};

export default Canvas;
