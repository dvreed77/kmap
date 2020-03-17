import React from "react";

export const Boundary = ({ width, height }) => {
  return (
    <rect
      className="text-gray-300 stroke-current stroke-2"
      x={`${-width / 2}`}
      y={`${-height / 2}`}
      width={width}
      height={height}
      fill="none"
    />
  );
};
