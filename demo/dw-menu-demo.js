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
      <dw-menu-temp></dw-menu-temp>
    `;
  }

  _onOpen(e) {
    let menuEl = this.renderRoot.querySelector("dw-menu-temp");
    let triggerEl = e.target;
    menuEl && menuEl.open(triggerEl);
  }
}

customElements.define("dw-menu-demo", DwMenuDemo);
