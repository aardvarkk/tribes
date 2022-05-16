import { getPx, HEIGHT, WIDTH } from "../main";
import FLOWER_A from "../patterns/flowerA";
import { TIER_TO_NATURE } from "../patterns/tiers";

function lineToTiers(line: string) {
  return [...line].map(
    (px) => TIER_TO_NATURE[px as keyof typeof TIER_TO_NATURE]!
  );
}

function patternToArray(pattern: string) {
  return pattern.trim().split("\n").map(lineToTiers);
}

function matchPattern(
  find: number[][],
  x: number,
  y: number,
  data: Uint8ClampedArray
) {
  const findH = find.length;
  const findW = find[0].length;

  const startX = x - Math.trunc(findW / 2);
  const startY = y - Math.trunc(findH / 2);

  for (let dy = 0; dy < findH; ++dy) {
    for (let dx = 0; dx < findW; ++dx) {
      if (find[dy][dx] === undefined) {
        continue;
      }
      const value = getPx(data, startX + dx, startY + dy);
      if (value > find[dy][dx]) {
        return false;
      }
    }
  }

  debugger;
  console.log("FOUND", x, y);

  return true;
}

function replacePattern(
  _replace: number[][],
  _x: number,
  _y: number,
  _data: Uint8ClampedArray
) {}

function findAndReplace(
  data: Uint8ClampedArray,
  findStr: string,
  replaceStr: string,
  probability: number
) {
  // console.log(find.trim());
  // console.log(replace.trim());

  const find = patternToArray(findStr);
  const replace = patternToArray(replaceStr);

  const replaceH = replace.length;
  const replaceW = replace[0].length;

  const halfW = Math.trunc(replaceW / 2);
  const halfH = Math.trunc(replaceH / 2);

  for (let y = halfH; y < HEIGHT - halfH; ++y) {
    for (let x = halfW; x < WIDTH - halfW; ++x) {
      // Evaluate random replacement *before* doing work to check match
      if (Math.random() < probability) {
        continue;
      }

      if (matchPattern(find, x, y, data)) {
        replacePattern(replace, x, y, data);
      }
    }
  }
}

export function elements(data: Uint8ClampedArray) {
  console.log("NATURE: ELEMENTS");

  FLOWER_A.forEach(([find, replace], idx: number) => {
    const probs = [0.25, 0.15, 0.05];
    findAndReplace(data, find, replace, probs[idx]);
  });
}
