import { KGrid } from "./generateGrid";
import { Matrix } from "transformation-matrix";

export interface PolygonRef {
  id: string;
  transMat: Matrix;
}

export type KPoint = [number, number, number, number];

export type NPolygon = {
  id: string;
  color: string;
  pts: [number, number][];
  children: PolygonRef[];
};

export interface PInstance {
  instanceId: string;
  masterId: string;
  transMat: Matrix;
}

export interface PMaster {
  color: string;
  id: string;
  pts: [number, number][];
  children: string[];
}

export type KPolygon = {
  id: string;
  color: string;
  kPts: [number, number, number, number][];
  children: PolygonRef[];
};

export interface IAppContext {
  kGrid: KGrid;
  polygons: any;
  addPolygon: any;
  deletePolygon: any;
  movePolygon: any;
  rotatePolygon: any;
  duplicatePolygon: any;
  active: any;
  setActive: any;
  state: any;
  setState: any;
}
