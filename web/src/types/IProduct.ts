import {
  ButtonProps,
  CardProps,
  FormListFieldData,
  FormListOperation
} from 'antd'
import { NamePath } from 'antd/es/form/interface'
import { DrawerProviderType } from '@contexts/DrawerContext'

export interface IProduct {
  uuid: string
  name: string
  type: string
  items: Array<IProductItem>
  dc: string
  related_products: IRelatedProducts[]
}

export interface IRelatedProducts extends IProduct {
  pivot: IPivot
}

export interface IPivot {
  parent_product_id: number;
  child_product_id: number;
  max: number;
  support_level: string
  created_at: string;
  updated_at: string;
}

export interface IProductItem {
  name: string
  uuid: string
  price: number | string
  min: number | null
  required: boolean | null
  max: number | null
  step: number | null
  default: number | null
  children: Array<IProductItem> | [] | null
}

export interface ProductFormListProps {
  actions: FormListOperation
  index: any
  field: FormListFieldData
  path?: NamePath
  name?: Array<any>
}

export interface ProductMinorMaxInputProps {
  field: number
  name: 'min' | 'max' | 'default'
  path: NamePath
}

export interface ProductFormListFieldsProps {
  name: FormListFieldData['name']
  path: NamePath
}

export interface AddItemButtonProps extends ButtonProps {
  add: () => void
  span?: number
  path?: NamePath
}

export interface ProductFormListCard extends Omit<CardProps, 'actions'> {
  field: FormListFieldData
  actions: FormListOperation
  index: number
  path: NamePath
}

export interface IProductPod {
  uuid: string
  title: string
  description: string
  dcs: string[]
  images: [
    {
      uuid: string
      name: string
    }
  ]
  price: number
  available: boolean
  canBuy: boolean
  discounted: number
}

export interface IProductVm {
  uuid: string
  title: string
  description: string
  dcs: string[]
  oses: [
    {
      name: string
      type: string
      uuid: string
    }
  ]
  price: number
  available: boolean
}

export interface BalanceContextType extends DrawerProviderType {
  data: IProductPod
  numForm: string
}
