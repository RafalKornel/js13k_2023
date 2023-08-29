import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createPickpocketInteraction,
} from "../../helpers";

const KILL_TEXT = "<Slices you with his axe>";
const INTERACTION_TEXT = `What are you trying to do??\n${KILL_TEXT}`;

export const createExecutioner = () => {
  const executioner = new NPC(
    [6, 7],
    "Executioner",
    IMAGES_KEY.hero,
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
      createPickpocketInteraction(
        INTERACTION_TEXT,
        createKillPlayerCallback(2)
      ),
      createKillInteraction(INTERACTION_TEXT, createKillPlayerCallback(2)),
    ]
  );

  return executioner;
};
