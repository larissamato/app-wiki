import { useEffect, useRef, useState } from 'react'

const useDebounce = (value: string | undefined) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const initialRef = useRef(true)
  const updateDebouncing = () => setDebouncedValue(value)
  useEffect(() => {
    if (initialRef.current) {
      setDebouncedValue(value)
      initialRef.current = false
      return
    }
    const update = setTimeout(updateDebouncing, 300)
    return () => {
      clearTimeout(update)
    }
  }, [value])

  return { debouncedValue }
}

export default useDebounce
