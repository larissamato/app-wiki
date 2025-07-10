import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import useSocket from './useSocket'
import { AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

const verifyActiveTab = (func: (params: any) => void, params: any) => {
  if (!document.hidden) {
    func(params)
  }
}

interface useFetchProps<T, D> {
  func: (params?: D, signal?: AbortSignal) => Promise<AxiosResponse<T, any>>
  deps?: any[]
  initialValue?: any
  params?: D | undefined
  socket?: boolean
}

interface useIntervalFetchProps<T, D> extends Omit<useFetchProps<T, D>, 'soc'> {
  interval?: number
  update?: boolean
}

const useFetch = <T, D>({
  func,
  params,
  deps,
  initialValue = [],
  socket = false
}: useFetchProps<T, D>) => {
  const [data, setData] = useState<T | typeof initialValue>(initialValue)
  const [error, setError] = useState<AxiosError>()
  const [isSuccess, setIsSucess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    handleCall()
  }, deps || [])

  const handleCall = async () => {
    setLoading(true)
    await func(params)
      .then(e => {
        setData(e.data)
        setIsSucess(true)
      })
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }

  if (socket) useSocket(handleCall)
  return {
    data,
    setData,
    loading,
    setLoading,
    isSuccess,
    error,
    refresh: handleCall
  }
}

const useIntervalFetchError = () => {
  const [error, setError] = useState<AxiosError>()
  const navigate = useNavigate()

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate('/logout')
    }
  }, [error, navigate])

  const handleError = (e: any) => {
    setError(e)
  }
  return { handleError, error }
}

export const useIntervalFetch = <T, D>({
  func,
  params,
  deps,
  update = true
}: useIntervalFetchProps<T, D>) => {
  const { handleError, error } = useIntervalFetchError()
  const [data, setData] = useState<any>([])
  const [isSuccess, setIsSucess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    handleCall(controller.signal)
    // const update = setInterval(
    //   () => verifyActiveTab(handleCall, controller.signal),
    //   20000
    // )

    return () => {
      //  clearInterval(update)
      controller.abort()
    }
  }, deps || [])

  const handleCall = async (signal: AbortSignal) => {
    return await func(params, signal)
      .then(e => {
        setData(e.data)
        setIsSucess(true)
      })
      .catch(e => handleError(e))
      .finally(() => {
        setLoading(false)
      })
  }
  return { data, setData, loading, setLoading, isSuccess, error, handleCall }
}
export default useFetch
