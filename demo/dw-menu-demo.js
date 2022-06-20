import { LitElement, css, html } from "lit";
import "../dw-menu.js";

const actions = [
  {
    name: 'ADD',
    label: 'Add',
    icon: 'add'
  },
  {
    name: 'SHARE',
    label: 'Share',
    icon: 'share'
  },
  {
    name: 'DELETE',
    label: 'Delete',
    icon: 'delete',
    danger: true
  }
]

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
      <dw-menu .actions=${actions}></dw-menu>
    `;
  }

  _onOpen(e) {
    let menuEl = this.renderRoot.querySelector("dw-menu");
    let triggerEl = e.target;
    menuEl && menuEl.open(triggerEl);
  }
}

customElements.define("dw-menu-demo", DwMenuDemo);
