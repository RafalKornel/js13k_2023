import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createPickpocketInteraction,
} from "../../helpers";
import { HAMMER } from "../../items";

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
      createGameInteraction(
        "1",
        "<Buy hammer (1 coin)>",
        "Here you go!",
        (ws) => {
          ws.items.add(HAMMER);
          ws.merchant.delete(HAMMER);
          ws.coins--;
        },
        (ws) => ws.coins > 1 && ws.merchant.has(HAMMER)
      ),

      createPickpocketInteraction(
        "What are you trying to do??",
        createKillPlayerCallback(2)
      ),
      createKillInteraction("What?? Guards!!", createKillPlayerCallback(2)),
    ]
  );
