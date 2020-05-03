import { KGrid } from "./generateGrid";
import { Matrix } from "transformation-matrix";

export type Point = [number, number];
export type Line = [Point, Point];
export type KPoint = [number, number, number, number];

export interface PInstance {
  instanceId: string;
  masterId: string;
  translate: Point;
  rotate: number;
  rotationAnchor: Point;
}

export interface PMaster {
  color: string;
  id: string;
  pts: [number, number][];
  children: string[];
}

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
