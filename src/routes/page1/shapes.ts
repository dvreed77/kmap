import { identity, rotate, translate } from "transformation-matrix";

const shape1 = {
  grpId: "0",
  id: "0",
  kPts: [
    [1, 0, 1, 0],
    [0, -1, 1, 0],
    [-1, -1, 0, 0],
    [-1, 0, -1, 0],
    [0, 1, -1, 0],
    [1, 1, 0, 0],
  ],
  color: "red",
};

const shape2 = {
  grpId: "1",
  id: "1",
  kPts: [
    [2, 4, -2, 0],
    [1, 3, -2, 0],
    [0, 3, -3, 0],
    [0, 4, -4, 0],
    [1, 5, -4, 0],
    [2, 5, -3, 0],
  ],
  color: "blue",
};

const shape3 = {
  id: "shape3",
  kPts: [
    [0, 0, 0, 0],
    [0, 1, -1, 0],
    [1, 1, 0, 0],
  ],
  color: "purple",
  children: [
    {
      id: "shape4",
      transMat: identity(),
    },
  ],
};

const shape4 = {
  id: "shape4",
  kPts: [
    [0, 0, 0, 0],
    [0, 0, 0, 3],
    [0, 0, 0, 4],
    [0, 0, 0, 5],
  ],
  color: "red",
  children: [],
};

const shape5 = {
  id: "shape5",
  color: "red",
  kPts: [
    [1, 1, 0, 0],
    [0, 1, -1, 0],
    [-1, 0, -1, 0],
    [-1, -1, 0, 0],
    [0, -1, 1, 0],
    [1, 0, 1, 0],
  ],
  children: [],
  // children: [
  //   { id: "shape3", transMat: identity() },
  //   { id: "shape3", transMat: rotate(Math.PI / 3) },
  //   { id: "shape3", transMat: rotate((2 * Math.PI) / 3) },
  //   { id: "shape3", transMat: rotate((3 * Math.PI) / 3) },
  //   { id: "shape3", transMat: rotate((4 * Math.PI) / 3) },
  //   { id: "shape3", transMat: rotate((5 * Math.PI) / 3) },
  // ],
};

const shapeB = {
  id: "shapeB",
  color: "green",
  kPts: [
    [2, 4, -2, 0],
    [-4, -2, -2, 0],
    [-2, -4, 2, 0],
    [4, 2, 2, 0],
  ],

  children: [
    { id: "shape5", transMat: identity() },
    { id: "shape5", transMat: translate(-16.666666666666668, 0) },
  ],
};

export const shapes = [shape3, shape4, shape5, shapeB];
