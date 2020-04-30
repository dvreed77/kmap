import * as React from "react";
import { StoreProvider } from "easy-peasy";
import store from "./store";
import { Route, useRouteMatch } from "react-router-dom";
import { Canvas } from "./Canvas";
import { Sidebar } from "./Sidebar";

export function Page3() {
  const { path } = useRouteMatch();
  return (
    <StoreProvider store={store}>
      <div className="flex flex-row w-full">
        <div className="flex flex-grow items-center justify-center">
          <Route
            path={`${path}/:id?`}
            render={({ match }) => {
              const {
                params: { id },
              } = match;
              console.log(match, id);
              return <Canvas width={1000} shapeId={id ? id : "shapeB"} />;
            }}
          />
        </div>
        <div className="w-2/12 flex items-center justify-center">
          <Sidebar />
        </div>
      </div>
    </StoreProvider>
  );
}
