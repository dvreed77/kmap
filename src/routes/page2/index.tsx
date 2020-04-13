import React, { useState } from "react";

import { Canvas } from "./canvas";
import { Sidebar } from "./sidebar";
import { GridPoints } from "./GridPoints";
import { Polygon } from "./Polygon";
import { KGrid } from "../../utils";
import { Boundary } from "./Boundary";
import * as R from "ramda";

const octagon = {
  id: "0",
  kPts: [
    [1, 0, 1, 0],
    [0, -1, 1, 0],
    [-1, -1, 0, 0],
    [-1, 0, -1, 0],
    [0, 1, -1, 0],
    [1, 1, 0, 0],
  ].map((d) => ({
    ant: d[0],
    bat: d[1],
    cat: d[2],
    dog: d[3],
  })),
  color: "red",
};

const octagon2 = {
  id: "1",
  kPts: [
    [2, 4, -2, 0],
    [1, 3, -2, 0],
    [0, 3, -3, 0],
    [0, 4, -4, 0],
    [1, 5, -4, 0],
    [2, 5, -3, 0],
  ].map((d) => ({
    ant: d[0],
    bat: d[1],
    cat: d[2],
    dog: d[3],
  })),
  color: "blue",
};

// function addPoint(pts, newPt) {}

// function deletePoint(pts, pt) {}

// function createPolygon() {}

// function deletePolygon() {}

interface KPoint {
  ant: number;
  bat: number;
  cat: number;
  dog: number;
}

interface KPolygon {
  id: string;
  kPts: KPoint[];
  color: string;
}

function lensMatching(pred: any) {
  return R.lens(R.find(pred), (newVal: any, array: any[]) => {
    const index = R.findIndex(pred, array);
    return R.update(index, newVal, array);
  });
}

const lensById = R.compose(lensMatching, R.propEq("id"));

const movePolygon = R.curry((pt: KPoint, polygon_: KPolygon) => {
  const polygon = R.clone(polygon_);
  const refPt = polygon.kPts[0];
  const dAnt = pt.ant - refPt.ant;
  const dBat = pt.bat - refPt.bat;
  const dCat = pt.cat - refPt.cat;

  polygon.kPts = polygon.kPts.map((pt: KPoint) => ({
    ...pt,
    ant: pt.ant + dAnt,
    bat: pt.bat + dBat,
    cat: pt.cat + dCat,
  }));

  return polygon;
});

export const Page2 = () => {
  const [polygons, setPolygons] = useState([octagon, octagon2]);
  const [action, setAction] = useState({ action: null, data: null });
  const [clickedPoints, setClickedPoints] = useState([]);

  const onMouseMove = (pt: any) => {
    if (action.action === "MOVE") {
      const { id }: any = action.data;
      setPolygons(R.over(lensById(id), movePolygon(pt), polygons));
    }
  };

  const onMouseClick = (pt: any) => {
    if (action.action === "MOVE") {
      setAction({ action: null, data: null });
    } else if (action.action === "NEW") {
      if (pt === clickedPoints[0]) {
        setPolygons([
          ...polygons,
          {
            id: polygons.length,
            kPts: clickedPoints,
            color: "green",
          },
        ] as any);
        setClickedPoints([]);
        setAction({ action: null, data: null });
      } else {
        setClickedPoints((pts: any) => [...pts, pt] as any);
      }
    }
  };

  const onDelete = (id: string) => {
    setPolygons(R.filter((d) => d.id !== id, polygons));
  };

  const onDuplicate = (id: string) => {
    const polygon = R.clone(R.find(R.propEq("id", id), polygons)) as KPolygon;
    const newId = polygons.length.toString();
    polygon.id = newId;
    setPolygons(R.append(polygon, polygons));
    setAction({ action: "MOVE", data: { id: newId } } as any);
  };

  const setColor = (id: string, color: string) => {
    setPolygons(
      R.over(
        lensById(id),
        (polygon_: KPolygon) => {
          const polygon = R.clone(polygon_);
          polygon.color = color;
          return polygon;
        },
        polygons
      )
    );
  };

  return (
    <div className="flex mx-auto w-full">
      <div className="w-10/12 flex items-center justify-center">
        <Canvas
          columns={15}
          rows={10}
          onMouseMove={onMouseMove}
          onMouseClick={onMouseClick}
        >
          {({ kGrid }: any) => (
            <>
              <GridPoints kGrid={kGrid} />
              <Boundary kGrid={kGrid} />
              {polygons.map((polygon) => (
                <Polygon
                  key={polygon.id}
                  id={polygon.id}
                  pts={polygon.kPts.map(({ ant, bat, cat, dog }) =>
                    kGrid.convertPt({ ant, bat, cat, dog })
                  )}
                  color={polygon.color}
                  setState={setAction}
                  closed={true}
                  onDelete={onDelete}
                  setColor={setColor}
                  onDuplicate={onDuplicate}
                />
              ))}
              <Polygon
                id="new"
                pts={clickedPoints.map(({ ant, bat, cat, dog }) =>
                  kGrid.convertPt({ ant, bat, cat, dog })
                )}
                color={"green"}
                closed={false}
                setState={() => console.log("dave")}
              />
            </>
          )}
        </Canvas>
      </div>
      <div className="w-2/12 bg-gray-500 h-12 flex items-center justify-center">
        <Sidebar setAction={setAction} />
      </div>
    </div>
  );
};
