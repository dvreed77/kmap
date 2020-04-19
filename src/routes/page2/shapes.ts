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
  ].map((d) => ({
    ant: d[0],
    bat: d[1],
    cat: d[2],
    dog: d[3],
  })),
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
  ].map((d) => ({
    ant: d[0],
    bat: d[1],
    cat: d[2],
    dog: d[3],
  })),
  color: "blue",
};

export const shapes = [shape1, shape2];
