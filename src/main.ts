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
clear();

function setYear(newYear: number) {
  year = newYear;
  const title = document.getElementsByTagName("h1")[0];
  title.innerText = `Year ${year}`;
}

function clear() {
  const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const data = image.data;
  for (let i = 0; i < image.data.length; ++i) {
    data[i] = 0xff;
  }
  ctx.putImageData(image, 0, 0);
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
  const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const data = image.data;

  console.log("--- YEAR ", year, " ---");

  // NATURE: RAIN
  rain(data);

  // NATURE: ELEMENTS
  elements(data);

  // DECAY: REGRESSION
  regression(data);

  ctx.putImageData(image, 0, 0);

  setYear(year + 1);
}
