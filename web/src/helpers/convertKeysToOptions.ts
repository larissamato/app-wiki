import { TFunction } from "i18next"

export const convertKeysToOptions = (obj: {}) => {
  return Object.keys(obj).map(item => (
    {value: item, label: item}
  ))
}

export const convertKeysToTranslatedOptions = (
  obj: {},
  t: TFunction
) => {
  return Object
  .keys(obj)
  .map(item => (
    {value: item, label: t(item)}
  ))
}
