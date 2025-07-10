import { SetURLSearchParams } from "react-router-dom"

export const addSearchParams = (
  name: string,
  setSearchParams: SetURLSearchParams,
  value = '',
) => {
    setSearchParams(searchParams => {
      return new URLSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        ...{[name]: value}
      })
    })
}
