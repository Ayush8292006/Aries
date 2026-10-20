export default function Container({ className = '', children, ...props }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  )
}