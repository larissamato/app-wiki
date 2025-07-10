import styled from 'styled-components'
export const Container = styled.header`
  background-color: ${props => props.theme.background};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 15px;
  @media (max-width: ${props => props.theme.md}) {
    padding: 10px 10px 10px 0;
    flex-direction: column-reverse;
    gap: 10px;
  }
`

export const ActionsGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-items: center;
  @media (max-width: ${props => props.theme.md}) {
    width: 100%;
    justify-content: flex-end;
    gap: 5px;
  }
`

export const ActionButton = styled.button`
  height: 30px;
  overflow: hidden;
  gap: 5px;
  color: ${props => props.theme.gray};
`
