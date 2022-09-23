import { GoogleAdsScript, GoogleUnitAdsComponent } from './googleUnitAds'

export const GoogleScript = () => {
  // const isProduction = process.env.NODE_ENV === 'production'
  return (
    <div>
      <GoogleAdsScript />
      <GoogleUnitAdsComponent />
    </div>
  )
}
