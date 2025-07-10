import { useEffect, useState } from 'react'
import useDebounce from './useDebounce'
import { handleError } from '@helpers/handleError'
import { MessageInstance } from 'antd/es/message/interface'

interface UseSearchSelect<T, D> {
	initialValue?: T
	func: (search?: string) => Promise<D>
	messageApi?: MessageInstance
	param?: T
}

const useSearchSelect = <T, D>({
	initialValue,
	func,
	messageApi,
	param
}: UseSearchSelect<T, D>) => {
	const [options, setOptions] = useState<T | undefined>(
		initialValue || undefined
	)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const { debouncedValue } = useDebounce(search)
	useEffect(() => {
		handleSearch()
	}, [debouncedValue, param])

	useEffect(() => {
		setLoading(true)
	}, [search])

	const handleSearch = async () => {
		await func(search)
			.then((e: any) => setOptions(e))
			.catch(e => handleError(e, messageApi))
			.finally(() => setLoading(false))
	}
	const onSearch = (search: string) => setSearch(search)
	const onFocus = async () => onSearch('')

	return { options, loading, onSearch, onFocus }
}

export default useSearchSelect