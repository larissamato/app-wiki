import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IDevice } from '@/types/IDevice'
import { useTranslation } from 'react-i18next'
import { api } from '@helpers/api'
import RenderPage from '@components/common/RenderPage'
import { DeviceContext } from '@contexts/DeviceContext'
import DeviceForm from '@components/Device/Form'
import Title from '@components/common/Title'
import { Button, Form, Popconfirm, Row, Typography } from 'antd'
import Icon from '@components/common/Icon'
import { useGenericContext } from '@hooks/useGenericContext'
import { MessageContext } from '@contexts/MessageContext'
import { handleError } from '@helpers/handleError'
import { removeNullValues } from '@helpers/removeNullValues'

const revertAcess = (access) => {
	if (!access) return undefined
	const revertedAccess = {}
	access.map(e => (
		revertedAccess[e.key] = { ip: e.ip, port: e.port, url: e.url }
	))
	return revertedAccess
}
const useEditDevice = () => {
	const message = useGenericContext(MessageContext)
	const { t } = useTranslation()
	const { uuid } = useParams()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<IDevice | undefined>()
	useEffect(() => {
		api.get(`/device/${uuid}`)
			.then(e => (
				e.data.type === 'BAREMETAL'
					? api.get(`/device/${uuid}/hardware`).then(hard => {
						return setData({ ...e.data, ...hard.data })
					}) : setData(e.data)
			)).finally(() => setLoading(false))
	}, [])
	const onFinish = (values: IDevice) => {
		const customValues = removeNullValues({
			...values,
			access: revertAcess(values.access)
		})

		api.put(`/device/${uuid}`, customValues)
			.then((e) => {
				message.success(t("DEVICEUPDATED"))
				setData(e.data)
			})
			.catch((e) => { handleError(e, message, t("ERRORUPDATINGDEVICE")) })
	}
	return { data, setData, loading, onFinish }
}


const EditDevice = () => {
	const { t } = useTranslation()
	const [form] = Form.useForm()
	const { data, setData, loading, onFinish } = useEditDevice()
	const memoData = useMemo(() => ({ data, setData }), [data])
	return (
		<RenderPage {...{ data, loading }}>
			<DeviceContext.Provider value={memoData}>
				<Title name={`${t('EDIT')} ${t('DEVICE')} ${data?.name}`} >
					<Row style={{ width: '100%' }} justify='space-between'>
						<Typography.Title>
							{`${t('EDIT')} ${t('DEVICE')} ${data?.name}`}
						</Typography.Title>
						<Popconfirm
							data-cy='confirm-edit'
							title={t("AREYOUSUREEDITDEVICE")}
							onConfirm={form.submit}
						>
							<Button
								data-cy='confirm-edit'
								type='primary'
								icon={<Icon name='fa-light fa-check' color='white' />}
							>
								{t('CONFIRMEDITION')}</Button>
						</Popconfirm>
					</Row>
				</Title>
				<DeviceForm {...{ form, onFinish }} />
			</DeviceContext.Provider>
		</RenderPage >
	)
}

export default EditDevice
