import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'

import '@fontsource/inter/variable-full.css'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
        {isDevelopment && isSocket && <ClientReload />}

        <Analytics />
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
}
