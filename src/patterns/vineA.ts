import { Pass } from "../nature/elements";

const VINE_A: Array<Pass> = [
  {
    find: `
⬚⬚⬚⬚⬚
▤▤⬚⬚⬚
▤⬚⬚⬚▤
⬚▤▤▤⬚
⬚⬚⬚⬚⬚
`,
    replace: `
⬚⬚⬚⬚⬚
▦▦⬚⬚⬚
▦⬚⬚⬚▦
⬚▦▦▦⬚
⬚⬚⬚⬚⬚
`,
    rotations: [0, 90, 180, 270],
    prob: 0.35,
  },
  {
    find: `
⬚⬚⬚⬚⬚
▦▦⬚⬚⬚
▦⬚⬚⬚▦
⬚▦▦▦⬚
⬚⬚⬚⬚⬚
`,
    replace: `
⬚⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚▦⬚⬚⬚⬚⬚⬚
▦▦▦▦▦⬚⬚⬚⬚
▦⬚⬚▦▦▦⬚▦▦
⬚⬚⬚⬚▦▦▦▦⬚
⬚⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚⬚⬚⬚⬚⬚⬚⬚
`,
    offset: { x: 7, y: 0 },
    rotations: [0, 90, 180, 270],
    prob: 0.25,
  },
];

export default VINE_A;
