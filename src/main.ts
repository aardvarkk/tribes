import "./style.css";

const clearBtn = document.getElementById("clear") as HTMLButtonElement;
clearBtn.onclick = () => clear();

const stepBtn = document.getElementById("step") as HTMLButtonElement;
stepBtn.onclick = () => step();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
clear();

function clear() {
  const image = ctx.getImageData(0, 0, 256, 256);
  const data = image.data;
  for (let i = 0; i < image.data.length; i += 4) {
    data[i + 0] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = 0xff;
  }
  ctx.putImageData(image, 0, 0);
}

function step() {
  const image = ctx.getImageData(0, 0, 256, 256);
  const data = image.data;
  data[0] = data[1] = data[2] = 0xff;
  ctx.putImageData(image, 0, 0);
}
