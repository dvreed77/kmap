import { Action, action, actionOn, ActionOn } from "easy-peasy";
import { NPolygon, KPolygon, KPoint, PInstance, PMaster } from "../types";
import { shapes } from "./fixtures";
import { KGrid } from "../generateGrid";
import { StoreModel } from ".";
import * as R from "ramda";
import {
  applyToPoint,
  translate,
  Matrix,
  identity,
} from "transformation-matrix";

export const kGrid = new KGrid({ cols: 12, rows: 10 });

export interface PolygonsModel {
  masters: PMaster[];
  instances: PInstance[];
  add: Action<PolygonsModel, { parentId: string; pts: [number, number][] }>;
  duplicate: Action<
    PolygonsModel,
    { parentId: string; instanceId: string; newInstanceId: string }
  >;
  move: Action<
    PolygonsModel,
    { id: string | null; position: [number, number] }
  >;
  delete: Action<PolygonsModel, { parentId: string; instanceId: string }>;
  setColor: Action<PolygonsModel, { parentId: string; color: string }>;
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
  add: action((state, { parentId, pts }) => {
    console.log("ADDDING", parentId, pts);
    const newId = Math.random().toString(36).slice(2);
    const newPolygonMaster: PMaster = {
      color: "red",
      pts: pts,
      id: newId,
      children: [],
    };
    state.masters.push(newPolygonMaster);

    const newPolygonInstance: PInstance = {
      masterId: newId,
      instanceId: newId,
      transMat: identity(),
    };
    state.instances.push(newPolygonInstance);

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.children.push(newId);
      }
      return master;
    });
  }),

  duplicate: action((state, payload) => {
    const { parentId, instanceId, newInstanceId } = payload;
    const polygonInstance = state.instances.find(
      (d) => d.instanceId === instanceId
    ) as PInstance;
    const newPolygonInstance: PInstance = {
      ...polygonInstance,
      instanceId: newInstanceId,
    };
    state.instances.push(newPolygonInstance);

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.children.push(newInstanceId);
      }
      return master;
    });
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
  delete: action((state, payload) => {
    const { parentId, instanceId } = payload;
    state.instances = state.instances.filter(
      (d) => d.instanceId !== instanceId
    );

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.children = master.children.filter((d) => d !== instanceId);
      }
      return master;
    });
  }),
  setColor: action((state, payload) => {
    const { parentId, color } = payload;

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.color = color;
      }
      return master;
    });
  }),
};

export default polygons;
