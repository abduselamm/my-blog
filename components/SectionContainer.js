import { GoogleVerticalAdUnit } from './ads'

export default function SectionContainer({ children, showads = true }) {
  return (
    <div className="flex h-auto">
      {showads ? (
        <div className="relative hidden w-72 flex-col overflow-auto py-3 px-5 sm:flex">
          <GoogleVerticalAdUnit path="1" />
          <GoogleVerticalAdUnit path="2" />
          <GoogleVerticalAdUnit path="3" />
        </div>
      ) : null}
      <div className="mx-auto  max-w-full px-4 sm:px-6 xl:max-w-5xl xl:px-0">{children}</div>
      {showads ? (
        <div className="relative hidden w-72 flex-col overflow-auto p-4 px-5 sm:flex">
          <GoogleVerticalAdUnit path="5" />
          <GoogleVerticalAdUnit path="6" />
          <GoogleVerticalAdUnit path="7" />
        </div>
      ) : null}
    </div>
  )
}
