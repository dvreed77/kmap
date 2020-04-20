import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
// import { colors } from "../../colors";
import * as R from "ramda";
import { Matrix, applyToPoints } from "transformation-matrix";

interface PolygonProps {
  // grpId: any;
  id: any;
  pts: any;
  color: any;
  tmat: Matrix;
  // closed: any;
  // setState: any;
  // onDelete?: any;
  // setColor?: any;
  // onDuplicate?: any;
  // onRotate?: any;
}

const colors = {
  base: "#F2FBFD",
  dark: "#002C3E",
  a1: "#049DD9",
  a2: "#04B2D9",
  highlight: "#F20544",
  highlight_dull: "#FB93AF",
  A: "#F2528D",
  B: "#1C418C",
  C: "#F2B705",
  D: "#F29F05",
  E: "#F2C2C2",
};

export const Polygon = React.memo<PolygonProps>(
  ({
    // grpId,
    id,
    pts,
    color,
    tmat,
    // closed,
    // setState,
    // onDelete,
    // setColor,
    // onDuplicate,
    // onRotate,
  }) => {
    const dPath = genPathString(
      applyToPoints(tmat, pts) as [number, number][],
      true
    );
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          // onClick={
          // () =>
          // setState({
          //   action: "MOVE",
          //   data: { id },
          // })
          // }
        >
          move
        </Menu.Item>
        <Menu.Item
          key="2"
          // onClick={() => onDuplicate(id)}
        >
          duplicate
        </Menu.Item>
        <Menu.Item
          key="3"
          // onClick={() => onDelete(id)}
        >
          delete
        </Menu.Item>
        <Menu.SubMenu title="color">
          <div className="flex flex-row flex-wrap" style={{ width: 100 }}>
            {R.values(colors).map((v) => (
              <div
                key={v}
                style={{ backgroundColor: v, width: 20, height: 20 }}
                // onClick={() => setColor(grpId, v)}
              />
            ))}
          </div>
        </Menu.SubMenu>
        <Menu.Item
          key="rotate"
          // onClick={() => onRotate(id)}
        >
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
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      R.equals(prevProps.pts, nextProps.pts) &&
      prevProps.color === nextProps.color
    );
  }
);
