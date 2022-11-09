import { LitElement, html, css } from '@dreamworld/pwa-helpers/lit.js';
import "../dw-menu.js";
import "@dreamworld/dw-icon-button";

const actions = [
  {
    name: "ADD",
    label: "Add",
    icon: "add",
  },
  {
    name: "SHARE",
    label: "Share",
    icon: "share",
  },
  {
    name: "HOME",
    label: "Home",
    icon: "home",
  },
  {
    name: "DELETE",
    label: "Delete",
    icon: "delete",
    danger: true,
  },
];

const disabledActions = {
  SHARE: "Share is disabled",
  HOME: true
};

const hiddenActions = [];

export class DwMenuDemo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      dw-icon-button {
        width: max-content;
        height: max-content;
      }
    `,
  ];

  render() {
    return html`
      <dw-menu
        id="popover"
        
        placement="bottom-end"
        .actions=${actions}
        .disabledActions=${disabledActions}
        .hiddenActions=${hiddenActions}
        @action=${(e) => console.log("demo", e.detail)}
      ></dw-menu>
      <label>Popover</label>
      <dw-icon-button icon="more_vert" @click=${this._onPopover}></dw-icon-button>

      <dw-menu
        id="bottom"
        .heading="${"Heading"}"
        
        mobile-mode
        .actions=${actions}
        .disabledActions=${disabledActions}
        .hiddenActions=${hiddenActions}
        @action=${(e) => console.log("demo", e.detail)}
      ></dw-menu>
      <label>Bottom Sheet</label>
      <dw-icon-button icon="more_vert" @click=${this._onBottom}></dw-icon-button>
    `;
  }

  _onPopover(e) {
    let menuEl = this.renderRoot.querySelector("#popover");
    let triggerEl = e.target;
    menuEl && menuEl.open(triggerEl);
  }

  _onBottom(e) {
    let menuEl = this.renderRoot.querySelector("#bottom");
    let triggerEl = e.target;
    menuEl && menuEl.open(triggerEl);
  }
}

customElements.define("dw-menu-demo", DwMenuDemo);
