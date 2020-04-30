import { createStore, createTypedHooks } from "easy-peasy";
import model, { StoreModel } from "./model";

const {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore,
} = createTypedHooks<StoreModel>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };

const store = createStore(model);

export default store;
