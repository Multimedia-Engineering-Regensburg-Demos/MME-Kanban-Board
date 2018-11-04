var KanbanApp = KanbanApp || {};

(function(app) {
  "use strict";

  const LIST_NAMES = ["open", "processing", "closed"];

  function Board() {
    this.listeners = {};
    this.cards = [];
  }

  Board.prototype.createCardID = function() {
    return this.cards.length + 1;
  };

  Board.prototype.createNewCard = function() {
    let cardID = this.createCardID(),
      card = new app.Card(cardID, "New Task", LIST_NAMES[0]);
    this.cards.push(card);
    this.broadcastEvent({
      type: "cardCreated",
      card: card,
    });
  };

  Board.prototype.findCardByID = function(id) {
    for (let i = 0; i < this.cards.length; i++) {
      let card = this.cards[i];
      if (card.id === id) {
        return card;
      }
    }
    return undefined;
  };

  Board.prototype.findListPosition = function(listName) {
    for (let i = 0; i < LIST_NAMES.length; i++) {
      if (LIST_NAMES[i] === listName) {
        return i;
      }
    }
    return undefined;
  };

  Board.prototype.updateCardText = function(id, text) {
    let card = this.findCardByID(id);
    if (card) {
      card.text = text;
      this.broadcastEvent({
        type: "cardUpdated",
        card: card,
      });
    }
  };

  Board.prototype.moveCardLeft = function(id) {
    let card = this.findCardByID(id),
      currentListPositon = this.findListPosition(card.list),
      newListName = LIST_NAMES[currentListPositon - 1];
    if (newListName) {
      card.list = newListName;
      this.broadcastEvent({
        type: "cardMoved",
        card: card,
      });
    }
  };

  Board.prototype.moveCardRight = function(id) {
    let card = this.findCardByID(id),
      currentListPositon = this.findListPosition(card.list),
      newListName = LIST_NAMES[currentListPositon + 1];
    if (newListName) {
      card.list = newListName;
      this.broadcastEvent({
        type: "cardMoved",
        card: card,
      });
    }
  };

  Board.prototype.broadcastEvent = function(event) {
    let callbacks = this.listeners[event.type];
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](event);
      }
    }
  };

  Board.prototype.addEventListener = function(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  };

  app.Board = Board;

}(KanbanApp));