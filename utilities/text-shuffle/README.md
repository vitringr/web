# Text Shuffle

Recursive text shuffle effect going from left to right.

**Characters**: Uses both lowercase and uppercase English alphabet, as well as the numbers from 0 to 9 included.

## Performance

The function calls itself recursively using `setTimeout` after a delay of `15` milliseconds.

```typescript
setTimeout(() => {
  start(text, callback, step + 1);
}, 0xf);
```

Using `requestAnimationFrame` could be a bit more performant, but its repeat rate is way too fast sometimes.

If `requestAnimationFrame` calls with `60` FPS (`~16.66` milliseconds), then it should be good, as it is close to the current speed.

```typescript
requestAnimationFrame(() => {
  start(text, callback, step + 1);
});
```

But some machines/browsers can go way beyond that limit, ruining the visual effect.
