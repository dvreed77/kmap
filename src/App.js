import React, { useState } from "react";
import { InputNumber } from "antd";
import Canvas from "./canvas";

function App() {
  const [activePt, setActivePt] = useState(null);
  const [gridDensity, setGridDensity] = useState(1);
  const mouseOver = pt => {
    setActivePt(pt);
  };

  return (
    <div>
      <div className="mx-auto mt-10 shadow flex flex-row w-8/12">
        <Canvas gridDensity={gridDensity} mouseOver={mouseOver} />

        <InputNumber
          min={1}
          max={4}
          defaultValue={1}
          onChange={setGridDensity}
        />
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
