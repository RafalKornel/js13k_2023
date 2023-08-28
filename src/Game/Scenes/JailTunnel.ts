import { createHorizontalTunnel } from "../helpers";
import { SCENE_KEYS } from "./constants";

export const createJailTunnel = () => {
  const jailTunnel = createHorizontalTunnel(
    SCENE_KEYS.jailTunnel,
    SCENE_KEYS.jail
  );

  return jailTunnel;
};
