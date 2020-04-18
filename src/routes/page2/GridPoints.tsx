import React from "react";

interface GridPointsProps {
  kGrid: any;
}

export const GridPoints = React.memo<GridPointsProps>(({ kGrid }) => {
  const nPts = React.useMemo(() => kGrid.generateGrid(), [kGrid]);

  return (
    <>
      {nPts.map(({ idx, x, y }: any) => {
        return (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r={2}
            className="text-gray-400 fill-current"
          />
        );
      })}
    </>
  );
});
