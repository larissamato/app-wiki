import { useState, useRef, useCallback, Dispatch, SetStateAction } from 'react'
import {
  FormInstance,
} from 'antd'
import { api } from '@helpers/api'
import { calculateOrderPrice } from '@helpers/Order/calculateOrderPrice'
import { debounce } from 'lodash'
import { formatOrderItem } from '@helpers/Order/formatOrderItem'

const useFormCalculations = (form: FormInstance, setPrice: Dispatch<SetStateAction<number>>) => {
  const [subtotals, setSubtotals] = useState<number[]>([])
  const subtotalsRef = useRef<number[]>([])

  const calculateSubtotal = useCallback(async (
    items: any[],
    index: number,
  ): Promise<number> => {
    const currentItem = items[index]
    if (!currentItem?.product?.uuid || !currentItem?.order_request?.items) {
      return Promise.resolve(0)
    }

    return api.post(`/order/calculate`, {
      items: [
        {
          product: {
            uuid: currentItem.product.uuid,
            device: currentItem.product.device
          },
          order_request: {
            support_level: 'BASIC',
            items: currentItem.order_request.items
              .map(formatOrderItem)
              .filter(Boolean)
          }
        }
      ]
    }).then(response => response.data?.price_total ?? 0)
  }, [])


  const calculateAllSubtotals = useCallback(async (items: any[]) => {
    const newSubtotals: number[] = []
    const promises = items.map(async (item, i) => {
      if (item?.product?.uuid) {
        return calculateSubtotal(items, i)
          .then(subtotal => {
            newSubtotals[i] = subtotal
          })
      }
      newSubtotals[i] = 0
      return Promise.resolve()
    })

    return Promise.all(promises)
      .then(() => {
        subtotalsRef.current = newSubtotals
        setSubtotals(newSubtotals)
      })
  }, [calculateSubtotal])

  const debouncedCalculateAndSetPrices = useCallback(
    debounce((currentFormValues) => {
      calculateOrderPrice(currentFormValues, setPrice);
      form.validateFields(['items'])
        .then(() => calculateAllSubtotals(currentFormValues?.items || []));
    }, 500),
    [form, setPrice, calculateAllSubtotals]
  );

  return {
    calculateSubtotal,
    calculateAllSubtotals,
    debouncedCalculateAndSetPrices,
    setSubtotals,
    subtotals
  };
};

export default useFormCalculations
