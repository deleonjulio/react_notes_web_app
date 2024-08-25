import React, { useState } from "react"
import { AxiosError, AxiosResponse } from "axios"
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { register as registerApi } from "../../apis/register"
import { Input, Button, Label, Link, Head } from "../../components"
import { required, validEmail, emailMaxLength } from "../../utils/inputValidation"

type Inputs = {
  email: string,
  name: string,
  password: string,
  birthDate: string
}

export const Register = () => {
  const [isDone, setIsDone] = useState(false)
  const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>({shouldFocusError: false})

  const { mutate, isPending } = useMutation<AxiosResponse, AxiosError, Inputs>({
    mutationFn: registerApi,
    onSuccess: async () => {
        setIsDone(true)
    }, onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if(error?.response?.data.message) {
          setError('email', { type: 'custom', message: error?.response?.data.message });
        } else {
          console.log(error)
          setError('email', { type: 'custom', message: error.message });
        }
      } else {
        setError('email', { type: 'custom', message: 'Something went wrong.' });
      }
    },
  })
    
  const onSubmit: SubmitHandler<Inputs> = data => mutate({...data})

  return (
    <div className="flex justify-center items-center h-screen">
      <Head title="Register" />
      <div className="bg-white rounded m-4 p-6 md:p-12 shadow-xl w-full max-w-lg">
        {
          isDone ? (
            <React.Fragment>
              <p className="text-xl font-bold text-gray-700 mb-4">Congratulations!</p>
              <p className="font-light">You have successfully registered.</p>
              <p className="font-light pb-4">A verification link has been sent to your email. Simply click on the link to verify your email.</p>
              <Link label="Return to login" url="/login" />
            </React.Fragment>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Label type="title-1">Create your account</Label>
              </div>
              <div className="mb-4">
                <Input 
                  type="text" 
                  label="Name" 
                  register={{...register("name", { required })}} 
                  error={errors.name}
                  disabled={isPending}
                />
              </div>
              <div className="mb-4">
                <Input 
                  type="text" 
                  label="Email" 
                  register={{...register("email", { required, pattern: validEmail, maxLength: emailMaxLength })}} 
                  error={errors.email}
                  disabled={isPending}
                />
              </div>
              <div className="mb-8">
                <Input 
                  type="password" 
                  label="Password" 
                  register={{...register("password", { required })}} 
                  error={errors.password} 
                  disabled={isPending}
                />
              </div>
              <div className="mb-8">
                <Button loading={isPending} label="Create account" block type="submit" size="lg" />
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm pr-1 text-gray-500">Already have an account?</span><Link label="Log in" url="/login" />
              </div>
            </form>
          )
        }
      </div>
    </div>
  )
}