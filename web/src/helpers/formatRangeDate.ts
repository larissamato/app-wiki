import type { UnitTypeShort } from 'dayjs/esm'

type Date = {
  [K in UnitTypeShort as `$${K}`]: number
} & {
  $H: number
}

export const formatRangeDate = (e: Date) =>
  `${e.$y}-${String(e.$M).padStart(2, '0')}-${String(e.$D).padStart(
    2,
    '0'
  )} ${String(e.$H).padStart(2, '0')}:${String(e.$m).padStart(2, '0')}:${String(
    e.$s
  ).padStart(2, '0')}`
