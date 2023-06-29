import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import Web3Provider from '../src/components/providers/Web3Provider'
import { StylesProvider, createGenerateClassName } from '@mui/styles'
import BaseLayout from '../src/components/layout/Base'
import { wrapper, store } from '../store/store'
import { Provider } from 'react-redux'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const generateClassName = createGenerateClassName({
  productionPrefix: 'c'
})

function MyApp (props) {
  // const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const { Component, ...rest } = props
  const { emotionCache = clientSideEmotionCache, pageProps } = wrapper.useWrappedStore(rest)

  return (
  <Provider store={store}>
    <StylesProvider generateClassName={generateClassName}>
      <Web3Provider>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <title>Room-House NFT Marketplace</title>
          </Head>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>
          </ThemeProvider>
        </CacheProvider>
      </Web3Provider>
    </StylesProvider>
  </Provider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired
}
// export default wrapper.withRedux(MyApp)
export default MyApp
