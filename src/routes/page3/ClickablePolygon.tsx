import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
import * as R from "ramda";
import { Matrix, applyToPoints, compose, toSVG } from "transformation-matrix";
import { useHistory } from "react-router-dom";
import { NPolygon, PInstance, PMaster } from "./types";
import { useStoreState, useStoreActions } from "./store";
import { Polygon } from "./Polygon";

export const ClickablePolygon = React.memo(
  ({ id }: { id: string }) => {
    const polygonInstance = useStoreState((state) =>
      state.polygons.instances.find((d) => d.instanceId === id)
    ) as PInstance;

    const polygonMaster = useStoreState((state) =>
      state.polygons.masters.find((d) => d.id === polygonInstance.masterId)
    ) as PMaster;

    console.log("move", id);

    const history = useHistory();
    const dPath = genPathString(polygonMaster.pts, true);

    const updateState = useStoreActions((actions) => actions.updateState);

    const updateActivePolygon = useStoreActions(
      (actions) => actions.updateActivePolygon
    );

    const menu = (
      <Menu>
        <Menu.Item
          key="move"
          onClick={() => {
            console.log("move");
            updateState("MOVE");
            updateActivePolygon(id);
            // setState("MOVE");
            // setActive(id);
          }}
        >
          move
        </Menu.Item>
        <Menu.Item
          key="duplicate"
          onClick={() => {
            console.log("duplicate");
            // setActive(id);
            // duplicatePolygon(id);
          }}
        >
          duplicate
        </Menu.Item>
        <Menu.Item
          key="delete"
          onClick={() => {
            console.log("delete");
            // deletePolygon(id);
          }}
        >
          delete
        </Menu.Item>
        <Menu.Item
          key="rotate"
          onClick={() => {
            console.log("rotate");
            // rotatePolygon(id);
          }}
        >
          rotate
        </Menu.Item>
        <Menu.Item
          key="enter"
          onClick={() => {
            console.log("enter");
            history.push(`/page3/${id}`);
          }}
        >
          enter
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <g transform={`${toSVG(polygonInstance.transMat)}`}>
          <path
            d={dPath}
            stroke="black"
            fill={polygonMaster.color}
            vectorEffect="non-scaling-stroke"
            fillOpacity={1}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {/* {polygon.children.map(
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
          )} */}
        </g>
      </Dropdown>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      R.equals(prevProps.transMat, nextProps.transMat) &&
      prevProps.shapeId === nextProps.shapeId
    );
  }
);
