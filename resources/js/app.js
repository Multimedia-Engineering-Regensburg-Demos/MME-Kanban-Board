/* eslint-env browser */

import Card from "./Card.js"
;
function init() {
	console.log("Starting Kanban-Board");
	let myCard = new Card(42);
	console.log(myCard);
}

init();