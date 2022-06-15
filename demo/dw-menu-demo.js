import { LitElement, css, html } from "lit";
import "../dw-menu.js";

export class DwMenuDemo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html` <dw-menu></dw-menu> `;
  }
}

customElements.define("dw-menu-demo", DwMenuDemo);
