import { rain } from "./nature/rain";
import "./style.css";

let year = 0; // Changes as we step

export const INTENSITIES = {
  EMPTY: 0xff,
  NATURE: [0xef, 0xd6, 0xa0, 0x88],
  SHELTER: [0x75, 0x56, 0x35, 0x00],
  TRADE: [0x75, 0x56, 0x35, 0x00],
};

const WIDTH = 256;
const HEIGHT = 256;

const clearBtn = document.getElementById("clear") as HTMLButtonElement;
clearBtn.onclick = () => clear();

const stepBtn = document.getElementById("step") as HTMLButtonElement;
stepBtn.onclick = () => runSteps();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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
  return cum;
}

export function choose(probs: number[]) {
  const cum = cumProb(probs);
  console.log(cum);
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

  // NATURE
  rain(data);

  ctx.putImageData(image, 0, 0);

  setYear(year + 1);
}
