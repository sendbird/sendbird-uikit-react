# Add Icon

When you add icon.svg files into this directory, there are things that you have to remember.

- You should remove the properties `width`, `height`, and `fill`.
  - These properties `width` and `height` disturb to apply the size of Icons
  - The property `fill` disturb to apply the icon color using CSS

You will see this kind of codes when attaching svg file.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32px"
  height="32px"
  viewBox="0 0 64 64"
>
  <g fill="none">
    <path d="..." fill="black" />
  </g>
</svg>
```

So remove those properties to apply the size and color.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="none">
    <path d="..." />
  </g>
</svg>
```
