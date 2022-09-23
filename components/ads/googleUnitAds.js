import Script from 'next/script'

export const GoogleUnitAds = () => {
  return (
    <Script
      id="Adsense-id"
      async
      onError={(e) => {
        console.error('Script failed to load', e)
      }}
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3652123808889795"
      crossorigin="anonymous"
    />
  )
}

export const GoogleUnitAdsComponent = () => {
  return (
    <div className="my-2">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3652123808889795"
        data-ad-slot="2637034645"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  )
}
