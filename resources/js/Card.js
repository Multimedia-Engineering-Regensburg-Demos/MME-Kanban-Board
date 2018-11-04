var KanbanApp = KanbanApp || {};

(function(app) {
	"use strict";

	function Card(id, text, list) {
		this.id = id;
		this.text = text;
		this.list = list;
	}

	app.Card = Card;

}(KanbanApp));