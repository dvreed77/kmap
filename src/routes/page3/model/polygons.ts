import { Action, action, actionOn, ActionOn } from "easy-peasy";
import { NPolygon, KPolygon, KPoint, PInstance, PMaster } from "../types";
import { shapes } from "./fixtures";
import { KGrid } from "../generateGrid";
import { StoreModel } from ".";
import * as R from "ramda";
import { applyToPoint, translate, Matrix } from "transformation-matrix";

export const kGrid = new KGrid({ cols: 12, rows: 10 });

function lensMatching(pred: any) {
  return R.lens(R.find(pred), (newVal: any, array: any[]) => {
    const index = R.findIndex(pred, array);
    return R.update(index, newVal, array);
  });
}

const lensById = R.compose(lensMatching, R.propEq("id"));

export interface PolygonsModel {
  masters: PMaster[];
  instances: PInstance[];
  add: Action<PolygonsModel, string>;
  move: Action<
    PolygonsModel,
    { id: string | null; position: [number, number] }
  >;
  // onMove: ActionOn<PolygonsModel, StoreModel>;
}

const instances: PInstance[] = [];

const masters: PMaster[] = (shapes as KPolygon[]).map(
  ({ id, color, kPts, children }: KPolygon) => ({
    id,
    color,
    pts: kPts.map((pt: KPoint) => kGrid.kPtToPt0(pt)),
    children: children.map((child, idx) => {
      const instanceId = `${id}.${idx}`;
      instances.push({
        instanceId,
        masterId: child.id,
        transMat: child.transMat,
      });
      return instanceId;
    }),
  })
);

const polygons: PolygonsModel = {
  masters,
  instances,
  add: action((state, payload) => {
    // state.polygons.push(payload);
  }),

  move: action((state, payload) => {
    const { id, position: pt } = payload;
    const transMat = translate(pt[0], pt[1]);
    state.instances = state.instances.map((instance) => {
      if (
        instance.instanceId === id &&
        !R.equals(instance.transMat, transMat)
      ) {
        return {
          ...instance,
          transMat,
        };
      } else {
        return instance;
      }
    });
  }),
};

export default polygons;
