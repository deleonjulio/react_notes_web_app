import { useNavigate } from "react-router-dom"

export const Link = ({label, url = '#'} : {label: string, url?: string}) => {
  const navigate = useNavigate()
  return (
    <button type="button" className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800" onClick={() => navigate(url)}>
      {label}
    </button>
  )
}