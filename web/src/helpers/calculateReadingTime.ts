export const calculateReadingTime = (text: string): number => {
  if (typeof text !== 'string') return 0
  const wpm = 250
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wpm)
}
