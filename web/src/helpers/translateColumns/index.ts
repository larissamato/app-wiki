export const translateColumns = (columns, t, key?: string) => {
  return columns.map(column => {
    if (key) return { ...column, [key]: t(column[key]) }
    return { ...column, title: t(column.title) }
  })
}
