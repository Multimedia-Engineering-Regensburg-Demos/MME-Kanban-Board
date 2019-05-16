/* eslint-env browser */

/**
 * Importiert werden hier keine Konstruktor-Funktionen sondern die
 * bereits initialisierten und direkt verwendbaren Objekte
 */
import Board from "./Board.js";
import BoardView from "./BoardView.js";

function init() {
  initBoard();
  initBoardView();
}

function initBoard() {
  Board.addEventListener("cardCreated", onCardCreated);
  Board.addEventListener("cardMoved", onCardMoved);
}

function initBoardView() {
  let boardEl = document.querySelector("#board"),
    cardButton = document.querySelector(".button.new-card");
  BoardView.setElement(boardEl);
  BoardView.addEventListener("elementTextUpdated", onElementTextUpdated);
  BoardView.addEventListener("moveButtonClicked",
    onElementMoveButtonClicked);
  cardButton.addEventListener("click", onNewCardButtonClicked);
}

function onCardCreated(event) {
  BoardView.renderCard(event.card);
}

function onCardMoved(event) {
  BoardView.renderCard(event.card);
}

function onNewCardButtonClicked() {
  Board.createCard();
}

function onElementTextUpdated(event) {
  Board.updateCard(event.cardID, event.text);
}

function onElementMoveButtonClicked(event) {
  if (event.direction === "right") {
    Board.moveCardToRight(event.cardID);
  } else if (event.direction === "left") {
    Board.moveCardToLeft(event.cardID);
  }
}

init();