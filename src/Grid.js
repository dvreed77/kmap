import React from "react";
import { colors } from "./colors";

export const GridLines = React.memo(({ lines }) => (
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

export const GridPoints = React.memo(({ points, activePoint }) => (
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
