import { isMobile } from 'react-device-detect'
import { shortenAddress, shortShortenAddress } from '../../utils/format'
import { chains } from '../../utils/web3'
import NavItem from './NavItem'

export default function ConnectedAccountAddress ({ account }) {
  const accountUrl = `${chains.expanse.explorers[0].url}/address/${account}`
  return <NavItem title={isMobile ? shortShortenAddress(account) : shortenAddress(account)} href={accountUrl} openNewTab={true}/>
}
