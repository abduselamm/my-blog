import { useEffect } from 'react'

export const GoogleUnitAdsComponent = ({ path }) => {
  const random = Math.random() * 100
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, [path, random])
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
