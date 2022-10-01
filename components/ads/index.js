import { GoogleHorizontalUnitAdsComponent, GoogleVerticalUnitAdsComponent } from './googleUnitAds'

export const GoogleHorizontalAdUnit = ({ path }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  return (
    <div className="h-auto w-full">
      {isProduction && <GoogleHorizontalUnitAdsComponent path={path} />}
    </div>
  )
}

export const GoogleVerticalAdUnit = ({ path }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  return (
    <div className="h-auto">{isProduction && <GoogleVerticalUnitAdsComponent path={path} />}</div>
  )
}
