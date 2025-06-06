// import GA from './GoogleAnalytics'
import Plausible from './Plausible'
// import SimpleAnalytics from './SimpleAnalytics'
// import Umami from './Umami'
import siteMetadata from '@/data/siteMetadata'
import GAScript from './GoogleAnalytics'

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return (
    <>
      {/* {isProduction && siteMetadata.analytics.plausibleDataDomain && <Plausible />} */}
      {/* {isProduction && siteMetadata.analytics.simpleAnalytics && <SimpleAnalytics />}
      {isProduction && siteMetadata.analytics.umamiWebsiteId && <Umami />} */}
      {isProduction && siteMetadata.analytics.googleAnalyticsId && <GAScript />}
    </>
  )
}

export default Analytics
