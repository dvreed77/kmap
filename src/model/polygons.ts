import { Action, action } from "easy-peasy";
import { PInstance, PMaster, Point } from "../types";
import { KGrid } from "../generateGrid";
import * as R from "ramda";
import { applyToPoint, rotate, inverse } from "transformation-matrix";

export const kGrid = new KGrid({ cols: 12, rows: 10 });

const x0 = -kGrid.width / 2;
const x1 = kGrid.width / 2;

const y0 = -kGrid.height / 2;
const y1 = kGrid.height / 2;

export interface PolygonsModel {
  masters: PMaster[];
  instances: PInstance[];
  add: Action<
    PolygonsModel,
    { parentId: string; pts: Point[]; anchorPt: Point }
  >;
  setRotationAnchor: Action<
    PolygonsModel,
    { instanceId: string; anchorPt: Point }
  >;
  duplicate: Action<
    PolygonsModel,
    { parentId: string; instanceId: string; newInstanceId: string }
  >;
  move: Action<
    PolygonsModel,
    { id: string | null; position: [number, number] }
  >;
  rotate: Action<PolygonsModel, { id: string }>;
  rotateAndCopy: Action<
    PolygonsModel,
    { parentId: string; instanceId: string; newInstanceId: string }
  >;
  delete: Action<PolygonsModel, { parentId: string; instanceId: string }>;
  setColor: Action<PolygonsModel, { parentId: string; color: string }>;
}

const polygons: PolygonsModel = {
  masters: [
    {
      id: "shapeB",
      color: "green",
      pts: [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      children: [],
    },
  ],
  instances: [],
  add: action((state, { parentId, pts, anchorPt }) => {
    console.log("ADDDING", parentId, pts, anchorPt);
    const newId = Math.random().toString(36).slice(2);
    const newPolygonMaster: PMaster = {
      color: "red",
      pts: pts.map((pt) => [pt[0] - anchorPt[0], pt[1] - anchorPt[1]]),
      id: newId,
      children: [],
    };
    state.masters.push(newPolygonMaster);

    const newPolygonInstance: PInstance = {
      masterId: newId,
      instanceId: newId,
      translate: anchorPt,
      rotate: 0,
      rotationAnchor: [0, 0],
    };
    console.log(newPolygonInstance);
    state.instances.push(newPolygonInstance);

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.children.push(newId);
      }
      return master;
    });
  }),

  setRotationAnchor: action((state, payload) => {
    const { instanceId, anchorPt } = payload;

    state.instances = state.instances.map((instance) => {
      if (instance.instanceId === instanceId) {
        // instanceId.children.push(newId);
        // console.log(instanceId, anchorPt);
        instance.rotationAnchor = [
          instance.translate[0] - anchorPt[0],
          instance.translate[1] - anchorPt[1],
        ];
      }
      return instance;
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
    state.instances = state.instances.map((instance) => {
      if (instance.instanceId === id) {
        const newTranslate = applyToPoint(inverse(rotate(instance.rotate)), pt);
        if (!R.equals(instance.translate, newTranslate)) {
          return {
            ...instance,
            // translate: pt,
            translate: newTranslate,
          };
        }
      }

      return instance;
    });
  }),

  rotate: action((state, payload) => {
    const { id } = payload;
    state.instances = state.instances.map((instance) => {
      if (instance.instanceId === id) {
        return {
          ...instance,
          rotate: instance.rotate + Math.PI / 3,
          // translate: applyToPoint(
          //   inverse(rotate(instance.rotate + Math.PI / 3)),
          //   instance.translate
          // ),
        };
      } else {
        return instance;
      }
    });
  }),

  rotateAndCopy: action((state, payload) => {
    const { parentId, instanceId, newInstanceId } = payload;
    const polygonInstance = state.instances.find(
      (d) => d.instanceId === instanceId
    ) as PInstance;
    const newPolygonInstance: PInstance = {
      ...polygonInstance,
      instanceId: newInstanceId,
      rotate: polygonInstance.rotate + Math.PI / 3,
    };
    state.instances.push(newPolygonInstance);

    state.masters = state.masters.map((master) => {
      if (master.id === parentId) {
        master.children.push(newInstanceId);
      }
      return master;
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
