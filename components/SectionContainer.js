import { GoogleVerticalAdUnit } from './ads'

export default function SectionContainer({ children }) {
  return (
    <div className="flex">
      <div className="hidden flex-grow flex-col overflow-auto p-4 sm:flex">
        <GoogleVerticalAdUnit path="1" />
        <GoogleVerticalAdUnit path="2" />
        <GoogleVerticalAdUnit path="3" />
        <GoogleVerticalAdUnit path="4" />
      </div>
      <div className="mx-auto  max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">{children}</div>
      <div className="hidden flex-grow flex-col overflow-auto p-4 sm:flex">
        <GoogleVerticalAdUnit path="5" />
        <GoogleVerticalAdUnit path="6" />
        <GoogleVerticalAdUnit path="7" />
        <GoogleVerticalAdUnit path="8" />
      </div>
    </div>
  )
}
