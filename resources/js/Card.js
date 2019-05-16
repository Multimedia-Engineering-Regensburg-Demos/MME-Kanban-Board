/* eslint-env browser */

import { Observable, Event } from "./Observable.js";

class Card {

  constructor(id, text, list) {
    this.id = id;
    this.text = text;
    this.list = list;
  }

}

class CardEvent extends Event {

  constructor(type, card) {
    super(type);
    this.card = card;
  }

}

export { Card, CardEvent };