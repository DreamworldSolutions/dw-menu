import { LitElement, css, html } from "lit";

/**
 * # <dw-menu>
 * 
 * - Menus displays a list of choises on temporary surface like Popover dialog in Desktop and Tablet.
 * - In mobile, Menu is displayed in bottom sheet. When menu items are overflowed Menu items are shown as Fit Dialog.
 * - Menu is composed of various menu items.
 * - It may have Divider to group menu items.
 * 
 * ## Behaviour
 * - 
 */

export class DwMenu extends LitElement {
  static properties = {};

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`Dw-Menu`;
  }
}

window.customElements.define("dw-menu", DwMenu);
