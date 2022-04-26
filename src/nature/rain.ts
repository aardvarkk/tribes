import { choose, getPx, INTENSITIES, setPx } from "../main";

enum Weather {
  NORMAL,
  RAINY,
  FERN_GULLY,
  DRY,
  DROUGHT,
}

const PWeather = [0.6, 0.25, 0.01, 0.13, 0.01];

export function rain(data: Uint8ClampedArray) {
  console.log("NATURE: RAIN");

  const weather = choose(PWeather) as Weather;
  console.log("WEATHER", weather);

  for (let y = 0; y < 256; ++y) {
    for (let x = 0; x < 256; ++x) {
      const value = getPx(data, x, y);

      switch (weather) {
        case Weather.NORMAL:
          if (value === INTENSITIES.EMPTY && Math.random() < 0.01) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.002) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          }
          break;

        case Weather.RAINY:
          if (value === INTENSITIES.EMPTY && Math.random() < 0.05) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.02) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.01) {
            setPx(data, x, y, INTENSITIES.NATURE[2]);
          }
          break;

        case Weather.FERN_GULLY:
          if (value === INTENSITIES.EMPTY && Math.random() < 0.1) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          } else if (value === INTENSITIES.NATURE[0] && Math.random() < 0.05) {
            setPx(data, x, y, INTENSITIES.NATURE[1]);
          } else if (value === INTENSITIES.NATURE[1] && Math.random() < 0.02) {
            setPx(data, x, y, INTENSITIES.NATURE[2]);
          } else if (value === INTENSITIES.NATURE[2] && Math.random() < 0.02) {
            setPx(data, x, y, INTENSITIES.NATURE[3]);
          }
          // TODO: Skip final decay phase
          break;

        case Weather.DRY:
          if (value === INTENSITIES.EMPTY && Math.random() < 0.002) {
            setPx(data, x, y, INTENSITIES.NATURE[0]);
          }
          break;

        case Weather.DROUGHT:
        // TODO: Run 3 decay phases (same as above, but above is running 0 decay phases)
      }
    }
  }
}
