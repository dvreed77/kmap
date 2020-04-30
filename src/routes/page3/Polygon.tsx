import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
import * as R from "ramda";
import { Matrix, applyToPoints, compose, toSVG } from "transformation-matrix";
import { useHistory } from "react-router-dom";
import { NPolygon } from "./types";
import { useStoreState } from "./store";

export const Polygon = React.memo(
  ({
    id,
    shapeId,
    transMat,
  }: {
    id: string;
    shapeId: string;
    transMat: any;
  }) => {
    const polygon = useStoreState((state) =>
      state.polygons.polygons.find((d) => d.id === shapeId)
    ) as NPolygon;

    const dPath = genPathString(polygon.pts, true);

    return (
      <g transform={`${toSVG(transMat)}`}>
        <path
          d={dPath}
          stroke="black"
          fill={polygon.color}
          vectorEffect="non-scaling-stroke"
          fillOpacity={1}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {polygon.children.map(
          (
            {
              id: shapeId,
              transMat,
            }: {
              id: string;
              transMat: any;
            },
            idx: number
          ) => (
            <Polygon
              key={`${id}.${idx}`}
              id={`${id}.${idx}`}
              shapeId={shapeId}
              transMat={transMat}
            />
          )
        )}
      </g>
    );
  }
);
