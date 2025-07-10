import { api } from '@helpers/api'
import {
  IGraphStatiscCount,
  IGraphStatiscUrl,
  IGraph
} from '@/types/IGraphStatisc'
import { IPie } from '@/types/IGraphPie'
import dayjs from 'dayjs'

const getTotalItems = async (url: string) => {
  try {
    const response = await api.get(`/${url}`)
    return response.data
  } catch (error) {
    return 0
  }
}

export const getStatisticCount = async (Summary: IGraphStatiscUrl[]) => {
  const data: IGraphStatiscCount[] = []

  await Promise.all(
    Summary.map(async item => {
      const total = await getTotalItems(item.url)
      pushStatisticData(
        data,
        item,
        total.meta?.total !== undefined ? total.meta.total : 0
      )
    })
  )
  return data
}

const pushStatisticData = (
  data: IGraphStatiscCount[],
  item: IGraph,
  count: number
) => {
  data.push({
    key: item.key,
    count: count
  })
}

export const getTicketCount = async (
  TicketSummary: Omit<IGraph, 'icon' | 'color'>[],
  url: string
) => {
  const data: IPie[] = []
  const count = await getTotalItems(url)
  TicketSummary.map(item => {
    if (count[item.label] !== undefined) {
      pushPieData(data, item, count[item.label])
    } else if (item.label === 'PROCESSING') {
      pushPieData(
        data,
        item,
        count.PROCESSING_ATTRIBUTED + count.PROCESSING_ATTRIBUTED
      )
    }
  })
  return data
}

export const getBackupCount = async (
  BackupSummary: Omit<IGraphStatiscUrl, 'icon' | 'color'>[]
) => {
  const data: IPie[] = []

  await Promise.all(
    BackupSummary.map(async item => {
      item.url = addStartAtParam(item.url)
      const total = await getTotalItems(item.url)
      pushPieData(data, item, total.meta.total)
    })
  )
  return data
}

const addStartAtParam = (url: string) => {
  const today: string = dayjs().format('YYYY-MM-DD')

  return `${url}&start_at=${today}`
}

const pushPieData = (
  data: IPie[],
  item: Omit<IGraph, 'icon' | 'color'>,
  count: number
) => {
  data.push({
    key: item.key,
    type: item.label,
    value: count
  })
}
