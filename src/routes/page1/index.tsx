import * as React from "react";
import { KGrid } from "./generateGrid";
import { shapes } from "./shapes";
import { Canvas } from "./Canvas";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";
import { Sidebar } from "../page2/sidebar";

export type NPolygon = {
  id: string;
  color: string;
  pts: [number, number][];
  polys: NPolygon[];
};

export const KGridContext = React.createContext<KGrid | null>(null);

export const Page1 = () => {
  const [kGrid, setKGrid] = React.useState<KGrid | undefined>();
  const [polygons, setPolygons] = React.useState<NPolygon[]>([]);
  const [action, setAction] = React.useState({ action: null, data: null });
  const { path } = useRouteMatch();

  const onSave = () => {
    localStorage.setItem("myData", JSON.stringify(polygons));
  };

  const updatePolygon = () => {};

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

    const d: NPolygon[] = shapes.map(({ color, kPts, id }) => ({
      id,
      color,
      pts: kPts.map((kPt) => kGrid.kPtToPt0(kPt)),
      polys: [],
    }));
    setPolygons(d);

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

  console.log("Action", action, polygons);

  return (
    <KGridContext.Provider value={kGrid}>
      <div className="w-10/12 flex items-center justify-center">
        <Switch>
          <Route exact path={path}>
            <Canvas
              width={800}
              boundingPolygon={bounds}
              polygons={polygons}
              addPolygon={addPolygon}
              setAction={setAction}
              action={action}
            />
          </Route>
          <Route
            path={`${path}:id`}
            render={({ match }) => {
              const {
                params: { id },
              } = match;
              const polygon = polygons.find((d) => d.id === id);

              if (!polygon) return <div>No polygon</div>;

              return (
                <Canvas
                  width={500}
                  boundingPolygon={polygon.pts}
                  polygons={polygon.polys}
                  addPolygon={addPolygon}
                  setAction={setAction}
                  action={action}
                />
              );
            }}
          />
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
    </KGridContext.Provider>
  );
};
