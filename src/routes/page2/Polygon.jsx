import React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";

export const Polygon = React.memo(({ id, pts, color, closed, setState }) => {
  const dPath = genPathString(pts, closed);
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setState(id, "MOVE")}>
        move
      </Menu.Item>
      <Menu.Item key="2">duplicate</Menu.Item>
    </Menu>
  );

  return (
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
  );
});
