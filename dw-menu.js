import { css, html } from "lit-element";
import { repeat } from "lit-html/directives/repeat";

// View Element
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@dreamworld/dw-list-item";

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
        --dw-dialog-content-padding: 0;
      }

      :host([type="popover"]) .dialog__content {
        padding: var(--dw-menu-content-padding, 0);
      }

      dw-list-item[danger] {
        --mdc-theme-text-primary: var(--dw-menu-action-danger, #B00020);
        --dw-icon-color: var(--dw-menu-action-danger, #B00020)
      }

      :host([type="popover"]) header,
      :host([type="modal"]) .mdc-dialog__title {
        max-height: 56px;
        display: flex;
        flex-direction: row-reverse;
        padding: 0;
      }

      :host([type="modal"]) .mdc-dialog__title {
        padding-left: 16px;
      }

      dw-icon-button {
        width: max-content;
        height: max-content;
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
  };

  constructor() {
    super();
    this.type = "popover";

    this.mobileMode = false;
    this.keepAnchorVisible = false;
    this.placement = "top-start";
    this.showClose = false;
  }

  connectedCallback() {
    this._setDialogConfig();

    super.connectedCallback();
  }

  get _headerTemplate() {
    return html`
      ${this.showClose ? html`<dw-icon-button icon="close" dismiss @click=${(e) => console.log("close: invoked", e)}></dw-icon-button>` : html``}
      ${this.heading ? html`<div class="heading">${this.heading}</div>` : html``}
    `;
  }

  get _contentTemplate() {
    return html`
      ${repeat(this.actions, (action, index) => {
        return html`<dw-list-item
          title1=${action.label}
          leadingIcon=${action.icon}
          hasLeadingIcon
          selectionMode="none"
          ?danger=${action.danger}
        ></dw-list-item>`;
      })}
    `;
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
