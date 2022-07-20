import { css, html } from "lit-element";

// View Element
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@dreamworld/dw-icon-button";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals";

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

export class DwMenu extends DwCompositeDialog {
  static styles = [
    DwCompositeDialog.styles,
    css`
      :host {
        display: block;
      }

      :host([type="popover"]) header,
      :host([type="modal"]) .mdc-dialog__title {
        max-height: 56px;
        display: flex;
        flex-direction: row-reverse;
        padding: var(--dw-menu-header-padding, 0 0 0 16px);
        ${TypographyLiterals.headline6};
      }

      :host([type="popover"][_showHeader]) header,
      :host([type="modal"][_showHeader]) .mdc-dialog__title {
        height: 56px;
      }

      :host([type="modal"]) .mdc-dialog__title::before {
        height: auto;
      }

      .heading {
        flex: 1;
        display: flex;
        align-items: center;
      }
    `,
  ];

  static properties = {
    /**
     * Input Property
     * Whether the menu should open and display.
     */
    // opened: { type: Boolean }, // Conflict with dialog's opened property

    /**
     * Input Property
     * Represent total available actions / sub actions in the toolbar.
     */
    actions: { type: Array },

    /**
     * Input Property
     * Specifies actions which are disabled. key = action name, value = Tooltip message to be shown for that action.
     * e.g. {'DELETE': 'User has no write permission'}
     * Note:: These actions must be declared in the `actions` property.
     */
    disabledActions: { type: Array },

    /**
     * Actions specified here aren't visible (rendered) in the menu.
     * e.g. ['ADD', 'DELETE']
     */
    hiddenActions: { type: Array },

    /**
     * Displayed in bottom sheet in most of the cases.
     * When menu items are overflowed Menu items are shown as Fit dialog.
     */
    mobileMode: {
      type: Boolean,
      reflect: true,
      attribute: "mobile-mode",
    },

    /**
     * Element to which this menu should be anchored to.
     * Applicable only when mobileMode=false.
     */
    anchor: { type: Object },

    /**
     * By default, When menu is opened, it covers (hides) anchor element.
     * Set it to true, to make it visible. Applicable only when mobileMode=false.
     */
    keepAnchorVisible: { type: Boolean },

    /**
     * Possible values: top-start, top-end, bottom-start and bottom-end.
     * Applicable only when mobileMode=false.
     */
    // placement: { type: String }, // Conflict with dialog's placement property when dialog is modal

    /**
     * Set it if you would like to show a heading on the menu.
     * By default no heading.
     */
    heading: { type: String },

    /**
     * Shows an icon-button with close icon, on top-right corner.
     * As menu is closed when user clicks away, this isn't needed any most cases.
     * Though, if you would like to show it sometimes, e.g. when mobileMode=true.
     */
    showClose: { type: Boolean },

    /**
     * true when close button or heading is provided.
     * use for set styles
     */
    _showHeader: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.type = "popover";

    this.mobileMode = false;
    this.keepAnchorVisible = false;
    this.placement = "top-start";
    this.showClose = false;
  }

  set heading(value) {
    let oldValue = this._heading;

    if (oldValue === value) {
      return;
    }

    this._showHeader = Boolean(value) || this.showClose;
    this._heading = value;

    this.requestUpdate("heading", oldValue);
  }

  get heading() {
    return this._heading;
  }

  set showClose(value) {
    let oldValue = this._showClose;

    if (oldValue === value) {
      return;
    }

    this._showHeader = Boolean(this.heading) || value;
    this._showClose = value;

    this.requestUpdate("showClose", oldValue);
  }

  get showClose() {
    return this._showClose;
  }

  connectedCallback() {
    this._setDialogConfig();
    super.connectedCallback();
  }

  get _headerTemplate() {
    return html`
      ${this.showClose
        ? html`<dw-icon-button icon="close" @click=${() => this.close()}></dw-icon-button>`
        : html``}
      ${this.heading ? html`<div class="heading">${this.heading}</div>` : html``}
    `;
  }

  get _contentTemplate() {
    return html`Dw-menu`;
  }

  _setDialogConfig() {
    if (this.mobileMode) {
      this.type = "modal";
      this.placement = "bottom";
      return;
    }

    this.popoverPlacement = this.placement;
  }
}

window.customElements.define("dw-menu", DwMenu);
