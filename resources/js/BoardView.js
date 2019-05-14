/* eslint-env browser */

import { Observable, Event } from "./Observable.js"

/**
 * Konstante zur Speicherung des HTML-Strings, auf dessen Basis alle HTML-Elemente zur
 * Darstellung der Karten erstellt werden. Die Vorlage (Template) wird im HTML-Dokument
 * im Element mit der ID "card-template" gespeichert. Es handelt sich um ein <template>-
 * Tag, der beim Rendern des HTML-Dokuments nicht berücksichtigt wird. Durch diese Art
 * von Tags können Sie (HTML-) Inhalte für die spätere Verwendung während der Laufzeit 
 * der Anwendung verankern. Der Inhalt des Elements wird über die innerHTML-Eigenschaft
 * ausgelesen, mit Hilfe der trim-Methode von unnötigem Whitespace am Anfang und Ende
 * befreit und in der Konstanten CARD_TEMPLATE abgespeichert.
 */
const CARD_TEMPLATE = document.querySelector("#card-template").innerHTML.trim();

/**
 * Prototyp zur Repräsentation eines Events, dass Statusveränderungen im BoardView 
 * kommuniziert. Neben dem Event-Typen werden die ID der relevanten Karte sowie eine
 * frei wählbare Zusatzinformation übermittelt (value).
 */

class BoardViewEvent extends Event {
  constructor(type, cardID, value) {
    super(type);
    this.cardID = cardID;
    this.value = value;
  }
}

/**
 * Prototyp zur Repräsentation des sichtbaren Boards im User Interface. Der View 
 * operiert auf einem bestimmten HTML-Element (div-Element mit der ID "board"), 
 * das vorselektiert an den Konstruktor übergeben wird.
 */

class BoardView extends Observable {

  constructor(el) {
    super();
    this.listeners = {};
    this.el = el;
  }

  /**
   * Zeigt die als "card" übergebene Karte im UI. Die Methode führt dazu die folgenden
   * Schritte durch:
   *  1. Es wird überprüft, ob die Karte bereits durch ein HTML-Element repräsentiert 
   *  wird (Selektion anhand des data-id-Attributs und der ID der Karte).
   *  2. Es wird überprüft, ob die in der Karte angegebenen Liste bereits durch ein HTML-
   *  Element repräsentiert wird.
   *  3. Falls nötig wird ein HTML-Element für die Anzeige der Karte erstellt
   *  4. Falls ein HTML-ELement für die angegeben Liste existiert wird das Element für
   *  die (neue) Karte dort eingefügt (append). Sollte die Karte bereits durch ein HTML-
   *  Element an anderer Stelle repräsentiert worden sein (z.B. wenn renderCard nach
   *  dem Verschieben einer Karte aufgerufen wird), wird das Element automatisch im 
   *  DOM verschoben (und nicht doppelt angezeigt!).
   */
  renderCard(card) {
    /**
     * Auswahl der möglicherweise existierenden HTML-Repräsentationen von Karte und Liste
     */
    let cardEl = this.el.querySelector("[data-id=\"" + card.id + "\"]"),
      targetList = this.el.querySelector("." + card.list);
    /**
     * Verarbeitung des Falls, das es sich um eine neue, nicht bereits im UI angezeigte
     * Karte handelt.
     */
    if (!cardEl) {
      /**
       * Ausgelagertes Erstellen des HTML-Elements zur Repräsentation der Karte und Registrieren 
       * von Callback-Methoden zum Abfangen von Mausklicks und Textveränderungen auf der Karte 
       * bzw. in dem dortigen Textfeld. Diese Events werden automatisch vom Browser erstellt und
       * versendet, wenn der Benutzer die entsprechenden Aktionen ausführt.
       */
      cardEl = this.createCardElement(card);
      cardEl.addEventListener("click", this.onCardClicked.bind(this));
      cardEl.querySelector(".text").addEventListener("change", this.onCardTextUpdated
        .bind(this));
    }
    /**
     * Hinzufügen bzw. Verschieben der Karte in die entsprechende Liste
     */
    if (targetList) {
      targetList.appendChild(cardEl);
    }
  }

  /**
   * Erzeugt eine HTML-Repräsentation der übergebenen Karte
   */
  createCardElement(card) {
    /**
     * Zu Beginn wird ein leers HTML-Element erstellt. Es dient als Container
     * für die Konstruktion des neuen Karten-Elements. Elemente, die mit Hilfe
     * von createElement erstellt werden, werden nicht automatisch im Browser
     * angezeigt - dies passiert erst, wenn die neuen Element im DOM "eingehangen"
     * (append) werden.
     */
    let container = document.createElement("div"),
      /**
       * Zwischenspeichern des initial ausgelesenen Inhalts des Template-Strings
       */
      templateString = CARD_TEMPLATE;
    /**
     * Ersetzen der Platzhalter für ID und Text im Template-String
     */
    templateString = templateString.replace("$ID", card.id);
    templateString = templateString.replace("$TEXT", card.text);
    /**
     * Einfügen des angepassten Template-Strings in das leere Container-Element. 
     * Die durch den String repräsentierte HTML-Struktur (siehe HTML-Dokument) wird
     * automatisch erzeugt.
     */
    container.innerHTML = templateString;
    /**
     * Das erste Kindelement des Containers (hier das <li>-Element aus dem Template) wird
     * zurückgegeben. Dieser einfache Templating-Mechanismus funktioniert nur, wenn im 
     * Template-Tag nur ein Kindelement auf oberster Ebene angegeben wird.
     */
    return container.firstChild;
  }

  /**
   * Callback zum Abfangen von Änderungen am Inhalt des Textelements. Der Event wird 
   * ausgelöst, wenn der Nutzer den Text einer Karte im UI ändert. Da der Event auf dem 
   * Textfeld, nicht auf dem umschließenden Karten-Element (<li>) ausgelöst wird, muss
   * zuerst das korrekte Elternelement festgestellt werden. Dies geschieht durch die 
   * Verwendung der "closest"-Methode, die für ein beliebiges HTML-Element 
   * (hier event.target, also das Textfeld, auf dem der Event und damit dieser Callback
   * ausgelöst wurde) das nächste (Position im DOM) Element zurückgibt, auf das der
   * angegebene Selektor (hier ".card") zutrifft.
   *
   * Registrierte Listener werden per Event über die ID und den neuen Inhalt der 
   * veränderten Karte informiert.
   */
  onCardTextUpdated(event) {
    let cardEl = event.target.closest(".card"),
      cardText = event.target.value,
      cardID = parseInt(cardEl.getAttribute("data-id"))
    this.notifyAll(new BoardViewEvent("elementTextUpdated", cardID, cardText));
  }

  /**
   * Callback zum Abfangen von Klicks auf die gesamte Karte. Falls der Nutzer auf
   * einen der beiden Buttons geklickt hat - Überprüft wird dies, in dem die Liste
   * der CSS-Klassen des angeklickten Elements auf einen Eintrag "icon" hin kontrolliert
   * wird - wird der korrekte Button identifiziert (CSS-Klasse "left" ODER "right").
   *
   * Registrierte Listener werden per Event über die ID und die Bewegungsrichtung der
   * angeklickten Karte informiert.
   */
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