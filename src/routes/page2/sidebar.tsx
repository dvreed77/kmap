import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Switch } from "antd";
import { Link } from "react-router-dom";

export const Sidebar = ({ setState, onSave, grid, setGrid }: any) => {
  return (
    <div className="flex flex-column border rounded p-4">
      <Link to="/page1">Home</Link>
      <Tooltip placement="top" title={"Create Shape"}>
        <FontAwesomeIcon
          className="hover:text-gray-700 text-gray-800 active:text-gray-600"
          icon={faPlusSquare}
          size="4x"
          onClick={() => setState("NEW")}
        />
      </Tooltip>
      <Tooltip placement="top" title={"Save"}>
        <FontAwesomeIcon
          className="hover:text-gray-700 text-gray-800 active:text-gray-600"
          icon={faSave}
          size="4x"
          onClick={() => onSave()}
        />
      </Tooltip>

      <Switch checked={grid} onChange={setGrid} />
    </div>
  );
};
