import { RcFile } from 'antd/es/upload'

export const getBase64 = async (file: RcFile | File): Promise<string> =>
  await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
