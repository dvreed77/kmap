export const SQRT_3 = Math.sqrt(3);

export const isOdd = d => !!(d % 2);

export function* GridGenerator(nCols, nRows) {
  let cStart, cEnd;
  if (isOdd(nCols)) {
    cStart = -(nCols - 1) / 2 - 1;
    cEnd = (nCols - 1) / 2 + 1;
  } else {
    cStart = -nCols / 2 - 1;
    cEnd = nCols / 2 + 1;
  }

  let rStart, rEnd;
  if (isOdd(nCols)) {
    rStart = -(nRows - 1) / 2;
    rEnd = (nRows - 1) / 2 + 1;
  } else {
    rStart = -nRows / 2;
    rEnd = nRows / 2 + 1;
  }

  for (let i = cStart; i < cEnd; i++) {
    for (let j = rStart; j < rEnd; j++) {
      yield [i, j];
    }
  }
}
