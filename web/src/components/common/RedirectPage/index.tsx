import Welcome from "@components/Welcome"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
type RedirectPageProps = {
  to: string
}
const RedirectPage = ({ to }: RedirectPageProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [])
  return <Welcome />
}

export default RedirectPage
