/* eslint-env browser */

import { Observable, Event } from "./Observable.js"

const CARD_TEMPLATE = document.querySelector("#card-template").innerHTML.trim();

class BoardViewEvent extends Event {
  constructor(type, cardID, value) {
    super(type);
    this.cardID = cardID;
    this.value = value;
  }
}

class BoardView extends Observable {

  constructor(el) {
    super();
    this.listeners = {};
    this.el = el;
  }

  renderCard(card) {
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
  }

  createCardElement(card) {
    let container = document.createElement("div"),
      templateString = CARD_TEMPLATE;
    templateString = templateString.replace("$ID", card.id);
    templateString = templateString.replace("$TEXT", card.text);
    container.innerHTML = templateString;
    return container.firstChild;
  }

  onCardTextUpdated(event) {
    let cardEl = event.target.closest(".card"),
      cardText = event.target.value,
      cardID = parseInt(cardEl.getAttribute("data-id"))
    this.notifyAll(new BoardViewEvent("elementTextUpdated", cardID, cardText));
  }

  onCardClicked(event) {
    let cardEl = event.target.closest(".card"),
      cardID = parseInt(cardEl.getAttribute("data-id"));
    if (event.target.classList.contains("icon")) {
      let direction = event.target.classList.contains("left") ? "left" :
        "right";
      this.notifyAll(new BoardViewEvent("moveButtonClicked", cardID,
        direction));
    }
  }

}

export default BoardView;