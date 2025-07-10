export interface Pool {
  hosts: Array<{
    cpu: number
    mem: number
    name: string
    uuid: string
    disks: {
      [key in 'ssd' | 'nvme']: {
        data: {}
        available_capacity: number
      }
    }
  }>
  total: {
    mems_single_max: {
      max: number
    }
    cpus_single_max: {
      max: number
    }
    disks_single_max: {
      [k in 'nvme' | 'ssd']: {
        max: number
      }
    }
    disks: {
      [k: string]: number
    } | null
  }
}

export interface AutoDeployPoolResponse {
  [key: string]: {
    [key: string]: Pool
  }
}
