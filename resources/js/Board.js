/* eslint-env browser */

import { Observable } from "./Observable.js";
import { Card, CardEvent } from "./Card.js";

const LIST_NAMES = ["open", "processing", "closed"];


/**
 * Prototyp zur logischen Repräsentation des Boards. Hier werden alle Karten
 * erstellt, gespeichert und zu den verschiedenen Listen des Board hinzugefügt. 
 * Board "erbt" vom importierten Observable-Prototyp. Veränderungen an den ver-
 * walteten Karten werden über Events an registrierte Observer weitergegeben.
 */
class Board extends Observable {
  constructor() {
    super();
    this.listeners = {};
    this.cards = [];
  }

  /**
   * Erzeugen einer neuen ID auf Basis der Anzahl aktuell gespeicherten Karten.
   */
  createCardID() {
    return this.cards.length + 1;
  }

  /**
   * Erstellt ein neues Card-Objekt. Alle neue Karten werden in die erste ("linke")
   * Spalte einsortiert und mit einem Platzhaltertext initialisiert. Registrierte Listener
   * werden über einen Event über die neue Karte informiert.
   */
  createNewCard() {
    let cardID = this.createCardID(),
      card = new Card(cardID, "New Task", LIST_NAMES[0]);
    this.cards.push(card);
    this.notifyAll(new CardEvent("cardCreated", card));
  }

  findCardByID(id) {
    for (let i = 0; i < this.cards.length; i++) {
      let card = this.cards[i];
      if (card.id === id) {
        return card;
      }
    }
    return undefined;
  }

  findListPosition(listName) {
    for (let i = 0; i < LIST_NAMES.length; i++) {
      if (LIST_NAMES[i] === listName) {
        return i;
      }
    }
    return undefined;
  }

  updateCardText(id, text) {
    let card = this.findCardByID(id);
    if (card) {
      card.text = text;
      this.notifyAll(new CardEvent("cardUpdated", card));
    }
  }

  moveCard(id, shift) {
    let card = this.findCardByID(id),
      currentListPositon = this.findListPosition(card.list),
      newListName = LIST_NAMES[currentListPositon + shift];
    if (newListName) {
      card.list = newListName;
      this.notifyAll(new CardEvent("cardMoved", card));
    }
  }

  moveCardLeft(id) {
    this.moveCard(id, -1);
  }

  moveCardRight(id) {
    this.moveCard(id, 1);
  }

}

export default Board;