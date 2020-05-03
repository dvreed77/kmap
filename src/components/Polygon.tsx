import * as React from "react";
import { genPathString } from "../utils";
import { compose, toSVG, translate, rotate } from "transformation-matrix";
import { PInstance, PMaster } from "../types";
import { useStoreState } from "../store";
import { genHatchLines } from "../utils/hatchfill/genHatchLines";

export const Polygon = React.memo(({ id }: { id: string }) => {
  const polygonInstance = useStoreState((state) =>
    state.polygons.instances.find((d) => d.instanceId === id)
  ) as PInstance;

  const polygonMaster = useStoreState((state) =>
    state.polygons.masters.find((d) => d.id === polygonInstance.masterId)
  ) as PMaster;

  const dPath = genPathString(polygonMaster.pts, true);

  const hatchlines = genHatchLines(
    polygonMaster.pts,
    2 * Math.PI * Math.random(),
    1
  );

  // console.log(hatchlines);

  const [rx, ry] = polygonInstance.rotationAnchor
    ? polygonInstance.rotationAnchor
    : [0, 0];

  return (
    <g
      transform={toSVG(
        compose(
          rotate(polygonInstance.rotate, rx, ry),
          translate(...polygonInstance.translate)
        )
      )}
    >
      {/* {hatchlines.map(([pt0, pt1], idx) => (
        <line
          key={idx}
          x1={pt0[0]}
          y1={pt0[1]}
          x2={pt1[0]}
          y2={pt1[1]}
          stroke={polygonMaster.color}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      ))} */}
      <path
        d={dPath}
        stroke="black"
        fill={polygonMaster.color}
        // fill={"none"}
        vectorEffect="non-scaling-stroke"
        fillOpacity={1}
        strokeWidth={3}
        strokeLinejoin="round"
        pointerEvents="none"
      />
      {polygonMaster.children.map((id: string) => (
        <Polygon key={id} id={id} />
      ))}
    </g>
  );
});
