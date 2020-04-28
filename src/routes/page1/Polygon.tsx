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
    rotatePolygon,
    children,
  }: {
    id: string;
    transMat: Matrix;
    pts: Point[];
    color: string;
    setState: any;
    setActive: any;
    duplicatePolygon: any;
    deletePolygon: any;
    rotatePolygon: any;
    children: any;
  }) => {
    const history = useHistory();
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
        <Menu.Item
          key="rotate"
          onClick={() => {
            rotatePolygon(id);
          }}
        >
          rotate
        </Menu.Item>
        <Menu.Item
          key="enter"
          onClick={() => {
            console.log("id", id);
            history.push(`/page1/shape5`);
          }}
        >
          enter
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

          {children.map(
            (
              {
                transMat,
                pts,
                color,
                children,
              }: {
                transMat: any;
                pts: any;
                color: any;
                children: any;
              },
              idx: number
            ) => (
              <Polygon
                key={idx}
                transMat={transMat}
                pts={pts}
                color={color}
                children={children}
              />
            )
          )}
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

export const Polygon = React.memo(
  ({
    transMat,
    pts,
    color,
    children,
  }: {
    transMat: any;
    pts: any;
    color: any;
    children: any;
  }) => {
    const dPath = genPathString(pts, true);

    return (
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
        {children.map(
          (
            {
              transMat,
              pts,
              color,
              children,
            }: {
              transMat: any;
              pts: any;
              color: any;
              children: any;
            },
            idx: number
          ) => (
            <Polygon
              key={idx}
              transMat={transMat}
              pts={pts}
              color={color}
              children={children}
            />
          )
        )}
      </g>
    );
  },
  (prevProps, nextProps) => {
    return (
      R.equals(prevProps.transMat, nextProps.transMat) &&
      prevProps.pts === nextProps.pts
    );
  }
);
