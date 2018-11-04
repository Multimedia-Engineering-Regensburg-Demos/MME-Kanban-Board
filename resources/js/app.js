var KanbanApp = KanbanApp || {};

(function(app) {
  "use strict";

  var board,
    boardView;

  function init() {
    initBoard();
    initUI();
  }

  function initBoard() {
    board = new app.Board();
    board.addEventListener("cardCreated", onCardCreated);
    board.addEventListener("cardMoved", onCardMoved);
  }

  function initUI() {
    let boardEl = document.querySelector("#board"),
      cardButton = document.querySelector(".button.new-card");
    boardView = new app.BoardView(boardEl);
    boardView.addEventListener("elementTextUpdated", onElementTextUpdated);
    boardView.addEventListener("moveButtonClicked",
      onElementMoveButtonClicked);
    cardButton.addEventListener("click", onNewCardButtonClicked);
  }

  function onCardCreated(event) {
    boardView.renderCard(event.card);
  }

  function onCardMoved(event) {
    boardView.renderCard(event.card);
  }

  function onNewCardButtonClicked() {
    board.createNewCard();
  }

  function onElementTextUpdated(event) {
    board.updateCardText(event.cardID, event.value);
  }

  function onElementMoveButtonClicked(event) {
    if (event.value === "right") {
      board.moveCardRight(event.cardID);
    } else if (event.value === "left") {
      board.moveCardLeft(event.cardID);
    }
  }

  init();

}(KanbanApp));