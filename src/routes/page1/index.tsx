import * as React from "react";
import { KGrid } from "./generateGrid";
import { shapes } from "./shapes";
import { Canvas } from "./Canvas";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";
import { Sidebar } from "../page2/sidebar";
import { identity, rotate, Matrix } from "transformation-matrix";
import { NPolygon, KPolygon, IAppContext, KPoint } from "./types";
import * as R from "ramda";
import { movePolygon as movePolygon2 } from "./operations/move";
import { rotatePolygon as rotatePolygon2 } from "./operations/rotate";

export const AppContext = React.createContext<IAppContext>({
  kGrid: new KGrid({ cols: 12, rows: 10 }),
  polygons: [],
  addPolygon: () => console.log("addPolygon"),
  deletePolygon: () => console.log("deletePolygon"),
  movePolygon: () => console.log("movePolygon"),
  rotatePolygon: () => console.log("rotatePolygon"),
  duplicatePolygon: () => console.log("duplicatePolygon"),
  active: undefined,
  setActive: () => console.log("setActive"),
  state: undefined,
  setState: () => console.log("setState"),
});

export const Page1 = () => {
  const [kGrid, setKGrid] = React.useState<KGrid | undefined>();
  const [polygons, setPolygons] = React.useState<NPolygon[]>([]);
  const [action, setAction] = React.useState({ action: null, data: null });
  const [state, setState] = React.useState<String | null>();
  const [active, setActive] = React.useState<String | null>();
  const { path } = useRouteMatch();

  const onSave = () => {
    localStorage.setItem("myData", JSON.stringify(polygons));
  };

  const addPolygon = (polygon: NPolygon) => {
    console.log("adding", polygon);

    setPolygons((polygons) => {
      // polygons.forEach((p) => {
      //   if (p.id === "0") {
      //     p.polys.push(polygon);
      //   }
      // });

      polygons.push(polygon);

      return polygons;
    });
  };

  React.useEffect(() => {
    const kGrid = new KGrid({ cols: 12, rows: 10 });
    setKGrid(kGrid);

    console.log(shapes);

    const polygons: NPolygon[] = (shapes as KPolygon[]).map(
      ({ id, color, kPts, children }: KPolygon) => ({
        id,
        color,
        pts: kPts.map((pt: KPoint) => kGrid.kPtToPt0(pt)),
        children,
      })
    );

    setPolygons(polygons);

    // );
  }, []);

  if (!kGrid) {
    return <div></div>;
  }

  const { width, height } = kGrid;

  const bounds: [number, number][] = [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
  ];

  function lensMatching(pred: any) {
    return R.lens(R.find(pred), (newVal: any, array: any[]) => {
      const index = R.findIndex(pred, array);
      return R.update(index, newVal, array);
    });
  }

  const lensById = R.compose(lensMatching, R.propEq("id"));

  const movePolygon = (pt: any) => {
    if (active) {
      const path = active.split(".");
      const shapeId = path[0];
      const childPath = path[1];
      const polygonLens = R.compose(
        lensById(shapeId),
        R.lensPath(["children", parseInt(childPath)])
      ) as R.Lens;

      setPolygons((polygons) =>
        R.over(polygonLens, movePolygon2(pt), polygons)
      );
    }
  };

  const rotatePolygon = (id: string) => {
    const polygonLens = R.compose(
      lensById("shapeB"),
      R.lensPath(["children", 0])
    ) as R.Lens;

    setPolygons(R.over(polygonLens, rotatePolygon2, polygons));
  };

  const duplicatePolygon = (id: string) => {
    const path = id.split(".");
    const shapeId = path[0];
    const childPath = parseInt(path[1]);
    const newPath = parseInt(path[1]) + 1;
    const polygonLens = R.compose(
      lensById(shapeId),
      R.lensPath(["children", childPath])
    ) as R.Lens;

    const polygon = R.clone(R.view(polygonLens, polygons));

    const polygonLens2 = R.compose(
      lensById(shapeId),
      R.lensProp("children")
    ) as R.Lens;

    setPolygons((polygons) =>
      R.over(polygonLens2, R.insert(newPath, polygon), polygons)
    );

    setActive(`${shapeId}.${newPath}`);
    setState("MOVE");
  };

  const deletePolygon = (id: string) => {
    const path = id.split(".");
    const shapeId = path[0];
    const childPath = parseInt(path[1]);

    const polygonLens = R.compose(
      lensById(shapeId),
      R.lensProp("children")
    ) as R.Lens;

    setPolygons((polygons) =>
      R.over(polygonLens, R.remove(childPath, 1), polygons)
    );
  };

  return (
    <div className="flex flex-row">
      <div className="w-10/12 flex items-center justify-center">
        <Switch>
          <Route exact path={path}>
            <Canvas
              width={800}
              shapeId={"shapeB"}
              polygons={polygons}
              kGrid={kGrid}
              state={state}
              setState={setState}
              active={active}
              setActive={setActive}
              movePolygon={movePolygon}
              duplicatePolygon={duplicatePolygon}
              deletePolygon={deletePolygon}
            />
          </Route>
          {/* <Route
            path={`${path}:id`}
            render={({ match }) => {
              const {
                params: { id },
              } = match;
              const polygon = polygons.find((d) => d.id === id);

              if (!polygon) return <div>No polygon</div>;

              return <Canvas width={800} shapeId={id} />;
            }}
          /> */}
        </Switch>
      </div>
      <div className="w-2/12 flex items-center justify-center">
        <Sidebar
          setAction={setAction}
          onSave={onSave}
          // grid={grid}
          // setGrid={setGrid}
        />
      </div>
    </div>
  );
};
