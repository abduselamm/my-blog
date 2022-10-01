import { GoogleVerticalAdUnit } from './ads'

export default function SectionContainer({ children, showads = true }) {
  return (
    <div className="flex">
      {showads ? (
        <div className="relative hidden w-72 flex-col overflow-auto bg-red-300 p-4 sm:flex">
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          book
        </div>
      ) : null}
      <div className="mx-auto  max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">{children}</div>
      {showads ? (
        <div className="relative hidden w-72 flex-col overflow-auto bg-red-300 p-4 sm:flex">
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          <GoogleVerticalAdUnit />
          book
        </div>
      ) : null}
    </div>
  )
}
