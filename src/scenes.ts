import { SceneKey, Scene } from "./Engine/Scene";
import { CONFIG } from "./Engine/config";

const createHorizontalTunnel = (left: SceneKey, right: SceneKey): Scene =>
  new Scene(
    `horizontal-${left}-${right}`,
    [CONFIG.width, CONFIG.height / 4],
    [0, CONFIG.height / 2 - 1.5],
    "#9e3333",
    {
      l: left,
      r: right,
    }
  );

const createVerticalTunnel = (top: SceneKey, down: SceneKey): Scene =>
  new Scene(
    `vertical-${top}-${down}`,
    [CONFIG.width / 4, CONFIG.height],
    [CONFIG.width / 2 - 2, 0],
    "#9e3333",
    {
      t: top,
      d: down,
    }
  );

// const SCENES = ["initial", "a", "b", "c", "d"] as const;
// const TUNNELS = ["horizontal", "vertical"] as const;

const tunnelInitA = createHorizontalTunnel("a", "initial");

const tunnelInitC = createVerticalTunnel("c", "initial");

const sceneInitial = new Scene(
  "initial",
  [CONFIG.width, CONFIG.height],
  [0, 0],
  "#9e3333",
  {
    l: tunnelInitA.sceneKey,
    r: "b",
    t: tunnelInitC.sceneKey,
    d: "d",
  }
);

const sceneA = new Scene(
  "a",
  [CONFIG.width, CONFIG.height],
  [0, 0],
  "#9e3333",
  {
    r: tunnelInitA.sceneKey,
  }
);

const sceneB = new Scene(
  "b",
  [CONFIG.width, CONFIG.height],
  [0, 0],
  "#9e3333",
  {
    l: "initial",
  }
);

const sceneC = new Scene(
  "c",
  [CONFIG.width, CONFIG.height],
  [0, 0],
  "#9e3333",
  {
    d: tunnelInitC.sceneKey,
  }
);

const sceneD = new Scene(
  "d",
  [CONFIG.width, CONFIG.height],
  [0, 0],
  "#9e3333",
  {
    t: "initial",
  }
);

export const scenes: Scene[] = [
  sceneInitial,
  sceneA,
  sceneB,
  sceneC,
  sceneD,
  tunnelInitA,
  tunnelInitC,
];
