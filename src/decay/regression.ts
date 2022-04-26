import { choose, getPx, INTENSITIES, setPx } from "../main";

enum Regression {
  NORMAL = "NORMAL",
  WIND_STORM = "WIND STORM",
  BENEVOLENT = "BENEVOLENT",
  CATASTROPHIC = "CATASTROPHIC",
  EXTINCTION = "EXTINCTION",
}

const PRegression = [0.9, 0.05, 0.04, 0.0095, 0.0005];

export function regression(data: Uint8ClampedArray) {
  let decay = Object.values(Regression)[choose(PRegression)];

  console.log("DECAY: REGRESSION -", decay);

  // Special treatment for catastrophic... then just run as "normal" because normal decay is still in effect
  if (decay === Regression.CATASTROPHIC) {
    // TODO: Run catastrophe
    decay = Regression.NORMAL;
  }

  for (let y = 0; y < 256; ++y) {
    for (let x = 0; x < 256; ++x) {
      const value = getPx(data, x, y);

      switch (decay) {
        case Regression.NORMAL:
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.001) {
            setPx(data, x, y, INTENSITIES.NATURE[2]);
          } else if (
            value === INTENSITIES.NATURE[2] &&
            Math.random() < 0.0025
          ) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.01) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.05) {
            setPx(data, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.WIND_STORM:
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.01) {
            setPx(data, x, y, INTENSITIES.NATURE[2]);
          } else if (value === INTENSITIES.NATURE[2] && Math.random() < 0.02) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.1) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.25) {
            setPx(data, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.BENEVOLENT:
          if (value === INTENSITIES.NATURE[1] && Math.random() < 0.001) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.005) {
            setPx(data, x, y, INTENSITIES.EMPTY);
          }
          break;

        case Regression.EXTINCTION:
          if (value === INTENSITIES.NATURE[3] && Math.random() < 0.85) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[2] && Math.random() < 0.75) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.85) {
            setPx(data, x, y, INTENSITIES.EMPTY);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.98) {
            setPx(data, x, y, INTENSITIES.EMPTY);
          }

          // TODO: Force drought weather for next year
          break;
      }
    }
  }
}
