# `<dw-menu>`

- Menus displays a list of choises on temporary surface like Popover dialog in Desktop and Tablet.
- In mobile, Menu is displayed in bottom sheet. When menu items are overflowed Menu items are shown as Fit Dialog.
- Menu is composed of various menu items.
- It may have Divider to group menu items.

## Installation

```sh
npm install @dreamworld/dw-menu
```

## API

### Properties/Attributes

Name              | Type                       | Default                 | Description
----------------- | -------------------------- | ----------------------- | ------------
`open`            | `boolean`                  | `false`                 | Whether the menu should open and display.
`anchor`          | `HTMLElement\|null`        | `null`                  | Determines from which element the floating menu should calculate sizing and position offsets.
`actions`         | `array`                    | `undefined`             | Represent total available actions / sub actions in the toolbar.
`disabledActions` | `object`                   | `undefined`             | Specifies actiosn which are disabled. key = action name, value = Tooltip message to be shown for that action. key = action name, value = Tooltip message to be shown for that action.
`hiddenActions`   | `array`                    | `undefined`             | Hide actions from master actions.
`mobileMode`      | `boolean`                  | `false`                 | Displayed in bottom sheet in most of the cases. When menu items are overflowed Menu items are shown as Fit dialog.

