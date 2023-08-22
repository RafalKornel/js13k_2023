import { Portal } from "../Portal";
import { BaseEntity } from "./BaseEntity";
import { Direction } from "./types";

// TODO: REFACTORY TYPES

type BaseGameEvent<TData = any, TKey extends string = string> = {
  name: TKey;
  data: TData;
};

export type SolidCollisionEvent = BaseGameEvent<
  { entity: BaseEntity; directions: Direction[] },
  "solid-collision"
>;

export type OpaqueCollisionEvent = BaseGameEvent<
  { entity: BaseEntity },
  "opaque-collision"
>;

export type WallCollisionEvent = BaseGameEvent<
  { direction: Direction },
  "wall-collision"
>;

export type PortalCollisionEvent = BaseGameEvent<
  { portal: Portal },
  "portal-collision"
>;

type GameEvent =
  | SolidCollisionEvent
  | WallCollisionEvent
  | OpaqueCollisionEvent
  | PortalCollisionEvent;

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
