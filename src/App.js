import React, { useState } from "react";
import Canvas from "./canvas";

function App() {
  const [activePt, setActivePt] = useState(null);
  const mouseOver = pt => {
    setActivePt(pt);
  };

  return (
    <div>
      <div className="mx-auto mt-10 shadow flex flex-row w-8/12">
        <Canvas mouseOver={mouseOver} />
        {activePt && (
          <ul>
            <li>ANT: {activePt.ant}</li>
            <li>BAT: {activePt.bat}</li>
            <li>CAT: {activePt.cat}</li>
            <li>DOG: {activePt.dog}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
