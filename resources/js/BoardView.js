var KanbanApp = KanbanApp || {};

(function(app) {
  "use strict";

  function BoardView(el) {
    this.listeners = {};
    this.el = el;
    this.cardTemplate = document.querySelector("#card-template").innerHTML.trim();
  }

  BoardView.prototype.renderCard = function(card) {
    let cardEl = this.el.querySelector("[data-id=\"" + card.id + "\"]"),
      targetList = this.el.querySelector("." + card.list);
    if (!cardEl) {
      cardEl = this.createCardElement(card);
      cardEl.addEventListener("click", this.onCardClicked.bind(this));
      cardEl.querySelector(".text").addEventListener("change", this.onCardTextUpdated
        .bind(this));
    }
    if (targetList) {
      targetList.appendChild(cardEl);
    }
  };

  BoardView.prototype.createCardElement = function(card) {
    let container = document.createElement("div"),
      templateString = this.cardTemplate;
    templateString = templateString.replace("$ID", card.id);
    templateString = templateString.replace("$TEXT", card.text);
    container.innerHTML = templateString;
    return container.firstChild;
  };

  BoardView.prototype.onCardTextUpdated = function(event) {
    let cardEl = event.target.closest(".card");
    this.broadcastEvent({
      type: "elementTextUpdated",
      cardID: parseInt(cardEl.getAttribute("data-id")),
      value: event.target.value,
    });
  };

  BoardView.prototype.onCardClicked = function(event) {
    let cardEl = event.target.closest(".card");
    if (event.target.classList.contains("icon")) {
      let direction = event.target.classList.contains("left") ? "left" :
        "right";
      this.broadcastEvent({
        type: "moveButtonClicked",
        cardID: parseInt(cardEl.getAttribute("data-id")),
        value: direction,
      });
    }
  };

  BoardView.prototype.broadcastEvent = function(event) {
    let callbacks = this.listeners[event.type];
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](event);
      }
    }
  };

  BoardView.prototype.addEventListener = function(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  };

  app.BoardView = BoardView;

}(KanbanApp));