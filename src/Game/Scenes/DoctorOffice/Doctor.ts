import { Vec2 } from "../../../Engine/types";
import { IMAGES_KEY } from "../../../assets";
import { NPC } from "../../NPC";
import { createGameInteraction, withTimeout } from "../../helpers";
import { BREAD, POISON } from "../../items";
import { LAUNDRESS_KEY } from "../Laundry/Laundress";

export const DOCTOR_KEY = "Doctor Zoid";

class Doctor extends NPC {}

export const createDoctor = (pos: Vec2) =>
  new Doctor(
    pos,
    DOCTOR_KEY,
    IMAGES_KEY.doctor,
    {
      init: "This vein here... Oh! Hello!\nSorry, I didn't notice you...\nI am working on something extremely important...\nBut you wouldn't understand...\nAnd you probably don't care...\n<Stops and looks at his patient>\nI've been working for three days straight\nand I'm starving! But I can't finish now, I'm\nreaching breakthrough!\nCan you get me something to eat?",
      voice: "player2",
      options: [
        createGameInteraction(
          "1",
          "Do you have any poison left?",
          "What? Poison? Why would you need it?\nYou know, nevermind.\nTake this and leave me alone.",
          (ws) => {
            ws.items.add(POISON.key);
          },
          (ws) => ws.didHelpDoctor
        ),
        createGameInteraction(
          "2",
          "Laundress is extremely ill!",
          "Oh my! Then I will go there immediately!\nMy research can wait... Right?",
          (ws) => {
            withTimeout(() => {
              ws.willDoctorExamineLaundress = true;
            }, 4);
          },
          (ws) =>
            ws.didHelpDoctor &&
            ws.firstInteractions.has(LAUNDRESS_KEY) &&
            !ws.killedEntities.has(LAUNDRESS_KEY)
        ),
      ],
    },
    [
      createGameInteraction(
        "q",
        "Take this bread.",
        "Thanks! Can I maybe do something for you?",
        (ws) => {
          ws.didHelpDoctor = true;
          ws.items.delete(BREAD.key);
        },
        (ws) => ws.items.has(BREAD.key)
      ),
    ]
  );
