import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Canvas from "./canvas";
import Canvas2 from "./canvas2";

function App() {
  const [activePt, setActivePt] = useState(null);
  const mouseOver = pt => {
    setActivePt(pt);
  };

  return (
    <Router>
      <div className="mx-auto mt-10 shadow flex flex-row w-8/12">
        <Switch>
          <Route path="/page1">
            <Canvas2 mouseOver={mouseOver} />
            {activePt && (
              <ul>
                <li>ANT: {activePt.ant}</li>
                <li>BAT: {activePt.bat}</li>
                <li>CAT: {activePt.cat}</li>
                <li>DOG: {activePt.dog}</li>
              </ul>
            )}
          </Route>
          <Route path="/">
            <Canvas mouseOver={mouseOver} />
            {activePt && (
              <ul>
                <li>ANT: {activePt.ant}</li>
                <li>BAT: {activePt.bat}</li>
                <li>CAT: {activePt.cat}</li>
                <li>DOG: {activePt.dog}</li>
              </ul>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
