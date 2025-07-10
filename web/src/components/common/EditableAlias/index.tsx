import { useEffect, useState } from 'react'
import { Space, Input } from 'antd'
import Button from '@common/Button'
import Icon from '@common/Icon'
import { api } from '@helpers/api'
import { IDevice } from '@/types/IDevice'

export const putAlias = (uuid: string, newAlias: string) => {
  return api.put(`device/${uuid}`, { alias: newAlias })
}

interface EditableAliasProps {
  name: {
    name: string
    alias: string | null
    uuid: string
  }
}

const EditableAlias = ({ name }: EditableAliasProps) => {
  useEffect(() => {
    setNewAlias(name?.alias)
    setIsEditing(false)
  }, [name])

  const [isEditing, setIsEditing] = useState(false)
  const [newAlias, setNewAlias] = useState('')

  const handleSave = () => {
    putAlias(name.uuid, newAlias).then(() => setIsEditing(false))
  }

  return (
    <>
      {isEditing ? (
        <Space>
          <Input
            value={newAlias}
            onChange={e => setNewAlias(e.target.value)}
            data-cy="input-alias"
          />
          <Button type="primary" onClick={handleSave} data-cy="save-alias">
            Salvar
          </Button>
        </Space>
      ) : (
        <Space>
          <span>{newAlias}</span>
          <Button
            type="link"
            icon={<Icon name="fa-light fa-pen" color="blue" />}
            onClick={() => setIsEditing(true)}
            data-cy="edit-alias"
          />
        </Space>
      )}
    </>
  )
}

export default EditableAlias
