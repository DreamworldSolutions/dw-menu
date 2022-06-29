import { css, html } from "lit-element";
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog";
import { customElement, property, state } from "lit/decorators.js";

interface Actions {
  name: string;
  label: string;
  icon?: string;
  danger?: boolean;
  type?: string;
  subActions?: SubActions[];
}

interface SubActions {
  name: string;
  label: string;
  icon?: string;
  danger?: boolean;
}

@customElement("dw-menu-temp")
export class DwMenuTemp extends DwCompositeDialog {
  static styles = [
    DwCompositeDialog.styles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({ type: Array })
  actions?: Actions[];

  @property({ type: Object })
  disabledActions = undefined;

  @property({ type: Array })
  hiddenActions: string[] = [];

  @property({ type: Boolean, reflect: true, attribute: "mobile-mode" })
  mobileMode: boolean = false;

  @property({ type: Object })
  anchor: HTMLElement | null = null;

  @property({ type: Boolean })
  keepAnchorVisible: boolean = false;

  @property({ type: String })
  heading: string = "";

  @property({ type: Boolean })
  showClose: boolean = false;

  @property({ type: Boolean, reflect: true })
  _showHeader: boolean = false;

  connectedCallback() {
    this._setDialogConfig();

    super.connectedCallback();
  }

  get _contentTemplate() {
    return html`<h2>Hello!</h2>`;
  }

  _setDialogConfig() {
    if (this.mobileMode) {
      this.type = "modal";
      this.placement = "bottom";
      return;
    }

    this.type = "popover";
    this.placement = "top-start";
  }
}
