import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../utils";
import * as R from "ramda";
import {
  Matrix,
  applyToPoints,
  compose,
  toSVG,
  translate,
  rotate,
} from "transformation-matrix";
import { useHistory } from "react-router-dom";
import { NPolygon, PInstance, PMaster } from "../types";
import { useStoreState } from "../store";

export const Polygon = React.memo(({ id }: { id: string }) => {
  const polygonInstance = useStoreState((state) =>
    state.polygons.instances.find((d) => d.instanceId === id)
  ) as PInstance;

  const polygonMaster = useStoreState((state) =>
    state.polygons.masters.find((d) => d.id === polygonInstance.masterId)
  ) as PMaster;

  // const polygon = useStoreState((state) =>
  //   state.polygons.polygons.find((d) => d.id === shapeId)
  // ) as NPolygon;

  const dPath = genPathString(polygonMaster.pts, true);

  return (
    <g
      transform={toSVG(
        compose(
          translate(...polygonInstance.translate),
          rotate(polygonInstance.rotate)
        )
      )}
    >
      <path
        d={dPath}
        stroke="black"
        fill={polygonMaster.color}
        vectorEffect="non-scaling-stroke"
        fillOpacity={1}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {polygonMaster.children.map((id: string) => (
        <Polygon key={id} id={id} />
      ))}
    </g>
  );
});
