# `<dw-menu>` [![Published on npm](https://img.shields.io/npm/v/@dreamworld/dw-menu.svg)](https://www.npmjs.com/package/@dreamworld/dw-menu)

A Lit-based Web Component that displays a list of choices on a temporary surface — a popover dialog on desktop/tablet and a bottom sheet on mobile. Extends [`dw-composite-dialog`](https://github.com/DreamworldSolutions/dw-dialog/blob/master/dw-composite-dialog.js), inheriting all dialog lifecycle behaviors.

---

## 1. User Guide

### Installation

```sh
yarn add @dreamworld/dw-menu
```

```js
import '@dreamworld/dw-menu';
```

### Basic Usage

```js
import '@dreamworld/dw-menu';

const actions = [
  { name: 'ADD', label: 'Add', icon: 'add' },
  { name: 'DELETE', label: 'Delete', icon: 'delete', danger: true },
];

const disabledActions = {
  ADD: 'Adding is currently disabled',
};

const hiddenActions = [];
```

```html
<!-- Trigger element -->
<button id="menuAnchor" @click="${this._openMenu}">Open Menu</button>

<!-- Menu — conditionally rendered when open -->
<dw-menu
  .opened="${true}"
  .actions="${actions}"
  .disabledActions="${disabledActions}"
  .hiddenActions="${hiddenActions}"
  .anchor="${this.renderRoot.querySelector('#menuAnchor')}"
  placement="bottom-end"
  @action="${e => console.log('Selected:', e.detail.name)}"
  @dw-dialog-closed="${this._onMenuClose}"
></dw-menu>
```

> **Tip:** Only render `<dw-menu>` when it should be open. Listen to `dw-dialog-closed` to remove it from the DOM.

### Mobile Mode

```html
<dw-menu
  mobile-mode
  .opened="${true}"
  .heading="${'Options'}"
  .showClose="${true}"
  .actions="${actions}"
  @action="${e => console.log(e.detail.name)}"
  @dw-dialog-closed="${this._onMenuClose}"
></dw-menu>
```

---

### API Reference

#### Properties/Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `opened` | `Boolean` | `false` | Set to `true` to show the menu. |
| `actions` | `Action[]` | `undefined` | All available actions and sub-actions to render. |
| `disabledActions` | `Object` | `undefined` | Disabled actions map. Key = action name, value = tooltip string or `true`. |
| `hiddenActions` | `String[]` | `[]` | Action names that are not rendered in the menu. |
| `mobileMode` | `Boolean` | `false` | When `true`, displays as a bottom sheet. Attribute: `mobile-mode`. |
| `anchor` | `HTMLElement\|null` | `null` | Element to anchor the popover to. Popover mode only. |
| `keepAnchorVisible` | `Boolean` | `false` | When `true`, the anchor element remains visible when the menu opens. Popover mode only. |
| `placement` | `String` | `'top-start'` | Popover position. Values: `top-start`, `top-end`, `bottom-start`, `bottom-end`. Popover mode only. |
| `heading` | `String` | `null` | Optional heading text shown at the top of the menu. |
| `showClose` | `Boolean` | `false` | Shows a close icon-button in the top-right corner. |
| `disableAutoClose` | `Boolean` | `false` | When `true`, the menu does not close automatically on item click. |

#### Events

| Event | Target | Detail | Description |
| --- | --- | --- | --- |
| `action` | `<dw-menu>` | `{ name: String }` | Fired when a menu item is selected (keyboard or mouse). `name` is the `action.name` of the selected item. |
| `dw-dialog-closed` | `<dw-menu>` | — | Inherited from `dw-composite-dialog`. Fired when the dialog closes for any reason. |

#### CSS Custom Properties

| Name | Default | Description |
| --- | --- | --- |
| `--dw-menu-header-padding` | `0 0 0 16px` | Padding of the header area. |
| `--dw-menu-content-padding` | `0` | Padding of the content area. |
| `--dw-menu-danger-action-color` | `#B00020` | Color applied to danger-mode action text and icon. |
| `--dw-menu-list-item-divider-color` | `"rgba(0, 0, 0, 0.12)"` | Divider border color for list items with `divider: true`. |

---

### Action Object

Each entry in the `actions` array is a plain object with the following keys:

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `String` | Yes | Unique identifier. Returned in the `action` event `detail.name`. |
| `label` | `String` | Yes | Display text for the item. |
| `icon` | `String` | No | Material icon name for the leading icon. |
| `iconFont` | `String` | No | Icon font style. Common values: `'FILLED'`, `'OUTLINED'`. |
| `iconColor` | `String` | No | Custom color for the icon and label. Accepts a CSS color value (`'red'`) or a CSS custom property name starting with `'-'` (e.g., `'--my-color'`). |
| `danger` | `Boolean` | No | When `true`, renders the item in danger/error color. Default: `false`. |
| `divider` | `Boolean` | No | Adds a bottom border to this item. Default: `false`. |
| `hasLeadingIconSpace` | `Boolean` | No | Reserves 40px of space for a leading icon even when no `icon` is set. Useful for alignment within a mixed-icon list. |
| `subActions` | `Action[]` | No | Nested child actions. Renders as a collapsible group below the parent item. |
| `type` | `String` | No | Applies only when `subActions` is set. Values: `'collapsible'` (default), `'submenu'`. |
| `leadingIconSymbol` | `Boolean` | No | When `true`, the leading icon is treated as a symbol rather than an icon font glyph. |

#### Examples

**Simple action:**

```js
{ name: 'ADD', label: 'Add', icon: 'add' }
```

**Danger action:**

```js
{ name: 'DELETE', label: 'Delete', icon: 'delete', danger: true }
```

**With sub-actions:**

```js
{
  name: 'SHARE',
  label: 'Share',
  icon: 'share',
  divider: true,
  subActions: [
    { name: 'PDF', label: 'Export as PDF', hasLeadingIconSpace: true },
    { name: 'EMAIL', label: 'Share via Email', hasLeadingIconSpace: true },
  ]
}
```

**Multi-level nesting:**

```js
{
  name: 'EXPORT',
  label: 'Export',
  icon: 'download',
  subActions: [
    {
      name: 'FORMATS',
      label: 'Formats',
      subActions: [
        { name: 'PDF', label: 'PDF' },
        { name: 'CSV', label: 'CSV' },
      ]
    }
  ]
}
```

**Custom icon color:**

```js
// Direct CSS value
{ name: 'WARN', label: 'Warning', icon: 'warning', iconColor: '#FF9800' }

// Via CSS custom property
{ name: 'WARN', label: 'Warning', icon: 'warning', iconColor: '--my-warning-color' }
```

---

### `disabledActions`

An object where each key is an action `name` and the value controls the disabled state:

| Value type | Behavior |
| --- | --- |
| `String` | Action is disabled and the string is shown as a tooltip on hover. |
| `true` | Action is disabled with no tooltip. |

```js
const disabledActions = {
  SHARE: 'Sharing is not available for this item',
  DELETE: true,
};
```

> Actions listed here must also be declared in `actions`.

---

### Keyboard Navigation

When the menu is open, keyboard interaction is available on non-disabled, non-hidden items:

| Key | Behavior |
| --- | --- |
| `Arrow Down` | Move focus to the next item. |
| `Arrow Up` | Move focus to the previous item. |
| `Enter` | Select the currently focused item. |
| `Tab` | Close the menu. |
| `ESC` | Close the menu (inherited from dialog). |

> **Note:** Disabled and hidden actions are excluded from keyboard navigation.

---

### Advanced Usage

#### Keep menu open after selection

```html
<dw-menu
  .opened="${true}"
  .actions="${actions}"
  .disableAutoClose="${true}"
  @action="${this._onAction}"
></dw-menu>
```

#### Mobile mode with heading and close button

```html
<dw-menu
  mobile-mode
  .opened="${true}"
  .heading="${'Choose an action'}"
  .showClose="${true}"
  .actions="${actions}"
  @dw-dialog-closed="${this._onClose}"
></dw-menu>
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

`dw-menu` is built from three components:

| Module | Role |
| --- | --- |
| `dw-menu.js` | Main host component. Manages dialog lifecycle, keyboard navigation, event relay, and responsive layout switching. |
| `dw-menu-list-item.js` | Renders individual action items. Handles collapsible sub-action toggling, disabled state tooltip wiring, and custom icon color application. |
| `dw-collapsible.js` | Internal animated container. Expands/collapses slotted content with a CSS height transition (0.5s ease). |

### Design Patterns

- **Inheritance:** `DwMenu extends DwCompositeDialog` — inherits open/close lifecycle, positioning, and keyboard ESC handling.
- **Recursive rendering:** `dw-menu-list-item` renders itself recursively for nested `subActions`.
- **Responsive strategy:** `mobileMode` switches `type` from `'popover'` to `'modal'` and forces `placement` to `'bottom'`, delegating bottom-sheet rendering to the base dialog.
- **Keyboard navigation:** `_filteredActions` (actions minus hidden and disabled) drives a linear index (`_activatedIndex`). Arrow keys increment/decrement; Enter dispatches the selected action.
- **Disabled tooltip wiring:** When a disabled action has a string tooltip, the list item is wrapped in a `<span>` with a matching `id`, and a `<dw-tooltip for="...">` is rendered adjacent to it.
- **Icon color injection:** `iconColor` values are applied via inline `styleMap` on `<dw-list-item>`, targeting `--dw-icon-color`, `--mdc-theme-text-primary`, and `--mdc-theme-on-surface`. If the value starts with `'-'`, it is wrapped in `var(...)`.

### Future Enhancements

- Custom footer (via `slot` or template override)
- Group items (improved divider support)
- `href` (link) support for items — open in new window, auto trailing icon
- Sub-menu: opens a secondary menu beside the current one (long-term)
