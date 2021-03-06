import { getPx, HEIGHT, setPx, WIDTH } from "../main";
import FLOWER_A from "../patterns/flowerA";
import FLOWER_B from "../patterns/flowerB";
import VINE_A from "../patterns/vineA";
import { TIER_TO_NATURE } from "../patterns/tiers";
import HUMPS from "../patterns/humps";

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
  data: Uint8ClampedArray,
  fgMax: number
) {
  const findH = find.length;
  const findW = find[0].length;

  const startX = x - Math.trunc(findW / 2);
  const startY = y - Math.trunc(findH / 2);

  const bgMatch = 0.8; // % of background that must match
  let bgExp = 0;
  let bgAct = 0;

  for (let dy = 0; dy < findH; ++dy) {
    for (let dx = 0; dx < findW; ++dx) {
      const value = getPx(data, startX + dx, startY + dy);

      // Expected to be background
      if (find[dy][dx] === undefined) {
        ++bgExp;
        if (value > fgMax) {
          ++bgAct;
        }
      }
      // Value is not dark enough to match target
      else if (value > find[dy][dx]) {
        return false;
      }
    }
  }

  // Not a close enough background match
  if (bgAct / bgExp < bgMatch) {
    // console.log(`${bgAct}/${bgExp} < ${bgMatch}`);
    return false;
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

function newMatrix(m: number, n: number) {
  return [...Array(m)].map(() => Array(n).fill(undefined));
}

function rotate(matrix: number[][], rotation: number): number[][] {
  const m = matrix.length;
  const n = matrix[0].length;

  switch (rotation) {
    case 0:
      return matrix;
    case 90:
      const rot90 = newMatrix(n, m);
      for (let y = 0; y < n; ++y) {
        for (let x = 0; x < m; ++x) {
          rot90[y][x] = matrix[m - 1 - x][y];
        }
      }
      return rot90;
    case 180:
      const rot180 = newMatrix(m, n);
      for (let y = 0; y < m; ++y) {
        for (let x = 0; x < n; ++x) {
          rot180[y][x] = matrix[m - 1 - y][n - 1 - x];
        }
      }
      return rot180;
    case 270:
      const rot270 = newMatrix(n, m);
      for (let y = 0; y < n; ++y) {
        for (let x = 0; x < m; ++x) {
          rot270[y][x] = matrix[x][n - 1 - y];
        }
      }
      return rot270;
    default:
      throw Error(`Unsupported rotation: ${rotation}`);
  }
}

function rotateOffset(offset: Offset, rotation: number) {
  switch (rotation) {
    case 0:
      return offset;
    case 90:
      return {
        x: -offset.y,
        y: offset.x,
      };
    case 180:
      return {
        x: -offset.x,
        y: -offset.y,
      };
    case 270:
      return {
        x: offset.y,
        y: -offset.x,
      };
    default:
      throw Error(`Unsupported rotation: ${rotation}`);
  }
}

function findAndReplace(
  read: Uint8ClampedArray,
  write: Uint8ClampedArray,
  rotation: number,
  findStr: string,
  replaceStr: string,
  probability: number,
  offset?: Offset
) {
  // console.log(find.trim());
  // console.log(replace.trim());

  const find = rotate(patternToArray(findStr), rotation);
  const replace = rotate(patternToArray(replaceStr), rotation);

  let fgMax = Number.NEGATIVE_INFINITY;
  for (let y = 0; y < find.length; ++y) {
    for (let x = 0; x < find[y].length; ++x) {
      const v = find[y][x];
      if (v !== undefined) {
        fgMax = Math.max(fgMax, v);
      }
    }
  }

  // console.log({ fgMax });

  let rotatedOffset: Offset = { x: 0, y: 0 };
  if (offset) {
    rotatedOffset = rotateOffset(offset, rotation);
  }

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

      if (matchPattern(find, x, y, read, fgMax)) {
        // console.log(
        //   `Matched at (${x}, ${y}) with probability ${probability} and rotation ${rotation}`
        // );
        // if (offset) {
        //   console.log(
        //     `Rotated (${offset.x}, ${offset.y}) to (${rotatedOffset.x}, ${rotatedOffset.y})`
        //   );
        // }
        replacePattern(
          replace,
          x + rotatedOffset.x,
          y + rotatedOffset.y,
          write
        );
      }
    }
  }
}

function basicClobber(
  name: string,
  read: Uint8ClampedArray,
  write: Uint8ClampedArray,
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
    findAndReplace(read, write, 0, find, replace, probsRev[idx]);
  });
}

export type Offset = {
  x: number;
  y: number;
};

export type Pass = {
  find: string;
  replace: string;
  rotations: number[];
  prob: number;
  offset?: Offset;
};

function runPass(
  read: Uint8ClampedArray,
  write: Uint8ClampedArray,
  pass: Pass
) {
  // For all rotations...
  pass.rotations.forEach((rot) => {
    if (pass.replace) {
      findAndReplace(
        read,
        write,
        rot,
        pass.find,
        pass.replace,
        pass.prob,
        pass.offset
      );
    }
  });
}

export function elements(read: Uint8ClampedArray, write: Uint8ClampedArray) {
  console.log("NATURE: ELEMENTS");

  basicClobber("FLOWER A", read, write, FLOWER_A, [0.35, 0.25, 0.15, 0.05]);
  basicClobber("FLOWER B", read, write, FLOWER_B, [0.35, 0.25, 0.15, 0.05]);

  VINE_A.forEach((pass) => runPass(read, write, pass));
  HUMPS.forEach((pass) => runPass(read, write, pass));
}
