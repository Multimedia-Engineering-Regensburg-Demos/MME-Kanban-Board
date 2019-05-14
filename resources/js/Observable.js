/* eslint-env browser */

/**
 * Prototyp zur Bereitstellung der Observable-Funktion. Mittels Prototypen-Vererbung
 * können die Funktionen (Liste aller Listener bzw. Callbacks, API zur Registierung 
 * neuer Callbacks und Funktion zum Broadcasting eines Events an alle registrierten
 * Obervers) in andere Prototypen integriert werden.
 */

class Observable {
  constructor() {
    /**
     * Erstellt ein leeres Objekt, das als Speicher für alle registrierten Callback-
     * Methoden dient. Für jeden unterschiedlichen Event-Typ werden bei Bedarf separate 
     * Arrays als Eigenschaft in diesem Objekt gespeichert. Der Event-Typ dient als
     * Eigenschaftsname.
     */
    this.listener = {};
  }

  /**
   * Ruft alle Callback-Methoden auf, die für die entsprechende Event-Art (event.type)
   * registriert worden sind. Beim Aufruf der einzelnen Methoden wird der an notifiyAll
   * übergebene Event als Parameter verwendet.
   */
  notifyAll(event) {
    let callbacks = this.listeners[event.type];
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](event);
      }
    }
  }

  /**
   * Speichert die übergebene Callback-Methode im entsprechenden Array in this.listeners.
   * Falls in dem Objekt noch keine entsprechende Liste vorhanden ist (Beim erstmaligen
   * Registrieren eines bestimmten Event-Typen) wird ein neues, leeres Array erstellt.
   */
  addEventListener(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

}

/**
 * Prototyp zur Repräsentation eines allgemeinen Events. Kann erweitert werden,
 * um spezielle Ereignisse mit besonderer "Payload" (https://en.wikipedia.org/wiki/Payload_(computing))
 * zu kommunizieren.
 */

class Event {
  constructor(type) {
    this.type = type;
  }
}

/**
 * (Named) Export der beiden erstellten Prototypen Observable und Event.
 */

export { Observable, Event };