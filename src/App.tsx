import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { StoreProvider } from "easy-peasy";
import { path } from "ramda";
import { Canvas } from "./Canvas";
import { Sidebar } from "./components/Sidebar";
import store from "./store";

function App() {
  return (
    <Router>
      <Header />
      <div className="w-10/12 mx-auto flex flex-row">
        <StoreProvider store={store}>
          <div className="flex flex-row w-full">
            <div className="flex flex-grow items-center justify-center">
              <Route
                path={`/:id?`}
                render={({ match }) => {
                  const {
                    params: { id },
                  } = match;
                  return <Canvas height={500} shapeId={id ? id : "shapeB"} />;
                }}
              />
            </div>
            <div className="w-2/12 flex items-center justify-center">
              <Sidebar />
            </div>
          </div>
        </StoreProvider>
      </div>
    </Router>
  );
}

export default App;
