export type BaseGameEvent<TKey extends string = string, TData = any> = {
  name: TKey;
  data: TData;
};

type Callback<TEvent> = (ge: TEvent) => void;

class Observer {
  private callbacksMap: Map<string, Callback<any>[]>;

  constructor() {
    this.callbacksMap = new Map<string, Callback<any>[]>();
  }

  registerCallback<TEvent extends BaseGameEvent>(
    eventName: TEvent["name"],
    callback: Callback<TEvent>
  ) {
    const callbacks = this.callbacksMap.get(eventName);

    if (!callbacks) {
      this.callbacksMap.set(eventName, [callback]);
    }

    callbacks?.push(callback);
  }

  emitEvent<TEvent extends BaseGameEvent>(event: TEvent) {
    const callbacks = this.callbacksMap.get(event.name);

    if (!callbacks) return;

    callbacks.forEach((cb) => cb(event));
  }
}

export const observer = new Observer();
