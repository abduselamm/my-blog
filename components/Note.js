import { Container } from './Container'

export const Note = ({ children, className, type = 'info' }) => {
  const design = {
    info: {
      bg: 'bg-teal-100',
      borderColor: 'border-teal-400',
    },
    warning: {
      bg: 'bg-yellow-100',
      borderColor: 'border-yellow-400',
    },

    error: {
      bg: 'bg-red-100',
      borderColor: 'border-red-400',
    },
    tip: {
      bg: 'bg-blue-100',
      borderColor: 'border-blue-400',
    },
  }

  return (
    <div
      className={` my-3 flex-col ${design[type].bg} ${design[type].borderColor} bo border-l-8  p-4 px-5 text-slate-600 ${className}`}
    >
      {children}
    </div>
  )
}
