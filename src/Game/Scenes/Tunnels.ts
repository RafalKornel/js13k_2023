import { createTunnel } from "../helpers";
import { createExecutioner } from "./Executioner";
import { SCENE_KEYS, TUNNELS } from "./constants";

export const createWellBottomTunnel = () =>
  createTunnel(TUNNELS.wd, "v", {
    t: SCENE_KEYS.well,
    d: SCENE_KEYS.bakery,
  });

export const createWellTopTunnel = () =>
  createTunnel(TUNNELS.wt, "v", {
    t: SCENE_KEYS.laundry,
    d: SCENE_KEYS.well,
  });

export const createWellRightTunnel = () =>
  createTunnel(TUNNELS.wr, "h", {
    l: SCENE_KEYS.well,
    t: SCENE_KEYS.tavern,
    d: SCENE_KEYS.doctorOffice,
  });

export const createWellLeftTunnel = () => {
  const jailTunnel = createTunnel(TUNNELS.wl, "h", {
    d: SCENE_KEYS.jail,
    r: SCENE_KEYS.well,
  });

  jailTunnel.addChild(createExecutioner());

  return jailTunnel;
};

export const createStashTavertTunnel = () =>
  createTunnel(TUNNELS.st, "h", {
    l: SCENE_KEYS.tavern,
    r: SCENE_KEYS.stash,
  });
