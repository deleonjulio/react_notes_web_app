import { AxiosError, AxiosResponse } from "axios"
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { login } from "../../apis/authentication"
import { Input, Button, Label, Link, Head } from "../../components"
import { required, validEmail, emailMaxLength} from "../../utils/inputValidation"

type Inputs = {
  email: string,
  password: string,
}

export const Login = () => {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { mutate, isPending } = useMutation({
      mutationFn: login,
      onSuccess: async ({ data }: AxiosResponse) => {
        console.log(data)
        navigate('/')
      }, onError: (error: unknown) => {
        if (error instanceof AxiosError) {
            if(error?.response?.data.message) {
                setError('email', { type: 'custom', message: error?.response?.data.message });
            } else {
                setError('email', { type: 'custom', message: error.message });
            }
        } else {
            setError('email', { type: 'custom', message: 'Something went wrong.' });
        }
      },
  })
        
  const onSubmit: SubmitHandler<Inputs> = ({email, password}: {email: string, password: string}) => mutate({email, password})

  return (
    <div className="flex justify-center items-center h-screen">
      <Head title="Login" />
      <form className="bg-white rounded m-4 p-6 md:p-12 shadow-xl w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label type="title-1">Log in to your account</Label>
        </div>
        <div className="mb-8">
          <Input 
            type="text" 
            label="Email" 
            register={{...register("email", { required, pattern: validEmail, maxLength: emailMaxLength })}} 
            error={errors.email}
            disabled={isPending}
          />
        </div>
        <div className="mb-4">
          <Input 
            type="password" 
            label="Password" 
            register={{...register("password", { required })}} 
            error={errors.password} 
            disabled={isPending}
          />
        </div>
        <div className="flex items-center justify-end mb-4">
          <Link label="Forgot your password?" url="#" />
        </div>
        <div className="mb-8">
          <Button label="Continue" block type="submit" loading={isPending} size="lg"/>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-sm pr-1 text-gray-500">Dont have an account?</span><Link label="Register" url="/register" />
        </div>
      </form>
    </div>
  )
}