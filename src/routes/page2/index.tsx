import * as React from "react";
import { Canvas } from "./canvas";
import { Sidebar } from "./sidebar";
import { GridPoints } from "./GridPoints";
import { Polygon } from "./Polygon";
import { Boundary } from "./Boundary";
import * as R from "ramda";
import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
  Point,
} from "transformation-matrix";

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

// type Point2 = { x: number; y: number } | [number, number];

// const a = [1, 2] as Point2;

// console.log("dave", a[0]);

const rotatePolygon = R.curry((kGrid: any, polygon_: KPolygon) => {
  const polygon = R.clone(polygon_);

  const [x0, y0] = kGrid.convertPt(polygon.kPts[0]);

  console.log(polygon.kPts[0]);

  const pts = polygon.kPts.map((pt) => {
    const [x1, y1] = kGrid.convertPt(pt);

    return [x1 - x0, y1 - y0] as Point;
  });

  let matrix = compose(rotate(Math.PI / 3));

  const pts2 = pts.map((pt) => {
    const p = applyToPoint(matrix, pt) as [number, number];
    return [p[0] + x0, p[1] + y0];
  });

  const newKPoints = pts2.map((pt) => kGrid.qTree.find(pt[0], pt[1]));

  polygon.kPts = newKPoints;

  return polygon;
});

export const Page2 = () => {
  const [polygons, setPolygons] = React.useState(() => {
    var p = localStorage.getItem("myData");

    if (p) {
      return JSON.parse(p) as KPolygon[];
    }
    return [octagon, octagon2] as KPolygon[];
  });
  const [action, setAction] = React.useState({ action: null, data: null });
  const [clickedPoints, setClickedPoints] = React.useState([]);

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
            id: Math.random().toString(36).slice(2),
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
    const newId = Math.random().toString(36).slice(2);
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

  const onSave = () => {
    localStorage.setItem("myData", JSON.stringify(polygons));
  };

  const onRotate = (kGrid: any, id: string) => {
    setPolygons(R.over(lensById(id), rotatePolygon(kGrid), polygons));

    // const dAnt = pt.ant - refPt.ant;
    // const dBat = pt.bat - refPt.bat;
    // const dCat = pt.cat - refPt.cat;
    // polygon.kPts = polygon.kPts.map((pt: KPoint) => ({
    //   ...pt,
    //   ant: pt.ant + dAnt,
    //   bat: pt.bat + dBat,
    //   cat: pt.cat + dCat,
    // }));
    // return polygon;
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
                  onRotate={(id: string) => onRotate(kGrid, id)}
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
      <div className="w-2/12 flex items-center justify-center">
        <Sidebar setAction={setAction} onSave={onSave} />
      </div>
    </div>
  );
};
