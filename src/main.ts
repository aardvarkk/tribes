import "./style.css";

type State = Uint8ClampedArray;

const clearBtn = document.getElementById("clear") as HTMLButtonElement;
clearBtn.onclick = () => clear();

const stepBtn = document.getElementById("step") as HTMLButtonElement;
stepBtn.onclick = () => step();

let state: State = new Uint8ClampedArray();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
clear();

function clear() {
  state = new Uint8ClampedArray(4 * 256 * 256);
  for (let i = 0; i < state.length; i += 4) {
    state[i + 3] = 0xff;
  }
  ctx.putImageData(new ImageData(state, 256, 256), 0, 0);
}

function step() {
  state[0] = state[1] = state[2] = 0xff;
  ctx.putImageData(new ImageData(state, 256, 256), 0, 0);
}
