import { IMAGES_KEY } from "../../assets";
import { NPC } from "../NPC";
import {
  createFailedPickpocketInteraction,
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
} from "../helpers";

const KILL_TEXT = "Slices you with his axe";
const INTERACTION_TEXT = `What are you trying to do??\n${KILL_TEXT}`;
const EXECUTIONER_KEY = "Executioner";

export const createExecutioner = () => {
  const executioner = new NPC(
    [1, 7],
    EXECUTIONER_KEY,
    IMAGES_KEY.executioner,
    {
      init: "Hmmm?",
      options: [
        createGameInteraction(
          "1",
          "Hey, what are you doing here?",
          `What do you think? I will be\nexecuting one of those filthy prisoners...\nWait! You are a prisoner!\n${KILL_TEXT}`,
          createKillPlayerCallback(4)
        ),
      ],
    },
    [
      createFailedPickpocketInteraction(EXECUTIONER_KEY, KILL_TEXT),
      createKillInteraction(INTERACTION_TEXT, createKillPlayerCallback(2)),
    ]
  );

  return executioner;
};
