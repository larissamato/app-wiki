import { useEffect } from 'react'

const useDisableButtonModal = (
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  disabled: boolean
) => {
  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])
}

export default useDisableButtonModal
