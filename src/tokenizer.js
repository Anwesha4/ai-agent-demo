export function estimateTokens(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words * 1.3);
}