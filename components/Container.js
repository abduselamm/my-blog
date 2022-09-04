const Container = ({ className, children }) => {
  return <div className={`flex w-full items-center justify-center ${className}`}>{children}</div>
}

export default Container
