import { useNavigate } from 'react-router-dom'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { Container } from './style'

const { Search } = Input

const SearchInput = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const handleSearch = (e: string) => {
    navigate(`/search?search=${e}`)
  }
  return (
    <Container>
      <Search
        onSearch={handleSearch}
        enterButton
        placeholder={t('SEARCH')}
        size='large'
        data-cy='searchinput'
      />
    </Container>
  )
}

export default SearchInput
