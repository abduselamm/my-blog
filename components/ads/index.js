import { GoogleHorizontalUnitAdsComponent } from './googleUnitAds'

export const GoogleHorizontalAdUnit = ({ path }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  return (
    <div className="h-auto w-full">
      {isProduction ? <GoogleHorizontalUnitAdsComponent path={path} /> : null}
    </div>
  )
}

// export const GoogleVerticalAdUnit = ({ path }) => {
//   const isProduction = process.env.NODE_ENV === 'production'
//   return (
//     <div className="h-auto w-full">
//       {isProduction ? <GoogleVerticalUnitAdsComponent path={path} /> : null}
//     </div>
//   )
// }
