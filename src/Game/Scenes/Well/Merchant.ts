import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { MERCHANT_INVENTORY } from "../../WorldState";
import {
  createGameInteraction,
  createKillInteraction,
  createKillPlayerCallback,
  createSuccessfullPickpocketInteraction,
} from "../../helpers";
import { buyItem } from "../../items";

const MERCHANT_KEY = "Merchant Ian";

class Merchant extends NPC {}

export const createMerchant = (pos: Vec2) =>
  new Merchant(
    pos,
    MERCHANT_KEY,
    IMAGES_KEY.merchant,
    {
      init: "Hello! What can I get for you today?",
      options: [],
    },
    [
      ...MERCHANT_INVENTORY.map((item, index) =>
        createGameInteraction(
          String(index + 1),
          ...buyItem(item, (ws) => ws.merchant)
        )
      ),
      createSuccessfullPickpocketInteraction(MERCHANT_KEY, 1),
      createKillInteraction("What?? Guards!!", createKillPlayerCallback()),
    ]
  );
