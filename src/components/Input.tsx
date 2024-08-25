import React, { forwardRef } from "react"
import { FieldValues, FieldError } from "react-hook-form"
import { Label } from "."

type InputProps = {
  id?: string
  name?: string 
  type?: string
  placeholder?: string
  label?: string
  register?: FieldValues
  error?: FieldError | null
  disabled?: boolean
  value?: string
  success?: boolean
  size?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  id, 
  name, 
  type, 
  placeholder, 
  label, 
  register,
  error, 
  disabled,
  value,
  success,
  size,
  onChange
}, ref) => {
  const containerClassName = getContainerClassName(error, disabled, success, size)
  return (
    <React.Fragment>
      {label && <Label type="input">{label}</Label>}
      <input autoComplete="off" ref={ref} className={containerClassName} id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} {...register} />
      {error && <span className="text-red-400 text-xs">{error.message}</span>}
    </React.Fragment>
  )
})

const getContainerClassName = (error?: FieldError | null, disabled?: boolean, success?: boolean, size?: string) => {
  let className = 'shadow select-none appearance-none border w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

  if (error) {
    className += ' border-red-400';
  }

  if (success) {
    className += ' border-green-500';
  }

  if (disabled) {
    className += ' bg-gray-200 pointer-events-none';
  }

  if(size === "sm") {
    className += " py-2"
  } else {
    className += " py-3"
  }

  return className;
};
