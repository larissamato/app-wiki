import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { queryListWithPagination } from '@helpers/QueryListWithPagination'
import { useSearchParams, useLocation } from 'react-router-dom'
import { addSearchParams } from '@helpers/addSearchParams/index.js'
import { SortOrder } from 'antd/es/table/interface.js'
import { useUser } from '@contexts/UserContext'
import { UseTable } from '@/types/UseTable'

type PaginationProps = { current: number; pageSize: number }

const initialValue = (perPage: number) => ({ current: 1, pageSize: perPage })

const handlePaginationListener = (
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
  pagination: PaginationProps,
  setLoading: any,
  setPerPage: Dispatch<SetStateAction<number>>
) => {
  setLoading(true)
  setPagination(prevPagination => ({
    ...prevPagination,
    current: pagination.current,
    pageSize: pagination.pageSize
  }))
  if (pagination.pageSize) {
    setPerPage(() => {
      if (localStorage.getItem('perPage') !== String(pagination.pageSize))
        window.localStorage.setItem('perPage', String(pagination.pageSize))
      return pagination.pageSize
    })
  }
}

const handleSorterListener = (sorter, setSearchParams, setLoading) => {
  setLoading(true)
  const sorts = (field: SortOrder) => ({
    ascend: field,
    descend: '-' + field
  })
  if (sorter.field) {
    const sort = sorter.order ? sorts(sorter.field)[sorter.order] : ''
    addSearchParams('sort', setSearchParams, sort)
  }
}

const useListenerTableChange = (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setPagination: Dispatch<SetStateAction<PaginationProps>>
) => {
  const { setPerPage } = useUser()
  const [_, setSearchParams] = useSearchParams()

  const handleTableChange = (
    pagination: PaginationProps,
    _: any,
    sorter: { order: 'ascend' | 'descend' | undefined; field: string }
  ) => {
    if (sorter) {
      handleSorterListener(sorter, setSearchParams, setLoading)
    }
    if (pagination) {
      handlePaginationListener(
        setPagination,
        pagination,
        setLoading,
        setPerPage
      )
    }
  }
  return handleTableChange
}

const useQueryDataTable = (url: string, current: number, setPagination,cancelSearch) => {
  const { perPage } = useUser()
  const { search } = useLocation()
  const { isSuccess, ...queryProps } = queryListWithPagination(url, current,cancelSearch)

  useEffect(() => {
    queryProps.setLoading(true)
    setPagination(initialValue(perPage))
  }, [perPage, search])

  return { ...queryProps, setPagination }
}

const useTable = <T>(url: string, cancelSearch): UseTable<any, T> => {
  const { perPage, setPerPage } = useUser()
  const [pagination, setPagination] = useState(initialValue(perPage))
  const queryProps = useQueryDataTable(url, pagination.current, setPagination,cancelSearch)

  return {
    ...queryProps,
    pagination,
    handleTableChange: useListenerTableChange(
      queryProps.setLoading,
      setPagination
    ),
    onChange: (page: number) => {
      queryProps.setLoading(true)
      setPagination(currentPage => ({ ...currentPage, current: page }))
    },
    onShowSizeChange: (_, pageSize: number) => {
      queryProps.setLoading(true)
      setPerPage(pageSize)
      setPagination(currentPage => ({ ...currentPage, pageSize: pageSize }))
    }
  }
}

export default useTable
