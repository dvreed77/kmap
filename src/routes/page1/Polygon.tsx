import * as React from "react";
import { Menu, Dropdown } from "antd";
import { genPathString } from "../../utils";
import * as R from "ramda";
import { Matrix, applyToPoints, compose, toSVG } from "transformation-matrix";
import { useHistory } from "react-router-dom";
import { AppContext } from ".";
import { NPolygon } from "./types";

interface PolygonProps {
  refId: string;
  id: string;
  transMat: Matrix;
  isClickable: boolean;
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

export const ClickablePolygon = React.memo(
  ({
    id,
    transMat,
    pts,
    color,
    setState,
    setActive,
    duplicatePolygon,
    deletePolygon,
  }: {
    id: string;
    transMat: Matrix;
    pts: Point[];
    color: string;
    setState: any;
    setActive: any;
    duplicatePolygon: any;
    deletePolygon: any;
  }) => {
    // console.log("render polygon", id, pts);
    const dPath = genPathString(pts, true);

    const menu = (
      <Menu>
        <Menu.Item
          key="move"
          onClick={() => {
            setState("MOVE");
            setActive(id);
          }}
        >
          move
        </Menu.Item>
        <Menu.Item
          key="duplicate"
          onClick={() => {
            setActive(id);
            duplicatePolygon(id);
          }}
        >
          duplicate
        </Menu.Item>
        <Menu.Item
          key="delete"
          onClick={() => {
            deletePolygon(id);
          }}
        >
          delete
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <g transform={`${toSVG(transMat)}`}>
          <path
            d={dPath}
            stroke="black"
            fill={color}
            vectorEffect="non-scaling-stroke"
            fillOpacity={1}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
      </Dropdown>
    );
  },
  (prevProps, nextProps) => {
    return (
      R.equals(prevProps.transMat, nextProps.transMat) &&
      R.equals(prevProps.pts, nextProps.pts) &&
      prevProps.color === nextProps.color
    );
  }
);

export const Polygon = React.memo<PolygonProps>(
  ({ refId, id, transMat, isClickable }) => {
    const {
      polygons,
      deletePolygon,
      rotatePolygon,
      setState,
      setActive,
    } = React.useContext(AppContext);

    const polygon = polygons.find((d: NPolygon) => d.id === refId) as NPolygon;

    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => {
            setState("MOVE");
            setActive(id);
          }}
        >
          move
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            deletePolygon();
          }}
        >
          duplicate
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            deletePolygon();
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
                // onClick={() => setColor(grpId, v)}
              />
            ))}
          </div>
        </Menu.SubMenu>
        <Menu.Item key="rotate" onClick={() => rotatePolygon(id)}>
          rotate
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        {polygon.pts && (
          <PolygonBoundary
            pts={polygon.pts}
            color={polygon.color}
            transMat={transMat}
          />
        )}
        {polygon.children.map(({ id: refId, transMat: t2 }, idx) => (
          <Polygon
            key={idx}
            refId={refId}
            id={`${id}.${refId}.${idx}`}
            transMat={compose(transMat, t2)}
            isClickable={false}
          />
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    // console.log(R.equals(prevProps.refId, nextProps.refId));
    // console.log(R.equals(prevProps.transMat, nextProps.transMat));
    return (
      R.equals(prevProps.transMat, nextProps.transMat) &&
      prevProps.refId === nextProps.refId &&
      prevProps.id === nextProps.id
    );
  }
);
