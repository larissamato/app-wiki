export const mapCleanFormatFilter = (data: any, value: string, label: string) => {
  const result = data.data.map(item => ({
    value: item[value],
    label: item[label]
  }))
  return result
}
