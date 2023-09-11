import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction, createKillPlayerCallback } from "../../helpers";

const GUARD_KEY = "Guard";

class Guard extends NPC {}

export const createGuard = (pos: Vec2) =>
  new Guard(
    pos,
    GUARD_KEY,
    IMAGES_KEY.guard,
    {
      init: "Hey! What are you looking at?\nDo you want to use exit?\nThe door is closed and only\ncitizens of underground city have key.\nDo you have your key or what?",
      // init: "You can use these doors to exit\nto the surface.\nBut only if you have a key!",
      options: [
        createGameInteraction(
          "1",
          "What key? I come from prison...",
          "What? You escaped? Get here you scumbag!\n<Slashes you with sword>",
          createKillPlayerCallback(3)
        ),
        createGameInteraction(
          "2",
          "Yeah, sure, I was just looking",
          "All right, then don't bother me."
        ),
      ],
    },
    []
  );
