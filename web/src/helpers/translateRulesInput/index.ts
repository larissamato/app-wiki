export const translateRules = (
  rules: Array<{ message: string }>,
  t: (rule: string) => string
) => {
  return rules.map((e) => {
    return ({ ...e, message: t(e.message) })
  })
}
