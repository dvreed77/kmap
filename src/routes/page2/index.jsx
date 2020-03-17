import React from "react";

import { Canvas } from "./canvas";

export const Page2 = () => {
  return (
    <div className="flex mx-auto w-full">
      {/* <div className="grid grid-cols-12 gap-4 w-full"> */}
      <div className="w-10/12 flex items-center justify-center">
        <Canvas />
      </div>
      <div className="w-2/12 bg-gray-500 h-12 flex items-center justify-center"></div>
      {/* </div> */}
      {/* <Canvas /> */}
      {/* </div> */}
      {/* <div class="bg-white rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 p-4 bg-white p-8">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>{" "}
          <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>{" "}
          <div class="col-span-1 bg-gray-300 h-12 flex items-center justify-center"></div>{" "}
          <div class="col-span-1 bg-gray-300 h-12 flex items-center justify-center"></div>{" "}
          <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
        </div>
      </div>

      <Canvas
        className="flex-grow"
        onClick={onClick}
        drawingPoly={drawingPoly}
      />
      <div className="flex flex-column border rounded p-4">
        <FontAwesomeIcon
          className="hover:text-gray-600 active:text-gray-700"
          onClick={createNew}
          icon={faPlusSquare}
          size="4x"
        />
      </div> */}
    </div>
  );
};
