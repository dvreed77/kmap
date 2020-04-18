import React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
import { colors } from "../../colors";
import * as R from "ramda";
interface PolygonProps {
  id: any;
  pts: any;
  color: any;
  closed: any;
  setState: any;
  onDelete?: any;
  setColor?: any;
  onDuplicate?: any;
  onRotate?: any;
}

export const Polygon = React.memo<PolygonProps>(
  ({
    id,
    pts,
    color,
    closed,
    setState,
    onDelete,
    setColor,
    onDuplicate,
    onRotate,
  }) => {
    const dPath = genPathString(pts, closed);

    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() =>
            setState({
              action: "MOVE",
              data: { id },
            })
          }
        >
          move
        </Menu.Item>
        <Menu.Item key="2" onClick={() => onDuplicate(id)}>
          duplicate
        </Menu.Item>
        <Menu.Item key="3" onClick={() => onDelete(id)}>
          delete
        </Menu.Item>
        <Menu.SubMenu title="color">
          <div className="flex flex-row flex-wrap" style={{ width: 100 }}>
            {R.values(colors).map((v) => (
              <div
                key={v}
                style={{ backgroundColor: v, width: 20, height: 20 }}
                onClick={() => setColor(id, v)}
              />
            ))}
          </div>
        </Menu.SubMenu>
        <Menu.Item key="rotate" onClick={() => onRotate(id)}>
          rotate
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Dropdown overlay={menu} trigger={["contextMenu"]}>
          <path
            d={dPath}
            stroke="black"
            fill={color}
            fillOpacity={1}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </Dropdown>
        {closed ||
          pts.map((pt: any, idx: number) => (
            <circle key={idx} cx={pt[0]} cy={pt[1]} r={3} />
          ))}
      </>
    );
  }
);
