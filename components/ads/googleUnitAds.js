import { useEffect } from 'react'

export const GoogleHorizontalUnitAdsComponent = ({ path }) => {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (error) {
      console.log(error)
    }
  }, [path])
  return (
    <div className="my-2 h-auto w-full">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client="ca-pub-3652123808889795"
        data-ad-slot="9935303688"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export const GoogleVerticalUnitAdsComponent = ({ path }) => {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (error) {
      console.log(error)
    }
  }, [path])
  return (
    <div className="my-2 h-auto w-full">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client="ca-pub-3652123808889795"
        data-ad-slot="4825962131"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}
