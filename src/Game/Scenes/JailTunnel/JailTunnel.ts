import { createHorizontalTunnel } from "../../helpers";
import { SCENE_KEYS } from "../constants";
import { createExecutioner } from "./Executioner";

export const createJailTunnel = () => {
  const jailTunnel = createHorizontalTunnel(
    SCENE_KEYS.jailTunnel,
    SCENE_KEYS.jail
  );

  jailTunnel.addChild(createExecutioner());

  return jailTunnel;
};
