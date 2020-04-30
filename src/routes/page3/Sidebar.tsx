import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Switch } from "antd";
import { Link } from "react-router-dom";
import { useStoreActions, useStoreState } from "./store";

export const Sidebar = () => {
  const updateState = useStoreActions((actions) => actions.updateState);
  const showGrid = useStoreState((state) => state.showGrid);
  const setShowGrid = useStoreActions((actions) => actions.setShowGrid);

  return (
    <div className="flex flex-col border rounded p-4">
      <Link to="/page1">Home</Link>
      <Tooltip placement="right" title={"Create Shape"}>
        <FontAwesomeIcon
          className="hover:text-gray-700 text-gray-800 active:text-gray-600"
          icon={faPlusSquare}
          size="4x"
          onClick={() => updateState("NEW")}
        />
      </Tooltip>
      <Tooltip placement="right" title={"Save"}>
        <FontAwesomeIcon
          className="hover:text-gray-700 text-gray-800 active:text-gray-600"
          icon={faSave}
          size="4x"
          // onClick={() => onSave()}
        />
      </Tooltip>

      <Switch checked={showGrid} onChange={setShowGrid} />
    </div>
  );
};
