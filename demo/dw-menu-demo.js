import { LitElement, css, html } from "lit";
import "../dw-menu.js";
import "../dw-menu-temp";

export class DwMenuDemo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <button @click=${this._onOpen}>Open Menu</button>
      <dw-menu></dw-menu>
      <dw-menu-temp name="Hiten"></dw-menu-temp>
    `;
  }

  _onOpen(e) {
    let menuEl = this.renderRoot.querySelector("dw-menu");
    let triggerEl = e.target;
    menuEl && menuEl.open(triggerEl);
  }
}

customElements.define("dw-menu-demo", DwMenuDemo);
