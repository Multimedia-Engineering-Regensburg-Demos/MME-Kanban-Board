/* eslint-env browser */


/**
 * Das zentrale Module der Anwendung (app.js) initalisiert sowohl das Board (logische
 * Repräsentation der Karten und Listen) als auch das BoardView (Darstellung des in
 * Board gespeicherten Anwendungszustands). Die notwendigen Protoypen werden hier importiert.
 */

import Board from "./Board.js";
import BoardView from "./BoardView.js";


/**
 * Lokale Variablen für die konkreten Objekte, die auf Basis der importierten Prototypen
 * erstellt werden.
 */

var board,
  boardView;

/** 
 * Einstiegspunkt in die Anwendung. Diese Methode wird beim Einlesen des Moduls durch den Aufruf
 * in der letzten Zeile dieser Datei ausgeführt.
 */

function init() {
  initBoard();
  initUI();
}

function initBoard() {
  board = new Board();
  /**
   * Das zentrale Modul agiert als Observer und registriert Callbacks für
   * die Events, die vom Board (Observable) ausgesendet werden.
   */ 
  board.addEventListener("cardCreated", onCardCreated);
  board.addEventListener("cardMoved", onCardMoved);
}

function initUI() {
  /**
   * Auswahl der notwendigen UI-Elemente über die DOM-API und Initialisierung des BoardViews.
   * Der UI-Bereich, in dem das eigentliche Board dargestellt wird, wird hier vor-selektiert
   * und an das BoardView übergeben. Der Ansatz ("Dependency injection") ermöglicht es dem View,
   * mit den notwendigen UI-Elementen zu arbeiten, ohne das die Auswahl, einhergehend mit den
   * entsprechenden Kenntnissen über die HTML-Struktur, im View selber statt finden muss. Der
   * View arbeitet mit einem beliebigen Board-Element, das konkrete UI-Element wird von einem 
   * strukturell übergeordneten Objekt bereitgestellt.
   * 
   * (Vgl. https://en.wikipedia.org/wiki/Dependency_injection)
   */
  let boardEl = document.querySelector("#board"),
    cardButton = document.querySelector(".button.new-card");
  boardView = new BoardView(boardEl);
  boardView.addEventListener("elementTextUpdated", onElementTextUpdated);
  boardView.addEventListener("moveButtonClicked",
    onElementMoveButtonClicked);
  /**
   * Registrierung einer Callback-Methode für den nativen "click"-Event des Buttons. 
   * Maus- und Tastatur-Events können über jedes beliebige, selektierte HTML-Element 
   * abgefangen werden.
   */
  cardButton.addEventListener("click", onNewCardButtonClicked);
}

// Callback für Ereignisverarbeitung
function onCardCreated(event) {
  boardView.renderCard(event.card);
}

// Callback für Ereignisverarbeitung
function onCardMoved(event) {
  boardView.renderCard(event.card);
}

// Callback für Ereignisverarbeitung
function onNewCardButtonClicked() {
  board.createNewCard();
}

// Callback für Ereignisverarbeitung
function onElementTextUpdated(event) {
  board.updateCardText(event.cardID, event.value);
}

// Callback für Ereignisverarbeitung
function onElementMoveButtonClicked(event) {
  if (event.value === "right") {
    board.moveCardRight(event.cardID);
  } else if (event.value === "left") {
    board.moveCardLeft(event.cardID);
  }
}

init();