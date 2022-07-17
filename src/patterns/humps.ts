import { Pass } from "../nature/elements";

const HUMPS: Array<Pass> = [
  {
    find: `
⬚⬚▤⬚⬚
⬚⬚▤⬚⬚
⬚▤⬚▤⬚
▤⬚⬚⬚▤
⬚⬚⬚⬚⬚
`,
    replace: `
⬚⬚▦⬚⬚
⬚⬚▦⬚⬚
⬚▦⬚▦⬚
▦⬚⬚⬚▦
⬚⬚⬚⬚⬚
`,
    rotations: [0, 90, 180, 270],
    prob: 0.25,
  },
  {
    find: `
⬚⬚▦⬚⬚
⬚⬚▦⬚⬚
⬚▦⬚▦⬚
▦⬚⬚⬚▦
⬚⬚⬚⬚⬚
`,
    replace: `
⬚⬚⬚▦⬚⬚⬚▦⬚
▦⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚▦⬚⬚⬚⬚▦⬚
⬚⬚⬚⬚⬚⬚⬚⬚▦
⬚⬚⬚⬚⬚⬚⬚⬚⬚
⬚⬚▦⬚⬚⬚▦⬚⬚
⬚▦⬚▦⬚▦⬚▦⬚
▦⬚⬚⬚▦⬚⬚⬚▦
⬚⬚⬚⬚⬚⬚⬚⬚⬚
`,
    rotations: [0, 90, 180, 270],
    prob: 0.4,
  },
];

export default HUMPS;
