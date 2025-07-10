import { useState, useCallback } from 'react'

const useModal = () => {
  const [open, setOpen] = useState(false)

  const onCancel = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  return { open, onCancel, onClose: onCancel, onOpen }
}

export default useModal
