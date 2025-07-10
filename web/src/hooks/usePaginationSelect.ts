import { useEffect, useRef, useState } from 'react'
import { IService } from '@/types/IService'
import useDebounce from './useDebounce'

const LAST_PAGE = 1000

const filterIfInitialValue = (
  e: { data: IService[] },
  initialValue: IService[] | undefined
) => {
  return initialValue
    ? e.data.filter(newService => newService.uuid !== initialValue[0].uuid)
    : e.data
}

const usePaginationSelect = <T, D>({
  initialValue,
  func
}: {
  initialValue?: IService[]
  func: (e?: any, page?: number) => Promise<D>
}) => {
  const initialRef = useRef(true)
  const [page, setPage] = useState({ current: 1, last_page: LAST_PAGE })
  const [options, setOptions] = useState(initialValue || undefined)
  const [loading, setLoading] = useState(false)
  const [saveSearch, setSaveSearch] = useState('')
  const { debouncedValue } = useDebounce(saveSearch)
  const onSearch = (value = '') => setSaveSearch(value)
  useEffect(() => {
    setPage(prevState => ({ ...prevState, current: 1 }))
    setLoading(true)
    if (!initialRef.current)
      func(debouncedValue, page.current)
        .then((e: any) => {
          setOptions(e.data)
        })
        .finally(() => setLoading(false))
    initialRef.current = false
  }, [debouncedValue])

  const onSearchPagination = async () => {
    await func(saveSearch, page.current)
      .then((e: any) => {
        const newData = filterIfInitialValue(e, initialValue)
        setOptions([...options, ...newData])
        setPage({ current: page.current + 1, last_page: e.meta.last_page })
      })
      .finally(() => setLoading(false))
  }

  const onPopupScroll = async (e?: any) => {
    setLoading(true)
    const { target } = e
    if (
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      page.current <= page.last_page
    ) {
      onSearchPagination()
    }
  }

  return { options, loading, onPopupScroll, onSearch }
}

export default usePaginationSelect
