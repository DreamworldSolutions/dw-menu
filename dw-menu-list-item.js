import { LitElement, html, css } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { repeat } from "lit/directives/repeat.js";

import "@dreamworld/dw-list-item";
import "@dreamworld/dw-tooltip";
import "./dw-collapsible.js";

class DwMenuListItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([opened]) {
          border-bottom: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
          border-top: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
        }

        :host([divider]) {
          border-bottom: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
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
          --mdc-theme-on-surface: var(
            --dw-menu-danger-action-color,
            var(--mdc-theme-error, #b00020)
          );
        }
      `,
    ];
  }
  static get properties() {
    return {
      /**
       * Input Property
       * Represent total available actions / sub actions in the toolbar.
       */
      action: { type: Object },

      /**
       * Input Property
       * Specifies actions which are disabled. key = action name, value = Tooltip message to be shown for that action.
       * e.g. {'DELETE': 'User has no write permission'}
       * Note:: These actions must be declared in the `actions` property.
       */
      disabledActions: { type: Array },

      /**
       * Input Property
       * Whether item has leading icon or not
       */
      hasLeadingIcon: {
        type: Boolean,
        reflect: true,
      },

      _opened: {
        type: Boolean,
        reflect: true,
        attribute: "opened",
      },

      level: {
        type: Boolean,
      },

      /**
       * Input property.
       * Specifies Tooltip shows or not. when action is disabled.
       */
      disabledActionTooltip: {
        type: Boolean,
        reflect: true,
      },

      divider: {
        type: Boolean,
        reflect: true,
        attribute: "divider",
      },
    };
  }

  constructor() {
    super();
    this.level = 1;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("action")) {
      this.action.divider ? (this.divider = true) : (this.divider = false);
    }
  }

  render() {
    let paddingLeft = this.level * 16 + "px";
    console.log(this.action.danger);
    return html` ${this._getDisabledActionTooltip(this.action.name)
      ? html`<span id=${this.action.name}>
            <dw-list-item
              style="${styleMap({ "padding-left": paddingLeft })}"
              title1="${this.action.label}"
              leadingIcon="${this.action.icon}"
              ?danger="${this.action.danger}"
              leadingIconFont="${this.action.iconFont}"
              trailingIcon="${this._opened ? "expand_less" : "expand_more"}"
              ?hasTrailingIcon=${this._isSubActionAvailable}
              ?hasLeadingIcon="${this.hasLeadingIcon}"
              selectionMode="none"
              ?disabled="${this.disabledActionTooltip}"
              @click="${(e) => this._onAction(e, this.action)}"
            ></dw-list-item
          ></span>
          <dw-tooltip for=${this.action.name} placement="bottom"
            ><span>${this._getDisabledActionTooltip(this.action.name)}</span></dw-tooltip
          >`
      : html`
          <dw-list-item
            style="${styleMap({ "padding-left": paddingLeft })}"
            title1="${this.action.label}"
            ?danger="${this.action.danger}"
            leadingIcon="${this.action.icon}"
            leadingIconFont="${this.action.iconFont}"
            trailingIcon="${this._opened ? "expand_less" : "expand_more"}"
            ?hasTrailingIcon=${this._isSubActionAvailable}
            ?hasLeadingIcon="${this.hasLeadingIcon}"
            selectionMode="none"
            ?disabled="${this.disabledActionTooltip}"
            @click="${(e) => this._onAction(e, this.action)}"
          ></dw-list-item>
          ${this.action.subAction ? this._getsubAction(this.action.subAction) : ``}
        `}`;
  }

  _getsubAction(actions) {
    return html`
      <dw-collapsible>
        ${repeat(actions, (action) => {
          return html`<dw-menu-list-item
            .action=${action}
            .level=${this.level + 1}
            ?hasLeadingIcon=${this.action.subAction.some((e) => e.icon)}
            ?disabledActionTooltip="${this._isActionDisabled(action.name)}"
            .disabledActions=${this.disabledActions}
          ></dw-menu-list-item>`;
        })}
      </dw-collapsible>
    `;
  }

  /**
   * Trigger when action item is clicked
   *
   * if subAction is available dw-collapsible's toggle method will be called else
   * @param {Event} e dispatch `actionClick` event
   * Set bubbles true, composed true and actionName in detail
   */
  _onAction(e, action) {
    if (this._isSubActionAvailable) {
      this._opened = !this._opened;
      let el = this.renderRoot.querySelector("dw-collapsible");
      el && el.toggle();
    } else {
      this.dispatchEvent(
        new CustomEvent("actionClick", { bubbles: true, composed: true, detail: action.name })
      );
    }
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
   * Checks subAction is available or not
   * @returns Boolean
   */
  get _isSubActionAvailable() {
    return Array.isArray(this.action.subAction) && this.action.subAction.length !== 0;
  }
}

customElements.define("dw-menu-list-item", DwMenuListItem);
