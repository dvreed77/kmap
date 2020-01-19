export const startShapes = [
  {
    type: "KPolygon",
    kPoints: [
      [1, 0, 1, 0],
      [0, -1, 1, 0],
      [-1, -1, 0, 0],
      [-1, 0, -1, 0],
      [0, 1, -1, 0],
      [1, 1, 0, 0]
    ],
    color: "red"
  },
  {
    type: "KPolygon",
    kPoints: [
      [-2, 2, -4, 0],
      [-2, 0, -2, 0],
      [0, 2, -2, 0]
    ],
    color: "green",
    actions: [[["duplicate"], ["rotate", (60 * Math.PI) / 180]]]
  },
  {
    type: "KPolygon",
    kPoints: [
      [-1, 1, -2, 0],
      [-2, 0, -2, 0],
      [-2, -1, -1, 0],
      [-1, -1, 0, 3],
      [-1, 0, -1, 0],
      [-1, 0, -1, 5]
    ],
    color: "orange"
  }
];
