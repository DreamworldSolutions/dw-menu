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
`opened`            | `boolean`                  | `false`                 | Whether the menu should open and display.
`actions`         | `Action[]`                    | `undefined`             | Represent total available actions / sub actions in the toolbar.
`disabledActions` | `Object`                   | `undefined`             | Specifies actions which are disabled. key = action name, value = Tooltip message to be shown for that action.
`hiddenActions`   | `String[]`                    | `undefined`             | Actions specified here aren't visible (rendered) in the menu.
`mobileMode`      | `boolean`                  | `false`                 | Displayed in bottom sheet in most of the cases. When menu items are overflowed Menu items are shown as Fit dialog.
`anchor`          | `HTMLElement\|null`        | `null`                  | Element to which this menu should be anchored to. Applicable only when `mobileMode=false`.
`keepAnchorVisible` | `boolean`                 | `false`                 | By default, When menu is opened, it covers (hides) anchor element. Set it to `true`, to make it visible. Applicable only when `mobileMode=false`.
`placement`       | `String`                  | `top-start`              | Possible values: `top-start`, `top-end`, `bottom-start` and `bottom-end`. Applicable only when `mobileMode=false`.
`heading`         | `String`                    | `null`                | Set it if you would like to show a heading on the menu. By default no heading. |
`showClose`       | `boolean`    | `false`  | Shows an icon-button with close icon, on top-right corner. As menu is closed when user clicks away, this isn't needed any most cases. Though, if you would like to show it sometimes, e.g. when `mobileMode=true`. 



### Action

#### Object

Key          | Type                | Description                  
------------ | ------------------- | ---------------------------- 
`name`       | `String`            | name of the action
`label`      | `String`            | label of the action
`icon`       | `String`            | Name of the icon to show as a leading icon
`danger`     | `Boolean`           | Shows action in danger mode
`type`       | `String`            | Type of the action. Use when action have `subAction`. possible values: `collapsible`. default value: `collapsible`
`subActions` | `Array[]`           | Sub Actions of the current action. Used when group of actions comes under any same parent item.

#### Example
 ##### Basic
```object
{
  name: "ADD",
  label: "Add",
  icon: "add",
}
```

##### With Sub Actions
```object
{
  name: "ADD",
  label: "Add",
  icon: "add",
  subAction: [
    {name: "TOP", label: "Move to Top", icon: 'arrow_up'}, 
    {name: "BOTTOM", label: "Move to Bottom", icon: 'arrow_down'}
  ]
}
```

##### Danger action
```object
{
  name: "DELETE",
  label: "Delete",
  icon: "delete",
  danger: true
}
```


### Events

| Event Name | Target             | Detail             | Description
| ---------- | ------------------ | ------------------ | -----------
| `action`   | `dw-list-item`     | `name`             | Fired when a selection has been made via click or keyboard aciton. Provides `name` of the action in details.


# Design Decisions
- No property to configure animation. Animation style would be as suggested by the material standards.

# Future Enhancements
- Keyboard Navigation
- Custom Footer (via `slot` or template override)
- Group Items
- Tooltip for the Disabled Items.
- Expandable Menu Items
- `href` (Link) support for an Item. It may be set to open in a new window only. In that case, it’s trailing icon is also auto-chosen.
- Sub-Menu: Opens another menu on the side of the current menu. (Long-term defer)
