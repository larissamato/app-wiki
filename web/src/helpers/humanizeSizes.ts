const prefixSize = [
  { size: Math.pow(1024, 1), prefix: 'kB' },
  { size: Math.pow(1024, 2), prefix: 'MB' },
  { size: Math.pow(1024, 3), prefix: 'GB' },
  { size: Math.pow(1024, 4), prefix: 'TB' }
]

const humanizeSizes = (size: number) => {
  for (let i = prefixSize.length - 1; i >= 0; i--) {
    if (size > prefixSize[i].size) {
      return Math.round(size / prefixSize[i].size) + prefixSize[i].prefix
    }
  }
}
export default humanizeSizes
