import { css, html } from "lit-element";
import { repeat } from "lit-html/directives/repeat";

// View Element
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@dreamworld/dw-list-item";
import "@dreamworld/dw-icon-button";
import "@dreamworld/dw-tooltip";

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
        --dw-dialog-content-padding: 0;
      }

      :host([type="popover"]) .dialog__content {
        padding: var(--dw-menu-content-padding, 0);
      }

      dw-list-item:not([disabled]) {
        --dw-icon-color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
      }

      dw-list-item:not([disabled])[danger] {
        --mdc-theme-text-primary: var(
          --dw-menu-danger-action-color,
          var(--mdc-theme-error, #b00020)
        );
        --dw-icon-color: var(--dw-menu-danger-action-color, var(--mdc-theme-error, #b00020));
        --mdc-theme-on-surface: var(--dw-menu-danger-action-color, var(--mdc-theme-error, #b00020));
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
    this.hiddenActions = [];
  }

  // Remove this custom getter/setter when `willUpdate` will be supported
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

  // Remove this custom getter/setter when `willUpdate` will be supported
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
    return html`
      ${repeat(this._getActions(), (action, index) => {
        return html`
          ${this._getDisabledActionTooltip(action.name)
            ? html` <span id=${action.name}>
                  <dw-list-item
                    title1="${action.label}"
                    leadingIcon="${action.icon}"
                    ?hasLeadingIcon="${this.actions.some((e) => e.icon)}"
                    selectionMode="none"
                    ?danger="${action.danger}"
                    ?disabled="${this._isActionDisabled(action.name)}"
                    @click="${(e) => this._onAction(e, action)}"
                  ></dw-list-item>
                </span>
                <dw-tooltip for=${action.name} placement="bottom"
                  ><span>${this._getDisabledActionTooltip(action.name)}</span></dw-tooltip
                >`
            : html`<dw-list-item
                title1="${action.label}"
                leadingIcon="${action.icon}"
                ?hasLeadingIcon="${this.actions.some((e) => e.icon)}"
                selectionMode="none"
                ?danger="${action.danger}"
                ?disabled="${this._isActionDisabled(action.name)}"
                @click="${(e) => this._onAction(e, action)}"
              ></dw-list-item>`}
        `;
      })}
    `;
  }

  /**
   * Computed actions and remove `hiddenActions`
   * @returns {array} actions that actually present on a temporary surface.
   */
  _getActions() {
    return this.actions.filter((action) => this.hiddenActions.indexOf(action.name) === -1);
  }

  /**
   * Set dialog configuration based on `mobileMode`
   * If menu is in mobile mode dialog type is `modal` and placement is `bottom`
   * Otherwise placement value assigned to popoverPlacement
   */
  _setDialogConfig() {
    if (this.mobileMode) {
      this.type = "modal";
      this.placement = "bottom";
      return;
    }

    this.popoverPlacement = this.placement;
  }

  /**
   * Checks action is disabled or not
   * @param {String} actionName name of the action
   * @returns Boolean
   */
  _isActionDisabled(actionName) {
    return !!(this.disabledActions && this.disabledActions[actionName]);
  }

  /**
   * To get disabled action tooltip text
   *
   * @param {String} actionName name of the action
   * @returns String disabled action tooltip text
   */
  _getDisabledActionTooltip(actionName) {
    if (
      this.disabledActions &&
      this.disabledActions[actionName] &&
      typeof this.disabledActions[actionName] === "boolean"
    ) {
      return "";
    }

    return this.disabledActions && this.disabledActions[actionName];
  }

  /**
   * Trigger when action item is clicked
   * Close dialog when trigger
   *
   * @param {Event} e dispatch `action` event
   * Set actionName in detail
   */
  _onAction(e, action) {
    this.dispatchEvent(new CustomEvent("action", { detail: action.name }));
    this.close();
  }
}

window.customElements.define("dw-menu", DwMenu);
