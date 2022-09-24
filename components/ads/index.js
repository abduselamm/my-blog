import { GoogleUnitAdsComponent } from './googleUnitAds'

export const GoogleScript = ({ path }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  return (
    <div className="h-auto w-full">{isProduction && <GoogleUnitAdsComponent path={path} />}</div>
  )
}
