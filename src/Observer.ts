import { BaseEntity } from "./BaseEntity";
import { Direction } from "./types";

type BaseGameEvent<TData = any, TKey extends string = string> = {
  name: TKey;
  data: TData;
};

export type PlayerCollisionEvent = BaseGameEvent<
  { entity: BaseEntity; directions: Direction[] },
  "collision"
>;

export type SecondEvent = BaseGameEvent<{}, "dupa">;

type GameEvent = PlayerCollisionEvent | SecondEvent;

type Callback = (ge: BaseGameEvent) => void;

class Observer {
  private callbacksMap: Map<string, Callback[]>;

  constructor() {
    this.callbacksMap = new Map<string, Callback[]>();
  }

  registerCallback(eventName: GameEvent["name"], callback: Callback) {
    const callbacks = this.callbacksMap.get(eventName);

    if (!callbacks) {
      this.callbacksMap.set(eventName, [callback]);
    }

    callbacks?.push(callback);
  }

  emitEvent(event: GameEvent) {
    const callbacks = this.callbacksMap.get(event.name);

    if (!callbacks) return;

    callbacks.forEach((cb) => cb(event));
  }
}

export const observer = new Observer();
