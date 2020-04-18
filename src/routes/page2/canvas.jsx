import React, { useRef, useState } from "react";
import { KGrid } from "../../utils";

export const Canvas = ({
  children,
  columns,
  rows,
  onMouseMove,
  onMouseClick,
}) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [kGrid, setKGrid] = useState();

  const targetRef = useRef();
  const padding = 20;

  React.useEffect(() => {
    const kGrid = new KGrid(columns, rows);
    setKGrid(kGrid);

    const clientWidth = targetRef.current.parentElement.clientWidth;
    const { width, height } = kGrid.setWidth(clientWidth - 2 * padding);
    setDims({ width, height });
  }, [columns, rows]);

  const { width, height } = dims;

  const mouseMove = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const cursorPt = kGrid.qTree.find(mX, mY);

    return onMouseMove(cursorPt);
  };

  const mouseClick = ({ clientX: x, clientY: y }) => {
    const { x: rX, y: rY } = targetRef.current.getBoundingClientRect();

    const mX = x - rX - dims.width / 2 - padding;
    const mY = y - rY - dims.height / 2 - padding;

    const cursorPt = kGrid.qTree.find(mX, mY);

    return onMouseClick(cursorPt);
    // onMouseClick
  };

  return (
    <div className="w-full">
      <svg
        ref={targetRef}
        width={width + 2 * padding}
        height={height + 2 * padding}
        onMouseMove={mouseMove}
        onClick={mouseClick}
      >
        {width && (
          <g
            transform={`translate(${padding + width / 2}, ${
              padding + height / 2
            })`}
          >
            {children({ kGrid })}
          </g>
        )}
      </svg>
    </div>
  );
};
