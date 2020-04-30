import polygons, { PolygonsModel, kGrid } from "./polygons";
import cursor, { CursorModel } from "./cursor";
import { KGrid } from "../generateGrid";
import { Action, action } from "easy-peasy";

export interface StoreModel {
  polygons: PolygonsModel;
  kGrid: KGrid;
  cursor: CursorModel;
  state: string | null;
  updateState: Action<StoreModel, string | null>;
  activePolygon: string | null;
  updateActivePolygon: Action<StoreModel, string | null>;
}

const model: StoreModel = {
  polygons,
  kGrid,
  cursor,
  state: null,
  updateState: action((state, payload) => {
    console.log("SETTING STATE");
    state.state = payload;
  }),
  activePolygon: null,
  updateActivePolygon: action((state, payload) => {
    console.log("SETTING ACTIVE");
    state.activePolygon = payload;
  }),
};

export default model;