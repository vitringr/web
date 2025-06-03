# Text Shuffle

Text shuffle effect going from left to right.

**Characters**: Uses both lowercase and uppercase English alphabet, as well as the numbers from 0 to 9 included.

> [!TIP] Font Rendering
> In order to prevent texts from realigning themselves all the time, it is best if you **use a monospace font**.
> Also, `text-rendering: optimizeSpeed` in the CSS might be a good idea.

## Example

Example usage with a `setInterval` function, going from `0%` to `100%` at an arbitrary duration and steps.

```typescript
const duration = 1_000;
const steps = 40;

const increment = 1 / steps;
let step = 0;

const interval = setInterval(() => {
  if (step > 1) clearInterval(interval);
  text = TextShuffle.lerp(originalText, (step += increment)));
}, duration / steps);
```
