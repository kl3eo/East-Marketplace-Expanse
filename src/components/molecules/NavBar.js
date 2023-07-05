import { isMobile } from 'react-device-detect'
import { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
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
  const buttonText = isMobile ? '➡' : 'SHOW'
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr } = storedFilteredItemsList
  const clickerHandler = (e) => {
    e.preventDefault()
    const { searchInput } = e.target
    if (searchInput.value === lookupStr) return
    dispatch(setLookup(searchInput.value))
    dispatch(setLoading(true))
    // this hack is required or the list may stuck dimmed for good
    if (searchInput.value.length === 0) setTimeout(() => { dispatch(setLoading(false)) }, 12000)
  }
  return (
    <AppBar position="static" sx={{ marginBottom: '12px' }}>
      <Container maxWidth="100%" sx={{ backgroundColor: '#001122' }}>
        <Toolbar disableGutters sx={{ backgroundColor: '#001122' }}>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map(({ title, href }) => <NavItem title={title} href={href} key={title} style={{ maxWidth: isMobile ? '36px' : '120px' }}/>)}
          </Box>
          <form onSubmit={clickerHandler}>
          {(isReady || hasInit) && <input id="searchInput" name="searchInput" placeholder="🔍" type="text" onClick={onCli} style={{ maxWidth: isMobile ? '102px' : '120px', marginRight: isMobile ? '0px' : '8px', fontSize: '20px' }}/>}
          {(isReady || hasInit) && <button type="submit" style={{ maxWidth: isMobile ? '36px' : '96px', fontSize: isMobile ? '16px' : '20px', background: 'transparent', border: '0px', color: '#fff', cursor: 'pointer' }}>{buttonText}</button>}
          </form>
          {account ? <ConnectedAccountAddress account={account}/> : (isReady || hasInit) && <ConnectButton/>}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
