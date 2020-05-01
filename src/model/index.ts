import polygons, { PolygonsModel, kGrid } from "./polygons";
import cursor, { CursorModel } from "./cursor";
import { KGrid } from "../generateGrid";
import { Action, action, persist } from "easy-peasy";

export interface StoreModel {
  polygons: PolygonsModel;
  kGrid: KGrid;
  cursor: CursorModel;
  state: string | null;
  updateState: Action<StoreModel, string | null>;
  activePolygon: string | null;
  updateActivePolygon: Action<StoreModel, string | null>;
  showGrid: boolean;
  setShowGrid: Action<StoreModel, boolean>;
}

const model: StoreModel = {
  polygons: persist(polygons, { storage: "localStorage" }),
  kGrid,
  cursor,
  state: null,
  updateState: action((state, payload) => {
    state.state = payload;
  }),
  activePolygon: null,
  updateActivePolygon: action((state, payload) => {
    state.activePolygon = payload;
  }),
  showGrid: true,
  setShowGrid: action((state, payload) => {
    state.showGrid = payload;
  }),
};

export default model;
