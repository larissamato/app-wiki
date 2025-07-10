import styled from 'styled-components'

export const Container = styled.div`
  width: 800px;
  @media (max-width: ${props => props.theme.md}) {
    width: 100%;
  }
`
