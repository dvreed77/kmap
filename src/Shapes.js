import React from "react";

const Shapes = React.memo(({ shapes }) => (
  <>
    {shapes.map((polygon, idx) => (
      <path
        key={idx}
        d={polygon.pathString()}
        fill={polygon.color}
        fillOpacity={0.4}
        stroke={"black"}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    ))}
  </>
));

export default Shapes;
