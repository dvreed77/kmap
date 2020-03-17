import { isOdd, SQRT_3 } from "./index";

export const convertPt = ({ width, pt: { i, j, ant, bat, cat, dog } }) => {
  const N_HEX_ROWS = 9;
  const N_HEX_COLS = 10;

  const HEX_W = width / N_HEX_COLS;

  const G = HEX_W / 2;
  const F = G / SQRT_3;
  const H = 2 * F;

  // see page 54 of notes

  const x0 = isOdd(cat) ? i * HEX_W + HEX_W / 2 : i * HEX_W;

  const y0 = cat * (F + H) + 10;

  let dx, dy;
  if (dog === 0) {
    dx = 0;
    dy = 0;
  } else {
    const angle = ((-30 * dog + 150) * Math.PI) / 180;
    if (isOdd(dog)) {
      dx = G * Math.cos(angle);
      dy = -G * Math.sin(angle);
    } else {
      dx = H * Math.cos(angle);
      dy = -H * Math.sin(angle);
    }
  }

  const xD = x0 + dx;
  const yD = y0 + dy;

  return [xD, yD];
};
