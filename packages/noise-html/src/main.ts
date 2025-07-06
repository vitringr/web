/*

  Needs a heavy refactor.

*/

import { Noise } from "@utilities/noise";

function getIDString(x: number, y: number) {
  return "box_" + x + "_" + y;
}

const rows = 40;
const cols = 40;

export function main(canvas: any) {
  canvas.width = canvas.height = "1px";

  const container = document.createElement("div");
  // container.style.border = "1px solid yellow";

  container.style.width = "fit-content";
  container.style.height = "fit-content";

  container.style.display = "flex";
  container.style.flexDirection = "column";

  container.style.justifyContent = "center";
  container.style.textAlign = "center";
  container.style.textWrap = "nowrap";

  document.body.appendChild(container);

  for (let y = 0; y < cols; y++) {
    const row = document.createElement("div");
    // row.style.border = "1px solid orange";

    row.style.margin = "auto";

    row.style.display = "flex";
    row.style.flexDirection = "row";

    for (let x = 0; x < rows; x++) {
      const box = document.createElement("div");

      box.id = getIDString(x, y);

      // box.style.border = "1px solid red";

      box.style.width = "20px";
      box.style.height = "20px";

      box.innerText = " ";

      box.style.display = "flex";

      box.style.justifyContent = "center";
      box.style.alignItems = "center";

      box.style.font = "20px monospace";
      box.style.textAlign = "center";
      box.style.textWrap = "nowrap";
      box.style.color = "#aaa";
      box.style.textRendering = "optimizeSpeed";

      row.appendChild(box);
    }

    container.appendChild(row);
  }

  enum Letters {
    One = " ",
    Two = ".",
    Three = "~",
    Four = "c",
    Five = "#",
  }

  const boxes: { div: HTMLDivElement; lastLetter: Letters }[][] = [];

  for (let x = 0; x < rows; x++) {
    boxes.push([]);
    for (let y = 0; y < cols; y++) {
      const box = document.getElementById(getIDString(x, y)) as HTMLDivElement;
      boxes[x].push({ div: box, lastLetter: Letters.One });
    }
  }

  const frequency = 0.08;

  let time = 0;
  const animation = () => {
    time += 0.0036;

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        const box = boxes[x][y];

        const xNoise = x * frequency + time;
        const yNoise = y * frequency + time;
        const noise = Noise.Simplex.get(xNoise, yNoise);

        let newLetter: Letters;

        if (noise < 0.2) newLetter = Letters.One;
        else if (noise < 0.4) newLetter = Letters.Two;
        else if (noise < 0.6) newLetter = Letters.Three;
        else if (noise < 0.8) newLetter = Letters.Four;
        else newLetter = Letters.Five;

        if (newLetter != box.lastLetter) {
          box.div.innerText = newLetter;
          box.lastLetter = newLetter;
        }
      }
    }

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
