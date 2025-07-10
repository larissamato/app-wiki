export interface ICreateForm {
  onClose: () => void
  action: 'create' | 'edit'
  id: string
}
