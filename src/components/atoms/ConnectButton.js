import { Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Web3Context } from '../providers/Web3Provider'
import { isMobile } from 'react-device-detect'

export default function ConnectButton () {
  const { initializeWeb3 } = useContext(Web3Context)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)

  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
  }, [])

  const buttonText = hasWindowEthereum ? isMobile ? '🦊' : 'Connect' : isMobile ? '🦊' : 'Download Metamask'
  const onClick = () => {
    if (hasWindowEthereum) {
      return initializeWeb3()
    }

    return window.open('https://metamask.io/', '_blank')
  }
  return <Button color="inherit" onClick={onClick}>{buttonText}</Button>
}
