import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

export const Sidebar = ({ setAction }: any) => {
  return (
    <div className="flex flex-column border rounded p-4">
      <FontAwesomeIcon
        color="black"
        icon={faPlusSquare}
        size="4x"
        onClick={() => setAction({ action: "NEW" })}
      />
    </div>
  );
};
