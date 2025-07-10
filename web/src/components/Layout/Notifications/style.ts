import { styled } from 'styled-components'

export const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin: 8px 0;
  a {
    text-decoration: none;
    color: ${props => props.theme.gray};
  }
`
export const NotificationsList = styled.div`
  gap: 20px;
`
