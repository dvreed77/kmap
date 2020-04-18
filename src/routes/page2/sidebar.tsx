import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";

export const Sidebar = ({ setAction, onSave }: any) => {
  return (
    <div className="flex flex-column border rounded p-4">
      <Tooltip placement="top" title={"Create Shape"}>
        <FontAwesomeIcon
          className="hover:text-gray-700 text-gray-800 active:text-gray-600"
          icon={faPlusSquare}
          size="4x"
          onClick={() => setAction({ action: "NEW" })}
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
    </div>
  );
};
