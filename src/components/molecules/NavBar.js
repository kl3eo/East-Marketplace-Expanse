import { isMobile } from 'react-device-detect'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Web3Context } from '../providers/Web3Provider'
import NavItem from '../atoms/NavItem'
import ConnectedAccountAddress from '../atoms/ConnectedAccountAddress'
import ConnectButton from '../atoms/ConnectButton'
import SearchTextField from '../atoms/SearchTextField'

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

const NavBar = () => {
  const { account, setSearchStr, searchStr, isReady, hasInit } = useContext(Web3Context)
  const logo = isMobile ? '' : ''
  const navText = isMobile ? '➡' : 'Show'
  const { pathname } = useRouter()

  const navLink = pathname === '/' ? '/markt' : pathname === '/markt' ? '/' : pathname === '/my-nfts' ? '/own' : pathname === '/own' ? '/my-nfts' : '/markt'
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
            {pages.map(({ title, href }) => <NavItem title={title} href={href} key={title} style={{ maxWidth: isMobile ? '30px' : '120px' }}/>)}
          </Box>
          {(isReady || hasInit) && <SearchTextField value={searchStr} onChange={e => setSearchStr(e.target.value)}/>}
          {(isReady || hasInit) && <NavItem title={navText} href={navLink} key={navText}/>}
          {account ? <ConnectedAccountAddress account={account}/> : (isReady || hasInit) && <ConnectButton/>}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
