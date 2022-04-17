import "./style.css";

const INTENSITIES = {
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
stepBtn.onclick = () => step();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
clear();

function clear() {
  const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const data = image.data;
  for (let i = 0; i < image.data.length; ++i) {
    data[i] = 0xff;
  }
  ctx.putImageData(image, 0, 0);
}

function getPx(data: Uint8ClampedArray, x: number, y: number): number {
  const idx = 4 * (y * WIDTH + x);
  return data[idx];
}

function setPx(data: Uint8ClampedArray, x: number, y: number, value: number) {
  const idx = 4 * (y * WIDTH + x);
  data[idx + 0] = data[idx + 1] = data[idx + 2] = value;
}

function step() {
  const image = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const data = image.data;

  for (let y = 0; y < 256; ++y) {
    for (let x = 0; x < 256; ++x) {
      const value = getPx(data, x, y);

      // Subphase 1
      // Nature - new nature spawns from 0xff (empty) pixels
      if (value === INTENSITIES.EMPTY && Math.random() < 0.01) {
        setPx(data, x, y, INTENSITIES.NATURE[0]);
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}
