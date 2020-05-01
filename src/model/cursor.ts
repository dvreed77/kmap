import { Action, action } from "easy-peasy";

export interface CursorModel {
  position: [number, number];
  update: Action<CursorModel, [number, number]>;
}

const cursor: CursorModel = {
  position: [NaN, NaN],
  update: action((state, payload) => {
    state.position = payload;
  }),
};

export default cursor;
