import { Container } from './Container'

export const Note = ({ children, className }) => {
  return <Container className={`bg-cyan-300 text-gray-700 ${className}`}>{children}</Container>
}
