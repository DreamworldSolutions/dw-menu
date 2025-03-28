import { css, html, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';
import { repeat } from 'lit/directives/repeat.js';

// View Element
import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog.js';
import '@dreamworld/dw-icon-button';
import '@dreamworld/dw-list-item';
import '@dreamworld/dw-tooltip';
import './dw-menu-list-item.js';

// Styles
import * as TypographyLiterals from '@dreamworld/material-styles/typography-literals';
import { DWTooltipStyle } from '@dreamworld/dw-tooltip';

const KeyCode = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  SPACE: 32,
  SHIFT: 16,
  TAB: 9,
  ESC: 27
};

const Direction = {
  UP: "up",
  DOWN: "down",
};
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
    DWTooltipStyle,
    css`
      :host {
        display: block;
        --dw-dialog-content-padding: 0;
      }

      :host([type='popover']) .dialog__content {
        padding: var(--dw-menu-content-padding, 0);
      }

      :host([type='popover']) header,
      :host([type='modal']) .mdc-dialog__title {
        max-height: 56px;
        display: flex;
        flex-direction: row-reverse;
        padding: var(--dw-menu-header-padding, 0 0 0 16px);
        ${TypographyLiterals.headline6};
      }

      :host([type='popover'][_showHeader]) header,
      :host([type='modal'][_showHeader]) .mdc-dialog__title {
        height: 56px;
      }

      :host([type='modal']) .mdc-dialog__title::before {
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
      attribute: 'mobile-mode',
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

    /**
     * Set true if the integrator doesn't want to close the menu on item click.
     */
    disableAutoClose: {
      type: Boolean,
    },

    /**
     * index of activated Item
     * default: -1
     */
    _activatedIndex: { type: Number },

  };

  constructor() {
    super();
    this.type = 'popover';
    this.mobileMode = false;
    this.keepAnchorVisible = false;
    this.placement = 'top-start';
    this.showClose = false;
    this.hiddenActions = [];
    this._activatedIndex = -1;
    this._firstItemIndex = 0;
  }

  willUpdate(props) {
    super.willUpdate(props);
  
    if (props.has('heading') || props.has('showClose')) {
      this._showHeader = Boolean(this.heading) || this.showClose;
    }
  }

  connectedCallback() {
    this._setDialogConfig();
    super.connectedCallback();
  }

  get _headerTemplate() {
    return html`
      ${this.showClose ? html`<dw-icon-button icon="close" @click=${() => this.close()}></dw-icon-button>` : html``}
      ${this.heading ? html`<div class="heading">${this.heading}</div>` : html``}
    `;
  }

  get _contentTemplate() {
    return html`
      ${repeat(
        this._getActions(),
        (action, index) =>
          html`<dw-menu-list-item
            .action=${action}
            ?activated=${this._isItemActivated(index)}
            ?hasLeadingIcon=${this.actions.some(e => e.icon || e.hasLeadingIconSpace)}
            ?leadingIconSymbol=${action.leadingIconSymbol}
            ?disabledActionTooltip="${this._isActionDisabled(action.name)}"
            @actionClick=${e => this._onAction(e, action)}
            .disabledActions=${this.disabledActions}
            .hiddenActions=${this.hiddenActions}
          ></dw-menu-list-item>`
      )}
    `;
  }

  get _filteredActions() {
    return this.actions?.filter(action => !this.hiddenActions.includes(action.name) && !this._isActionDisabled(action.name))
  }

  get _activatedItem() {
    const index = this._activatedIndex;
    return this._filteredActions?.[index];
  }

  /**
 * returns whether given item's index is activated or not
 * @param {Number} index
 * @returns {Boolean}
 */
  _isItemActivated(index) {
    return index === this._activatedIndex;
  }

  /**
   * Computed actions and remove `hiddenActions`
   * @returns {array} actions that actually present on a temporary surface.
   */
  _getActions() {
    return this.actions?.filter(action => this.hiddenActions.indexOf(action.name) === -1);
  }

  /**
   * Set dialog configuration based on `mobileMode`
   * If menu is in mobile mode dialog type is `modal` and placement is `bottom`
   * Otherwise placement value assigned to popoverPlacement
   */
  _setDialogConfig() {
    if (this.mobileMode) {
      this.type = 'modal';
      this.placement = 'bottom';
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
   * Trigger when action item is clicked
   * Close dialog when trigger
   *
   * @param {Event} e dispatch `action` event
   * Set actionName in detail
   */
  _onAction(e) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    this.dispatchEvent(new CustomEvent('action', { detail: e.detail }));
    if (!this.disableAutoClose) {
      this.close();
    }
  }

  /**
 * @override
 * @param {Object} e Event
 */
  __onKeyDown(e) {
    super.__onKeyDown(e);

    if (!this.opened) {
      return;
    }

    const keyCode = e.keyCode || e.which;
    const { ARROW_DOWN, ARROW_UP, ENTER } = KeyCode;


    if (![ARROW_DOWN, ARROW_UP, ENTER].includes(keyCode)) {
      return;
    }

    if ([ARROW_DOWN, ARROW_UP].includes(keyCode) || ([ENTER].includes(keyCode) && this._activatedItem)) {
      e.stopPropagation();
      e.preventDefault();
    }

    // List navigation & Selection
    switch (keyCode) {
      case ARROW_UP:
        this._moveActivated(Direction.UP);
        return;
      case ARROW_DOWN:
        this._moveActivated(Direction.DOWN);
        return;
      case ENTER:
        if (this._activatedItem) {
          const action = this._activatedItem.name;
          this._onAction({detail: action});
        }
        break;
    }
  }

  _moveActivated(direction) {
    const numberOfItems = this._filteredActions?.length;
    if (!numberOfItems) return;

    if (direction === Direction.UP && this._activatedIndex <= this._firstItemIndex) return;

    if (direction === Direction.DOWN && this._activatedIndex === numberOfItems - 1) return;

    this._activatedIndex = direction === Direction.UP ? this._activatedIndex - 1 : this._activatedIndex + 1;
  }
}

window.customElements.define('dw-menu', DwMenu);
