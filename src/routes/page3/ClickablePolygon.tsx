import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
import * as R from "ramda";
import { Matrix, applyToPoints, compose, toSVG } from "transformation-matrix";
import { useHistory } from "react-router-dom";
import { NPolygon, PInstance, PMaster } from "./types";
import { useStoreState, useStoreActions } from "./store";
import { Polygon } from "./Polygon";
import { colors } from "../../utils/colors";

export const ClickablePolygon = React.memo(
  ({ parentId, id }: { parentId: string; id: string }) => {
    const polygonInstance = useStoreState((state) =>
      state.polygons.instances.find((d) => d.instanceId === id)
    ) as PInstance;

    const polygonMaster = useStoreState((state) =>
      state.polygons.masters.find((d) => d.id === polygonInstance.masterId)
    ) as PMaster;

    const history = useHistory();
    const dPath = genPathString(polygonMaster.pts, true);

    const updateState = useStoreActions((actions) => actions.updateState);

    const updateActivePolygon = useStoreActions(
      (actions) => actions.updateActivePolygon
    );

    const duplicatePolygon = useStoreActions(
      (actions) => actions.polygons.duplicate
    );

    const deletePolygon = useStoreActions((actions) => actions.polygons.delete);

    const setColor = useStoreActions((actions) => actions.polygons.setColor);

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
            const newInstanceId = Math.random().toString(36).slice(2);
            duplicatePolygon({
              parentId,
              instanceId: id,
              newInstanceId,
            });
            updateState("MOVE");
            updateActivePolygon(newInstanceId);
            // setActive(id);
            // duplicatePolygon(id);
          }}
        >
          duplicate
        </Menu.Item>
        <Menu.Item
          key="delete"
          onClick={() => {
            deletePolygon({ parentId, instanceId: id });
          }}
        >
          delete
        </Menu.Item>
        <Menu.SubMenu title="color">
          <div className="flex flex-row flex-wrap" style={{ width: 100 }}>
            {R.values(colors).map((v) => (
              <div
                key={v}
                style={{ backgroundColor: v, width: 20, height: 20 }}
                onClick={() =>
                  setColor({ parentId: polygonMaster.id, color: v })
                }
              />
            ))}
          </div>
        </Menu.SubMenu>
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
            history.push(`/page3/${polygonInstance.masterId}`);
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
          {polygonMaster.children.map((id: string) => (
            <Polygon key={id} id={id} />
          ))}
        </g>
      </Dropdown>
    );
  }
);
