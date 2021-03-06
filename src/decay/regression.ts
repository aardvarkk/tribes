import { INTENSITIES } from "../intensities";
import { choose, getPx, HEIGHT, setPx, WIDTH } from "../main";

enum Regression {
  NORMAL = "NORMAL",
  WIND_STORM = "WIND STORM",
  BENEVOLENT = "BENEVOLENT",
  CATASTROPHIC = "CATASTROPHIC",
  EXTINCTION = "EXTINCTION",
}

const PRegression = [0.9, 0.05, 0.04, 0.0095, 0.0005];

export function regression(read: Uint8ClampedArray, write: Uint8ClampedArray) {
  const decay = Object.values(Regression)[choose(PRegression)];

  console.log("DECAY: REGRESSION -", decay);

  for (let y = 0; y < HEIGHT; ++y) {
    for (let x = 0; x < WIDTH; ++x) {
      const value = getPx(read, x, y);

      switch (decay) {
        case Regression.NORMAL:
        case Regression.CATASTROPHIC: // Behaves as normal (then later we run catastrophe)
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.001) {
            setPx(write, x, y, INTENSITIES.NATURE[2]);
          } else if (
            value === INTENSITIES.NATURE[2] &&
            Math.random() < 0.0025
          ) {
            setPx(write, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.01) {
            setPx(write, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.05) {
            setPx(write, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.WIND_STORM:
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.01) {
            setPx(write, x, y, INTENSITIES.NATURE[2]);
          } else if (value === INTENSITIES.NATURE[2] && Math.random() < 0.02) {
            setPx(write, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.1) {
            setPx(write, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.25) {
            setPx(write, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.BENEVOLENT:
          if (value === INTENSITIES.NATURE[1] && Math.random() < 0.001) {
            setPx(write, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.005) {
            setPx(write, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.EXTINCTION:
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.85) {
            setPx(write, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[2] && Math.random() < 0.75) {
            setPx(write, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.85) {
            setPx(write, x, y, INTENSITIES.EMPTY);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.98) {
            setPx(write, x, y, INTENSITIES.EMPTY);
          }

          // TODO: Force drought weather for next year
          break;
      }
    }
  }

  // Special treatment for catastrophic
  if (decay === Regression.CATASTROPHIC) {
    // TODO: Run catastrophe
  }
}
