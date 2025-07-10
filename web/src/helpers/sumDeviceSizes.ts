import { IDevice } from '@types/IDevice'
import humanizeSizes from './humanizeSizes'

export const sumDeviceSizes = (data: IDevice): string | undefined => {
  let base = data.type === 'BAREMETAL' ? 'partitions' : 'disks'
  let item = data.type === 'BAREMETAL' ? 'capacity' : 'size'
  if (data[base]) {
    let sum = humanizeSizes(
      data[base].reduce((acc: number, current) => current[item] + acc, 0)
    )
    return sum
  }
  return '0'
}
