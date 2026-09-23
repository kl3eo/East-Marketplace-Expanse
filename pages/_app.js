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
import { useRouter } from 'next/router'
import { isAndroid } from 'react-device-detect'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const generateClassName = createGenerateClassName({
  productionPrefix: 'c'
})

function MyApp (props) {
  /* const [isAndroid, setIsAndroid] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera
    setIsAndroid(/android/i.test(ua))
  }, []) */
  const { asPath } = useRouter()
  const paths = asPath.split('?')
  const defVal = !asPath.match(/\?/) || !paths[1].length
  const { Component, ...rest } = props
  const { emotionCache = clientSideEmotionCache, pageProps } = wrapper.useWrappedStore(rest)
  const titel = typeof window !== 'undefined' && window.location.hostname.match(/tokenizer/ig) ? 'FileTokenizer' : typeof window !== 'undefined' && window.location.hostname.match(/motivation/ig) ? 'Мотивация: Коллекционер' : typeof window !== 'undefined' && window.location.hostname.match(/room-house/ig) ? 'Room-House Token Gallery' : ''
  const title = defVal ? titel : decodeURIComponent(paths[1])
  const viewpo = typeof window !== 'undefined' && window.location.hostname.match(/tokenizer/ig) ? 'width=380' : isAndroid ? window.location.hostname.match(/happyminter/ig) ? 'width=device-width, initial-scale=0.84' : 'width=device-width, initial-scale=0.72' : 'width=device-width, initial-scale=0.96'

  return (
  <Provider store={store}>
    <StylesProvider generateClassName={generateClassName}>
      <Web3Provider>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content={viewpo} />
            <title>{title}</title>
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
