import React from "react";
import { isOdd } from "../../utils";

interface GridPointsProps {
  kGrid: any;
}

export const GridPoints = React.memo<GridPointsProps>(({ kGrid }) => {
  // console.log("GridPoints", kGrid, activePt);
  const nPts = React.useMemo(() => kGrid.generateGrid(), [kGrid]);

  // const newI = isOdd(activePt.cat)
  //   ? activePt.ant - (activePt.cat + 1) / 2
  //   : activePt.ant + activePt.cat / 2;

  // console.log(
  //   [activePt.ant, activePt.bat, activePt.cat, activePt.dog],
  //   [activePt.i, activePt.j],
  //   [newI, activePt.cat]
  // );
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
      {/* <circle cx={activePt.x} cy={activePt.y} r="3" fill="black" /> */}
    </>
  );
});
