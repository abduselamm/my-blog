import { Container } from './Container'

export const Note = ({ children, className, type = 'info' }) => {
  const design = {
    info: 'bg-teal-100',
    warning: 'bg-yellow-300',
    error: 'bg-red-300',
  }

  return (
    <div
      className={` my-3 flex-col rounded-md ${design[type]} bo border-l-8  p-4 px-5 text-slate-600 ${className}`}
    >
      {children}
    </div>
  )
}
