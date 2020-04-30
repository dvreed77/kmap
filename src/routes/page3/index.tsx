import * as React from "react";
import { StoreProvider } from "easy-peasy";
import store from "./store";
import { Route, useRouteMatch } from "react-router-dom";
import { Canvas } from "./Canvas";

export function Page3() {
  const { path } = useRouteMatch();
  return (
    <StoreProvider store={store}>
      <div className="flex flex-row">
        <div className="w-10/12 flex items-center justify-center">
          <Route
            path={`${path}/:id?`}
            render={({ match }) => {
              const {
                params: { id },
              } = match;
              console.log(match, id);
              return <Canvas width={800} shapeId={id ? id : "shapeB"} />;
            }}
          />
        </div>
        <div className="w-2/12 flex items-center justify-center">
          {/* <Sidebar
            setState={setState}
            onSave={onSave}
            // grid={grid}
            // setGrid={setGrid}
          /> */}
        </div>
      </div>
    </StoreProvider>
  );
}
