export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// The same one-second transition at 12, 30 or 60 rendered frames per second.
export function damp(current, target, rate, delta) {
  return current + (target - current) * (1 - Math.exp(-rate * delta));
}

export function storyProgress(top, height, stageHeight, inset) {
  return clamp((inset - top) / Math.max(1, height - stageHeight));
}

export function orthographicFrame(aspect, width, height) {
  const vertical = Math.max(height, width / Math.max(.1, aspect));
  return { width: vertical * aspect, height: vertical };
}
