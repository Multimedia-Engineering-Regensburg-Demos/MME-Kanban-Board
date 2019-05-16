/* eslint-env browser */

class Observable {
  constructor() {
    this.listeners = {};
  }

  notifyAll(event) {
    let callbacks = this.listeners[event.type];
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](event);
      }
    }
  }

  addEventListener(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

}

class Event {
  constructor(type) {
    this.type = type;
  }
}

export { Observable, Event };