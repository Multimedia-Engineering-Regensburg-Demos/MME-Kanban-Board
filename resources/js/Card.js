/* eslint-env browser */

import { Event } from "./Observable.js";

/**
 * Prototyp zur Repräsentation einer einzelnen (logischen) Karte im Board.
 */

class Card {

  constructor(id, text, list) {
    this.id = id;
    this.text = text;
    this.list = list;
  }

}

/**
 * Prototyp zur Kommunikation von Events im Kontext einer Karte. Basiert auf
 * dem importierten Event-Prototypen.
 */

class CardEvent extends Event {

  constructor(type, card) {
    super(type);
    this.card = card;
  }

}

/**
 * (Named) Export der beiden erstellten Prototypen Card und CardEvent.
 */

export { Card, CardEvent };