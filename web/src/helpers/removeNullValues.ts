import { IOrder } from '@/types/IOrder'

export const removeNullValues = (obj: IOrder) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null))
}
