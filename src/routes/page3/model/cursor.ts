import { Action, action, thunk, Thunk } from "easy-peasy";

export interface CursorModel {
  position: [number, number];
  update: Action<CursorModel, [number, number]>;
  // update: Thunk<CursorModel, [number, number]>;
}

const cursor: CursorModel = {
  position: [NaN, NaN],
  update: action((state, payload) => {
    // console.log("update", payload);
    state.position = payload;

    // thunk(async (actions, payload, {getStoreActions}) => {

    // });
  }),
  // update: thunk((actions, payload, ) => {
  //   // call our service
  //   await basketService.addProductToBasket(payload);
  //   // then dispatch an action to update state
  //   actions.updatePosition(payload);
  // }),
};

export default cursor;
