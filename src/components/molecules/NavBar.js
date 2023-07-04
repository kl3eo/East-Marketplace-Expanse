import { isMobile } from 'react-device-detect'
import { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Web3Context } from '../providers/Web3Provider'
import NavItem from '../atoms/NavItem'
import ConnectedAccountAddress from '../atoms/ConnectedAccountAddress'
import ConnectButton from '../atoms/ConnectButton'
import { useDispatch, useSelector } from 'react-redux'
import { setLookup, setLoading } from '../../../store/actions/dataAction'

const pages = [
  {
    title: isMobile ? '🚀' : 'Market',
    href: '/'
  },
  {
    title: isMobile ? 'Ⓜ' : 'My NFTs',
    href: '/my-nfts'
  }
]

const onCli = (e) => {
  e.preventDefault()
  e.target.value = ''
}
const NavBar = () => {
  const { account, isReady, hasInit } = useContext(Web3Context)
  const logo = isMobile ? '' : ''
  const buttonText = isMobile ? '➡' : 'Show'
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr } = storedFilteredItemsList
  const clickerHandler = (e) => {
    e.preventDefault()
    const { searchInput } = e.target
    dispatch(setLookup(searchInput.value))
    dispatch(setLoading(true))
    // this hack is required when user hits 'show' button with no value while lookup has also not been set; or the list will stay dimmed for good; and if timeout is for a shorter value than 20sec, the search workflow breaks
    if (lookupStr.length === 0) setTimeout(() => { dispatch(setLoading(false)) }, 30000)
  }
  return (
    <AppBar position="static" sx={{ marginBottom: '12px' }}>
      <Container maxWidth="100%" sx={{ backgroundColor: '#001122' }}>
        <Toolbar disableGutters sx={{ backgroundColor: '#001122' }}>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{ p: '10px', flexGrow: { xs: 1, md: 0 }, display: 'flex' }}
          >
            {logo}
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map(({ title, href }) => <NavItem title={title} href={href} key={title} style={{ maxWidth: isMobile ? '36px' : '120px' }}/>)}
          </Box>
          <form onSubmit={clickerHandler}>
          {(isReady || hasInit) && <input id="searchInput" name="searchInput" placeholder="🔍" type="text" onClick={onCli} style={{ maxWidth: isMobile ? '72px' : '120px', marginRight: '10px', fontSize: '24px' }}/>}
          {(isReady || hasInit) && <button type="submit" style={{ maxWidth: isMobile ? '36px' : '96px' }}>{buttonText}</button>}
          </form>
          {account ? <ConnectedAccountAddress account={account}/> : (isReady || hasInit) && <ConnectButton/>}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
