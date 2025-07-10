import {
  Button,
  Form,
  FormInstance,
  Upload,
  UploadFile,
  UploadProps,
  Input,
  message
} from 'antd'
import Modal from '@common/Modal'
import { ModalProps } from 'antd'
import { useTranslation } from 'react-i18next'
import TextInput from '@common/TextInput'
import { api } from '@helpers/api'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useTheme } from 'styled-components'
import { useUser } from '@contexts/UserContext'
import { PropsWithChildren, useState } from 'react'
import ImgCrop from 'antd-img-crop'
import { RcFile } from 'antd/es/upload'
import { getBase64 } from '@helpers/getBase64'
import { ModalContext } from '@contexts/ModalContext'
import { useGenericContext } from '@hooks/useGenericContext'

interface ISettings {
  password?: string
  name?: string
  avatar?: string
}

const changeUser = async (values: ISettings) => {
  return await api.put('/session/user', values)
}

const removeUndefinedValues = (
  obj: ISettings
): Partial<ISettings> | undefined => {
  const values = Object.entries(obj).filter(([_, value]) => value !== undefined)
  if (values.length) {
    return Object.fromEntries(values)
  }
  return undefined
}
const useAvatarPreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handlePreview = async (file: UploadFile) => {
    file.preview = await getBase64(file.originFileObj as RcFile)
    setPreviewImage(file.preview as string)
    setPreviewOpen(true)
  }
  return { onPreview: handlePreview, previewOpen, setPreviewOpen, previewImage }
}
const useSettingsAvatar = () => {
  const form = Form.useFormInstance()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const previewProps = useAvatarPreview()
  const onChange: UploadProps['onChange'] = async ({
    fileList: newFileList
  }) => {
    setFileList(newFileList)
    if (newFileList.length)
      await getBase64(newFileList[0].originFileObj as RcFile).then(base64 =>
        form.setFieldsValue({ avatar: base64.split(',')[1] })
      )
    if (newFileList.length === 0) form.setFieldsValue({ avatar: undefined })
  }

  return {
    ...previewProps,
    fileList,
    onChange
  }
}

const PlusButton = () => {
  return (
    <button style={{ border: 0, background: 'none' }} type="button">
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}></div>
    </button>
  )
}
const SettingsAvatarForm = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation()
  return (
    <Form.Item
      label={t('MODIFYAVATAR')}
      name="avatar"
      getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
      valuePropName="fileList"
    >
      {children}
    </Form.Item>
  )
}

const SettingsAvatar = () => {
  const { previewOpen, setPreviewOpen, previewImage, onChange, ...props } =
    useSettingsAvatar()
  return (
    <>
      <SettingsAvatarForm>
        <ImgCrop rotationSlider>
          <Upload
            customRequest={({ onSuccess }) => onSuccess!('')}
            listType="picture-card"
            {...props}
            onChange={onChange}
          >
            {props.fileList.length < 1 ? <PlusButton /> : null}
          </Upload>
        </ImgCrop>
      </SettingsAvatarForm>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

const messages = {
  name: ['NAMECHANGED', 'NAMENOTCHANGED'],
  password: ['PASSWORDCHANGED', 'PASSWORDNOTCHANGED'],
  avatar: ['AVATARCHANGED', 'AVATARNOTCHANGED']
}

const useSettings = (form: FormInstance) => {
  const [messageApi, contextHolder] = message.useMessage()
  const { setUser } = useUser()
  const { onClose } = useGenericContext(ModalContext)
  const { t } = useTranslation()

  const onFinish = async (values: ISettings) => {
    const filteredValues = removeUndefinedValues(values)
    if (filteredValues) {
      const messageArr = Object.keys(filteredValues).map(
        item => messages[item as keyof typeof messages]
      )
      return await changeUser(values)
        .then(e => {
          messageArr.map(message => {
            messageApi.success(t(message), 2)
          })
          setUser(e.data)
          onClose?.()
          form.resetFields()
        })
        .catch(() => messageApi.error(t(messageArr[1]), 2))
    }
  }

  return { form, onFinish, contextHolder }
}

const SettingsInputsForm = () => {
  const { t } = useTranslation()
  return (
    <>
      <Form.Item name='name' label={t('INPUTNEWNAME')} tooltip={{ title: t('OPTIONAL'), icon: <InfoCircleOutlined /> }} >
        <Input
          data-cy="settings-change-name-input"
        />
      </Form.Item>
      <Form.Item name='password' tooltip={{ title: t('OPTIONAL'), icon: <InfoCircleOutlined /> }} label={t('INPUTNEWPASSWORD')} rules={[{ min: 8, message: t('PASSWORDINVALID') }]} >
        <Input.Password
          data-cy="settings-change-password-input"
        />
      </Form.Item>
    </>
  )
}
const SettingsForm = () => {
  const [form] = Form.useForm()
  const { onFinish, contextHolder } = useSettings(form)
  return (
    <Form
      name="settings"
      id="settings"
      onFinish={onFinish}
      layout="vertical"
      form={form}
    >
      {contextHolder}
      <SettingsInputsForm />
      <SettingsAvatar />
    </Form>
  )
}

const Settings = ({
  open,
  onCancel
}: Required<Pick<ModalProps, 'open' | 'onCancel'>>) => {
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <Modal
      onCancel={onCancel}
      open={open}
      title={t('SETTINGS')}
      footer={[
        <Button
          style={{ backgroundColor: theme?.blue, color: theme?.white }}
          form="settings"
          key="submit"
          htmlType="submit"
        >
          {t('CONFIRM')}
        </Button>
      ]}
      centered
      width="60%"
      data-testid="settings-modal"
    >
      <SettingsForm />
    </Modal>
  )
}
export default Settings
