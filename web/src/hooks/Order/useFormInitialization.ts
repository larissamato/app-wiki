import { useEffect } from 'react';
import { FormInstance } from 'antd';
import { fetchProductData } from '@helpers/Order/fetchProductData';
import { formatItems } from '@helpers/Order/formatOrderItem';
import { initialValues } from '@helpers/Order/initialValues';
import { IOrder } from '@/types/IOrder';
import { formatRelatedProducts } from '@helpers/Order/formatRelatedProducts';

const useFormInitialization = (
  data: IOrder | undefined,
  form: FormInstance,
  debouncedCalculateAndSetPrices: (values: any) => void
) => {
  useEffect(() => {
    const initializeForm = async () => {
      if (data?.uuid) {
        const initialFormValues = initialValues(data)
        form.setFieldsValue(initialFormValues)
        debouncedCalculateAndSetPrices(initialFormValues)
      } else {
        const product = await fetchProductData();
        if (product) {
          const formattedItems = formatItems(product.items);
          const formattedRelatedProducts = formatRelatedProducts(product.related_products)
          form.setFieldsValue({
            items: [{
              product: {
                uuid: product.uuid,
                dc: product.dc,
                type: product.type
              },
              order_request: {
                items: formattedItems,
                related_products: formattedRelatedProducts
              }
            }]
          })
          debouncedCalculateAndSetPrices(form.getFieldsValue(true))
        }
      }
    };

    initializeForm();
  }, [data, form]);
};
export default useFormInitialization
