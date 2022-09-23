import { GoogleUnitAds } from './googleUnitAds'

export const UnitAds = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  return <>{isProduction && <GoogleUnitAds />}</>
}
