import React, { ReactElement } from 'react';

interface ButtonProps {
  label: string | ReactElement 
  block?: boolean
  disabled?: boolean 
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  size?: string 
  color?: string
  onClick?: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  label,
  block,
  disabled,
  loading,
  type = 'button',
  size = 'md',
  color = 'primary',
  onClick,
  className: additionalClass,
}) => {

  const containerClassName = getContainerClassName({disabled, loading, block, size, color})

  return (
    <button onClick={onClick} className={containerClassName+' '+additionalClass} type={type}>
      {loading ? <Spinner /> : label}
    </button>
  );
};

const getSizeClass = (size: ButtonProps['size']) => {
  switch (size) {
    case 'lg':
      return 'py-3 px-3';
    case 'sm':
      return 'py-1 px-3';
    case 'xs':
      return 'py-0 px-3';
    default:
      return 'py-2 px-3';
  }
};

const getColorClass = (color: ButtonProps['color']) => {
  switch (color) {
    case 'transparent-blue':
      return 'text-blue-500 hover:bg-blue-50';
    case 'transparent-gray':
      return 'text-gray-600 hover:bg-gray-200';
    case 'transparent-gray-no-hover':
      return 'text-gray-600';
    case 'secondary':
      return 'text-blue-500 border border-blue-400 hover:bg-blue-100';
    case 'white':
      return 'text-black border border-gray-400 bg-white hover:bg-gray-200';
    case 'danger':
      return 'text-white border border-red-400 bg-red-500 hover:bg-red-700';
    case 'success':
      return 'text-white border border-green-400 bg-green-500 hover:bg-green-700';
    default:
      return 'text-white border border-blue-400 bg-blue-500 hover:bg-blue-700';
  }
};

const getContainerClassName = ({disabled, loading, block, size, color} : {disabled?: boolean, loading?: boolean, block?: boolean, size?: string, color?: string}) => {
  let className = 'rounded focus:outline-none text focus:shadow-outline flex justify-center text-center border-gray text-sm';

  if (disabled || loading) {
    className += ' opacity-50 pointer-events-none';
  }

  if (block) {
    className += ' w-full';
  }

  className += ` ${getSizeClass(size)} ${getColorClass(color)}`

  return className;
};


const Spinner: React.FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin text-white"
      color="red"
    >
      <style>
        {`.spinner {
          transform-origin: center;
          animation: spinner-animation 2s infinite linear;
        }
        @keyframes spinner-animation {
          100% {
            transform: rotate(360deg);
          }
        }`}
      </style>
      <path
        d="M12 1A11 11 0 1 0 23 12 11 11 0 0 0 12 1Zm0 19a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
        opacity="0.25"
      />
      <path
        fill="white"
        className="spinner"
        d="M12 4a8 8 0 0 1 7.89 6.7A1.53 1.53 0 0 0 21.38 12h0a1.5 1.5 0 0 0 1.48-1.75 11 11 0 0 0-21.72 0A1.5 1.5 0 0 0 2.62 12h0a1.53 1.53 0 0 0 1.49-1.3A8 8 0 0 1 12 4Z"
      />
    </svg>
  );
};
