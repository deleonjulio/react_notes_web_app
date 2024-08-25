import { Button, Head } from "../../components"
import { useNavigate } from "react-router-dom"
export const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Head title="Error" />
      <p className="flex flex-col justify-center items-center min-h-screen">
        <b>Page Not Found</b>
        <p>The requested URL was not found.</p>
        <Button size="sm" color="white" label="Back" onClick={() => navigate(-1)}  />
      </p>
    </div>
  )
}