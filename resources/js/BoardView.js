/* eslint-env browser */

import { Observable, Event } from "./Observable.js";

const CARD_TEMPLATE = document.querySelector("#card-template").innerHTML.trim();

/**
 * Generische Template-Funktion
 *
 * Die Funktion durchsucht den als template-Paramter übergebenen String
 * auf Platzhalter, die im Format "{{PLATZHALTER_NAME}}" notiert sind. Für
 * jeden gefunden Platzhalter wird nach einer korrespondierenden Eigenschaft 
 * (gleicher Name) im übergebenen data-Objekt gesucht. Liegt eine Übereinstimmung
 * vor, wird der Platzhalter durch den entsprechenden Eigenschaftswert ersetzt.
 *
 * Auf Basis des so manipulierten Template-Strings wird anschließend ein neues
 * HTML-Element erstellt und zurückgegeben.
 */
function createElementFromTemplate(template, data) {
  let templateString = template,
    container = document.createElement("div"),
    regExp = /{{([^}]+)}/g,
    currentMatch = regExp.exec(templateString);
  while (currentMatch !== null) {
    let key = currentMatch[1];
    if (data.hasOwnProperty(key)) {
      let regex = new RegExp(`{{${key}}}`, "g");
      templateString = templateString.replace(regex, data[key]);
    }
    currentMatch = regExp.exec(templateString)
  }
  container.innerHTML = templateString;
  return container.firstChild;
}

class BoardViewUpdateEvent extends Event {
  constructor(cardID, text) {
    super("elementTextUpdated");
    this.cardID = cardID;
    this.text = text;
  }
}

class BoardViewMoveEvent extends Event {
  constructor(cardID, direction) {
    super("moveButtonClicked");
    this.cardID = cardID;
    this.direction = direction;
  }
}

class BoardView extends Observable {

  constructor() {
    super();
  }

  setElement(el) {
    this.el = el;
  }

  renderCard(card) {
    let cardEl = this.el.querySelector("[data-id=\"" + card.id + "\"]"),
      targetList = this.el.querySelector("." + card.list);
    if (!cardEl) {
      cardEl = createElementFromTemplate(CARD_TEMPLATE, card);
      cardEl.addEventListener("click", this.onCardClicked.bind(this));
      cardEl.querySelector(".text").addEventListener("change", this.onCardTextUpdated.bind(this));
    }
    if (targetList) {
      targetList.appendChild(cardEl);
    }
  }

  onCardTextUpdated(event) {
    let cardEl = event.target.closest(".card"),
      cardText = event.target.value,
      cardID = parseInt(cardEl.getAttribute("data-id"))
    this.notifyAll(new BoardViewUpdateEvent(cardID, cardText));
  }

  onCardClicked(event) {
    let cardEl = event.target.closest(".card"),
      cardID = parseInt(cardEl.getAttribute("data-id"));
    if (event.target.classList.contains("icon")) {
      let direction = event.target.classList.contains("left") ? "left" : "right";
      this.notifyAll(new BoardViewMoveEvent(cardID, direction));
    }
  }

}

/**
 * Aus dem Modul herausgegeben wird eine "instanziierte", funktionierende Version
 * des BoardViews. Die importierende Stelle muss das HTML-Element, auf dem operiert
 * wird, noch über die bereitgestellte setElement-Funktion setzten.
 *
 * Interne Funktionen (Templating) sowie die Event-Prototypen werden nicht nach Außen 
 * gegeben und existieren nur hier im Modul.
 */
export default new BoardView();