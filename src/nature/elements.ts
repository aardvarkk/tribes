import { getPx, HEIGHT, setPx, WIDTH } from "../main";
import FLOWER_A from "../patterns/flowerA";
import FLOWER_B from "../patterns/flowerB";
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
      if (value !== find[dy][dx]) {
        return false;
      }
    }
  }

  return true;
}

function replacePattern(
  replace: number[][],
  x: number,
  y: number,
  data: Uint8ClampedArray
) {
  const replaceH = replace.length;
  const replaceW = replace[0].length;

  const startX = x - Math.trunc(replaceW / 2);
  const startY = y - Math.trunc(replaceH / 2);

  for (let dy = 0; dy < replaceH; ++dy) {
    for (let dx = 0; dx < replaceW; ++dx) {
      if (replace[dy][dx] === undefined) {
        continue;
      }
      setPx(data, startX + dx, startY + dy, replace[dy][dx]);
    }
  }

  return true;
}

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
      if (Math.random() > probability) {
        continue;
      }

      if (matchPattern(find, x, y, data)) {
        // console.log(`Matched at (${x}, ${y}) with probability ${probability}`);
        replacePattern(replace, x, y, data);
      }
    }
  }
}

function basicClobber(
  name: string,
  data: Uint8ClampedArray,
  elements: string[][],
  probs: number[]
) {
  console.log("NATURE: ELEMENTS -", name);

  if (probs.length !== elements.length) {
    throw Error(
      `${probs.length} probabilities !== ${elements.length} elements`
    );
  }

  // Going in reverse "tier" is important
  // Otherwise we're likely to place an element
  // and then replace it with the next biggest one right away
  const elementsRev = [...elements].reverse();
  const probsRev = [...probs].reverse();

  elementsRev.forEach(([find, replace], idx: number) => {
    findAndReplace(data, find, replace, probsRev[idx]);
  });
}

export function elements(data: Uint8ClampedArray) {
  console.log("NATURE: ELEMENTS");

  basicClobber("FLOWER A", data, FLOWER_A, [0.35, 0.25, 0.15, 0.05]);
  basicClobber("FLOWER B", data, FLOWER_B, [0.35, 0.25, 0.15, 0.05]);
}
