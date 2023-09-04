import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createPickpocketInteraction,
} from "../../helpers";
import { HAMMER, POISON, buyItem } from "../../items";

const MERCHANT_KEY = "Merchant";

class Merchant extends NPC {}

export const createMerchant = (pos: Vec2) =>
  new Merchant(
    pos,
    MERCHANT_KEY,
    IMAGES_KEY.hero,
    {
      init: "Hello! What can I get for you today?",
      options: [],
    },
    [
      createGameInteraction("1", ...buyItem(HAMMER, (ws) => ws.merchant)),
      createGameInteraction("2", ...buyItem(POISON, (ws) => ws.merchant)),

      createPickpocketInteraction(
        "What are you trying to do??",
        createKillPlayerCallback(2)
      ),
      createKillInteraction("What?? Guards!!", createKillPlayerCallback(2)),
    ]
  );
