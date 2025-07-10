import { DefaultOptionType } from "antd/es/select"
import { AxiosResponse } from "axios"

interface IConstants {
	[key: string]: {
		[key: string]: string
	}
}
export const mapConstantsItemsFilter = (
	constants: AxiosResponse<IConstants>,
	name: string
): DefaultOptionType[] => {
	const values = Object.values(constants.data[name])
	const filteredItems = values.map((e) => {
		return { value: e, label: e }
	})
	return filteredItems as DefaultOptionType[]
}