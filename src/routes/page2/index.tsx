import * as React from "react";
import { Canvas } from "./canvas";
import { Sidebar } from "./sidebar";
import { GridPoints } from "./GridPoints";
import { Polygon } from "./Polygon";
import { Boundary } from "./Boundary";
import * as R from "ramda";
import { rotate, compose, applyToPoint, Point } from "transformation-matrix";
import { KGrid } from "../../utils";
import { store } from "./store";
import { Provider } from "react-redux";

const poly1 = {
  grpId: "12",
  id: "12",
  kPts: [
    { ant: 0, bat: 0, cat: 0, dog: 0 },
    { ant: -1, bat: -1, cat: 0, dog: 4 },
    { ant: 0, bat: 0, cat: 0, dog: 2 },
    { ant: 0, bat: 0, cat: 0, dog: 4 },
  ],
};

const octagon = {
  grpId: "0",
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
  grpId: "1",
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
  grpId: string;
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

const centerPt = (kGrid: any, pts: [number, number][]) => {
  const x = pts.reduce((a, b) => a + b[0], 0) / pts.length;
  const y = pts.reduce((a, b) => a + b[1], 0) / pts.length;

  const { ant, cat } = kGrid.qTree.find(x, y);

  const [xA, yA] = kGrid.convertPt({ ant, cat, dog: 0 });

  return [xA, yA];
};
const movePolygon = R.curry((kGrid: any, pt: KPoint, polygon_: KPolygon) => {
  const polygon = R.clone(polygon_);

  const [xP, yP] = kGrid.convertPt({ ant: pt.ant, cat: pt.cat, dog: 0 });

  const pts = polygon.kPts.map((kPt) => kGrid.convertPt(kPt));
  // con
  // const anchorPt = polygon.kPts[0];
  // const [x0, y0] = kGrid.convertPt(anchorPt);
  const [x0, y0] = centerPt(kGrid, pts);

  const [xD, yD] = [xP - x0, yP - y0];

  polygon.kPts = polygon.kPts.map((kPt) => {
    const [x, y] = kGrid.convertPt(kPt);
    return kGrid.qTree.find(x + xD, y + yD);
  });

  return polygon;
});

const rotatePolygon = R.curry((kGrid: any, polygon_: KPolygon) => {
  const polygon = R.clone(polygon_);

  // const { ant, cat } = polygon.kPts[0];

  // const [x0, y0] = kGrid.convertPt({ ant, cat, dog: 0 });

  const ptsA = polygon.kPts.map((kPt) => kGrid.convertPt(kPt));
  // con
  // const anchorPt = polygon.kPts[0];
  // const [x0, y0] = kGrid.convertPt(anchorPt);
  const [x0, y0] = centerPt(kGrid, ptsA);

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
  const [grid, setGrid] = React.useState(true);
  const [polygons, setPolygons] = React.useState(() => {
    var p = localStorage.getItem("myData");

    if (p) {
      return JSON.parse(p) as KPolygon[];
    }
    return [octagon, octagon2] as KPolygon[];
  });
  const [action, setAction] = React.useState({ action: null, data: null });
  const [clickedPoints, setClickedPoints] = React.useState([]);

  const onMouseMove = (kGrid: any, pt: any) => {
    if (action.action === "MOVE") {
      const { id }: any = action.data;
      setPolygons((polygons) =>
        R.over(lensById(id), movePolygon(kGrid, pt), polygons)
      );
    }
  };

  const onMouseClick = (pt: any) => {
    if (action.action === "MOVE") {
      setAction({ action: null, data: null });
    } else if (action.action === "NEW") {
      if (pt === clickedPoints[0]) {
        const id = Math.random().toString(36).slice(2);
        setPolygons(
          (polygons) =>
            [
              ...polygons,
              {
                grpId: id,
                id,
                kPts: clickedPoints,
                color: "green",
              },
            ] as any
        );
        setClickedPoints([]);
        setAction({ action: null, data: null });
      } else {
        setClickedPoints((pts: any) => [...pts, pt] as any);
      }
    }
  };

  const onDelete = (id: string) => {
    console.log("delete", id, R.filter((d) => d.id === id, polygons).length);
    setPolygons((polygons) => R.filter((d) => d.id !== id, polygons));
  };

  const onDuplicate = (id: string) => {
    const polygon = R.clone(R.find(R.propEq("id", id), polygons)) as KPolygon;
    const newId = Math.random().toString(36).slice(2);
    polygon.id = newId;
    setPolygons((polygons) => R.append(polygon, polygons));
    setAction({ action: "MOVE", data: { id: newId } } as any);
  };

  const setColor = (grpId: string, color: string) => {
    console.log("COLOR", grpId);
    setPolygons((polygons) =>
      polygons.map((polygon) => {
        if (polygon.grpId === grpId) {
          polygon.color = color;
        }
        return polygon;
      })
    );
  };

  const onSave = () => {
    localStorage.setItem("myData", JSON.stringify(polygons));
  };

  const onRotate = (kGrid: any, id: string) => {
    setPolygons((polygons) =>
      R.over(lensById(id), rotatePolygon(kGrid), polygons)
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
              {grid && <GridPoints kGrid={kGrid} />}
              <Boundary kGrid={kGrid} />
              {polygons.map((polygon) => (
                <Polygon
                  key={polygon.id}
                  grpId={polygon.grpId}
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
                grpId="new"
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
        <Sidebar
          setAction={setAction}
          onSave={onSave}
          grid={grid}
          setGrid={setGrid}
        />
      </div>
    </div>
  );
};
