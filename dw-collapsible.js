/**
 * This element is used to show and hide content.
 *
 * ## Behavior
 *  - It's a collapsible element.
 *  - It renders contents given in 'slot'.
 *  - It collapse it self based on opened property value. Default: opened is `false`.
 *  - It will collapse/expand with animations.
 *
 * ## Methods
 *  - collapsetToggle() - Used to toggle collapse element's content.
 */

import { LitElement, html, css } from "lit";

export class DwCollapsible extends LitElement {
  static styles = css`
    :host .collapsible {
      transition: height 0.5s ease;
      height: 0;
      overflow: hidden;
    }
    :host([opened]) .collapsible {
      height: auto;
      transition: height 0.5s ease;
    }
  `;

  static properties = {
    /**
     * Use this to show/hide the content.
     * show the content if true.
     * hide the content if false.
     */
    opened: {
      type: Boolean,
      reflect: true,
    },
  };

  constructor() {
    super();
  }

  render() {
    return html`<div class="collapsible"><slot></slot></div>`;
  }

  /**
   * Use to show/hide the content.
   */
  toggle() {
    this.opened = this.opened ? false : true;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("opened")) {
      let collapsibleEl = this.shadowRoot.querySelector(".collapsible");
      if (collapsibleEl) {
        collapsibleEl.style.height = collapsibleEl.scrollHeight + "px";
        if (this.opened) {
          setTimeout(() => {
            collapsibleEl.style.height = "auto";
          }, 500);
        } else {
          setTimeout(() => {
            collapsibleEl.style.height = "0px";
          });
        }
      }
    }
  }
}

customElements.define("dw-collapsible", DwCollapsible);
