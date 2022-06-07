import { rain } from "./nature/rain";
import { regression } from "./decay/regression";
import "./style.css";
import { elements } from "./nature/elements";

let year = 0; // Changes as we step

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const WIDTH = canvas.width;
export const HEIGHT = canvas.height;

const clearBtn = document.getElementById("clear") as HTMLButtonElement;
clearBtn.onclick = () => clear();

const stepBtn = document.getElementById("step") as HTMLButtonElement;
stepBtn.onclick = () => runSteps();

const ctx = canvas.getContext("2d", { alpha: false })!;

// Double buffer -- read from one and write to the other
const A = ctx.createImageData(WIDTH, HEIGHT);
const B = ctx.createImageData(WIDTH, HEIGHT);

let read: ImageData;
let write: ImageData;

clear();

function setYear(newYear: number) {
  year = newYear;
  const title = document.getElementsByTagName("h1")[0];
  title.innerText = `Year ${year}`;
}

function swap() {
  ctx.putImageData(write, 0, 0);
  read.data.set(write.data);
  [read, write] = [write, read];
}

function clear() {
  read = A;
  write = B;

  [read, write].forEach((imageData) => {
    const data = imageData.data;
    for (let i = 0; i < imageData.data.length; ++i) {
      data[i] = 0xff;
    }
  });

  swap();
  setYear(0);
}

export function getPx(data: Uint8ClampedArray, x: number, y: number): number {
  const idx = 4 * (y * WIDTH + x);
  return data[idx];
}

export function setPx(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  value: number
) {
  const idx = 4 * (y * WIDTH + x);
  data[idx + 0] = data[idx + 1] = data[idx + 2] = value;
}

export function cumProb(ps: number[]) {
  const cum = new Array(ps.length);
  cum[0] = ps[0];
  for (let i = 1; i < ps.length; ++i) {
    cum[i] = cum[i - 1] + ps[i];
  }

  if (Math.abs(cum[ps.length - 1] - 1) > 0.001) {
    console.warn("Bad probability array", ps);
  }

  return cum;
}

export function choose(probs: number[]) {
  const cum = cumProb(probs);
  const r = Math.random();
  for (let i = 0; i < cum.length; ++i) {
    if (r < cum[i]) {
      return i;
    }
  }

  return cum.length - 1;
}

// Run one (or more) steps (save a bunch of clicking!)
function runSteps() {
  const steps = parseInt(
    (document.getElementById("steps") as HTMLInputElement).value
  );
  for (let i = 0; i < steps; ++i) step();
}

// Run a *single* step
function step() {
  console.log("--- YEAR ", year, " ---");

  // NATURE: RAIN
  rain(read.data, write.data);

  // NATURE: ELEMENTS
  elements(read.data, write.data);

  // DECAY: REGRESSION
  regression(read.data, write.data);

  swap();
  setYear(year + 1);
}
