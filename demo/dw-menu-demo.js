import DeviceInfo from '@dreamworld/device-info';
import '@dreamworld/dw-icon-button';
import { LitElement, css, html, nothing } from '@dreamworld/pwa-helpers/lit.js';
import '../dw-menu-list-item.js';
import '../dw-menu.js';

const actions = [
  {
    name: 'ADD',
    label: 'Add',
    iconFont: 'FILLED',
  },
  {
    name: 'download',
    label: 'Download',
    iconFont: 'OUTLINED',
  },
  {
    name: 'SHARE',
    label: 'Share',
    icon: 'share',
    iconFont: 'OUTLINED',
    divider: true,
    subActions: [
      {
        name: 'pdf',
        label: 'PDF',
        hasLeadingIconSpace: true,
        subActions: [
          {
            name: 'DELETE',
            label: 'Delete',
            icon: 'share',
            danger: true,
            iconFont: 'OUTLINED',
          },
          {
            name: 'DELETE',
            label: 'Action 1',
            danger: true,
            hasLeadingIconSpace: true,
            iconFont: 'OUTLINED',
          },
        ],
      },
      {
        name: 'HOME',
        label: 'Home',
        iconFont: 'FILLED',
      },
    ],
  },
  {
    name: 'DELETE',
    label: 'DELETE',
    icon: 'delete',
    danger: true,
    iconFont: 'OUTLINED',
  },
  {
    name: 'DELETE',
    label: 'Delete',
    icon: 'delete',
    danger: true,
    iconFont: 'OUTLINED',
  },
];

const disabledActions = {
  ADD: 'ADD is disabled',
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

  static get properties() {
    return {
      _menuOpen: { type: Boolean },
    };
  }

  render() {
    return html`
      <dw-icon-button id="triggerElement" icon="more_vert" @click=${this._onMenuOpen}></dw-icon-button>

      ${this._renderMenu}
    `;
  }

  get _renderMenu() {
    if (!this._menuOpen) {
      return nothing;
    }

    return html`
      <dw-menu
        id="bottom"
        .opened=${true}
        .heading="${'Heading'}"
        .actions=${actions}
        .mobileMode=${DeviceInfo.info().layout === 'small'}
        placement="bottom-end"
        .disabledActions=${disabledActions}
        .hiddenActions=${hiddenActions}
        .triggerElement=${this._getTriggerElement}
        @dw-dialog-closed=${this._onMenuClose}
        @action=${e => console.log('action', e.detail)}
      ></dw-menu>
    `;
  }

  get _getTriggerElement() {
    return this.renderRoot.querySelector('#triggerElement');
  }

  _onMenuOpen(e) {
    this._menuOpen = true;
  }

  _onMenuClose() {
    this._menuOpen = false;
  }
}

customElements.define('dw-menu-demo', DwMenuDemo);
