/* eslint-env browser */

import { Observable } from "./Observable.js";
import { Card, CardEvent } from "./Card.js";

const LIST_NAMES = ["open", "processing", "closed"],
  DEFAULT_CARD_TEXT = "New Task",
  DEFAULT_LIST = LIST_NAMES[0];

/**
 *  Alle Karten werden in einer Map gespeichert. Die ID der jeweiligen Karte wird
 *  als Schlüssel verwendet.
 *
 * Siehe auch: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
var cards = new Map();

function createCardID() {
  return cards.size + 1;
}

function getListsPosition(listname) {
  let position = LIST_NAMES.indexOf(listname);
  if (position === -1) {
    return undefined;
  }
  return position;
}

function createNewCard() {
  let cardID = createCardID(),
    card = new Card(cardID, DEFAULT_CARD_TEXT, DEFAULT_LIST);
  cards.set(card.id, card);
  return card;
}

function updateCard(card) {

}

function updateCardWithID(id, newText) {
  let card = cards.get(id);
  if (card) {
    card.text = newText;
    return card;
  }
  return null;
}

function moveCardInDirection(id, shift) {
  let card = cards.get(id),
    currentListPositon = getListsPosition(card.list),
    newListName = LIST_NAMES[currentListPositon + shift];
  if (newListName) {
    card.list = newListName;
    return card;
  }
  return null;
}

class Board extends Observable {

  constructor() {
    super();
  }

  createCard() {
    let card = createNewCard();
    if (card !== null) {
      this.notifyAll(new CardEvent("cardCreated", card));
    }
  }

  updateCard(id, text) {
    let card = updateCardWithID(id, text);
    if (card !== null) {
      this.notifyAll(new CardEvent("cardUpdated", card));

    }
  }

  moveCardToLeft(id) {
    let card = moveCardInDirection(id, -1);
    if (card !== null) {
      this.notifyAll(new CardEvent("cardMoved", card));
    }
  }

  moveCardToRight(id) {
    let card = moveCardInDirection(id, 1);
    if (card !== null) {
      this.notifyAll(new CardEvent("cardMoved", card));
    }
  }

}

/**
 * Aus dem Modul herausgegeben wird eine "instanziierte" Version des Proxy-Objekts,
 * dessen Methoden die modul-internen, nicht nach Außen gegebenen, Funktionen nutzt.
 */
export default new Board();