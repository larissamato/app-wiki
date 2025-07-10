import { SetURLSearchParams } from 'react-router-dom'

export const deleteSearchParams = (
  name: string,
  setSearchParams: SetURLSearchParams
) => {
  setSearchParams(searchParams => {
    const params = new URLSearchParams({
      ...Object.fromEntries(searchParams.entries())
    })
    params.delete(name)
    return params
  })
}
