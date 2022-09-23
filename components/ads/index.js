import { GoogleAdsScript, GoogleUnitAdsComponent } from './googleUnitAds'

export const GoogleScript = () => {
  // const isProduction = process.env.NODE_ENV === 'production'
  return (
    <>
      <GoogleAdsScript />
      <GoogleUnitAdsComponent />
    </>
  )
}

{
  /* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3652123808889795"
     crossorigin="anonymous"></script>
<!-- display ads -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-3652123808889795"
     data-ad-slot="2637034645"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script> */
}
