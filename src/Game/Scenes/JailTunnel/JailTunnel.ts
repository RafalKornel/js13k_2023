import { createHorizontalTunnel } from "../../helpers";
import { SCENE_KEYS } from "../constants";
import { createExecutioner } from "./Executioner";

export const createJailTunnel = () => {
  const jailTunnel = createHorizontalTunnel(
    SCENE_KEYS.jailTunnel,
    SCENE_KEYS.jail,
    SCENE_KEYS.well
  );

  jailTunnel.addChild(createExecutioner());

  return jailTunnel;
};
