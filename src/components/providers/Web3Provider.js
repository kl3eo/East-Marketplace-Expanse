import { createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
// import hre from 'hardhat'
// import getSigners from '../../utils/getSigners'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import NFT_HD from '../../../artifacts/contracts/NFT_HD.sol/NFT_HD.json'
import MarketHD from '../../../artifacts/contracts/Marketplace_HD.sol/Marketplace_HD.json'
import axios from 'axios'
import { store } from '../../../store/store'
import { useDispatch } from 'react-redux'
import { setLoading, setLooping } from '../../../store/actions/dataAction'
import { isMobile } from 'react-device-detect'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'

const contextDefaultValues = {
  account: '',
  signed: '',
  network: 'expanse',
  balance: 0,
  connectWallet: () => {},
  marketplaceContract: null,
  nftContract: null,
  isReady: false,
  hasWeb3: false,
  hasInit: false
}

const networkNames = {
  morden: 'EXPANSE',
  unknown: 'LOCALHOST'
}

export const Web3Context = createContext(
  contextDefaultValues
)

export default function Web3Provider ({ children }) {
  const [hasWeb3, setHasWeb3] = useState(contextDefaultValues.hasWeb3)
  const [account, setAccount] = useState(contextDefaultValues.account)
  const [signed, setSigned] = useState(contextDefaultValues.signed)
  const [network, setNetwork] = useState(contextDefaultValues.network)
  const [balance, setBalance] = useState(contextDefaultValues.balance)
  const [marketplaceContract, setMarketplaceContract] = useState(contextDefaultValues.marketplaceContract)
  const [nftContract, setNFTContract] = useState(contextDefaultValues.nftContract)
  const [isReady, setIsReady] = useState(contextDefaultValues.isReady)
  const [hasInit, setHasInit] = useState(contextDefaultValues.hasInit)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('calling initializeWeb3 with useEffect')
    initializeWeb3()
  }, [])

  async function checkConnection () {
    console.log('in checkConnection')
    // const r = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // const r = await window.ethereum._metamask.isUnlocked()
    // const r = []
    // const r = await window.ethereum.request({ method: 'eth_chainId' })
    const r = await window.ethereum.request({ method: 'eth_accounts' })
    return r
  }

  async function initializeWeb3WithoutSigner () {
    // const providerURL = 'https://node.expanse.tech'
    const providerURL = 'https://wien.room-house.com'
    // console.log('w/o signer, req provider')
    const myProvider = ethers.getDefaultProvider(providerURL)
    // console.log('w/o signer, got provider', myProvider)
    setHasWeb3(false)
    await getAndSetWeb3ContextWithoutSigner(myProvider)
    console.log('w/o signer, after set Context')
  }

  async function initializeWeb3 () {
    console.log('in initializeWeb3 called, hasInit', hasInit, 'ethereum', window.ethereum, 'ready', isReady, 'account', account, 'network', network, 'hasweb3', hasWeb3)
    if (hasWeb3) return
    try {
      const accs = hasInit || isMobile ? ['a'] : await checkConnection()
      // const notLocked = await isUnlocked()
      // console.log('accs', accs, 'unlocked', notLocked)

      // const accs = await checkConnection()
      if (!window.ethereum || (window.ethereum && !accs.length)) {
        console.log('going to init w/o signer')
        await initializeWeb3WithoutSigner()
        return
      } else {
        // console.log('going to init with signer, accs', accs, 'ethereum', window.ethereum)
        // dispatch(setFullyLoaded(false)); console.log('falser 12')
      }

      let onAccountsChangedCooldown = false
      const web3Modal = new Web3Modal()
      console.log('start web3modal.connect')
      await web3Modal.clearCachedProvider()
      // console.log('cleared cache')
      const connection = await web3Modal.connect()
      setHasWeb3(true)
      setHasInit(true)
      // console.log('set hasInit2')
      const myProvider = new ethers.providers.Web3Provider(connection, 'any') // gives different signatures?
      // const myProvider = new ethers.providers.Web3Provider(window.ethereum) // needs much testing ... NOOOOOOOOOOO
      // const myProvider = new ethers.BrowserProvider(window.ethereum) // supported in ethers ^6.9.0
      console.log('calling withsigner, myProvider', myProvider)
      await getAndSetWeb3ContextWithSigner(myProvider, false)
      // console.log('calling getSigners')
      // await getSigners()

      function onAccountsChanged (accounts) {
        // Workaround to accountsChanged metamask mobile bug
        if (onAccountsChangedCooldown) return
        onAccountsChangedCooldown = true
        setSigned('')
        setTimeout(() => { onAccountsChangedCooldown = false }, 1000)
        // const changedAddress = ethers.utils.getAddress(accounts[0])
        // return getAndSetAccountAndBalance(myProvider, changedAddress)
        return getAndSetWeb3ContextWithSigner(myProvider, true)
      }

      function onChainChanged () {
        dispatch(setLoading(true))
        return initializeWeb3()
      }
      connection.on('accountsChanged', onAccountsChanged)
      connection.on('chainChanged', onChainChanged)
    } catch (error) {
      console.log('2: going to init w/o signer')
      // alert('Please open metamask and then reload this page!')
      initializeWeb3WithoutSigner()
      console.log(error)
    }
  }

  /* async function isUnlocked () {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let unlocked
    try {
      const accounts = await provider.listAccounts()
      console.log('accounts', accounts)
      unlocked = accounts.length > 0
    } catch (e) {
      unlocked = false
    }
    return unlocked
  } */

  async function signPersonal (provider, mes) {
    try {
      const accounts = await provider.listAccounts()
      const from = accounts[0]
      const msg = `0x${Buffer.from(mes, 'utf8').toString('hex')}`
      const sign = await window.ethereum.request({ method: 'personal_sign', params: [msg, from] })
      return sign
    } catch (err) {
      console.error(err)
    }
  }

  async function getAndSetWeb3ContextWithSigner (provider, param) {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { loading } = storedFilteredItemsList
    if (loading) setIsReady(false)
    // console.log('with signer, setting isready false, loading', loading)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    let signature = 'hello'
    let res = ''
    try { const fData = new FormData(); fData.append('acc', signerAddress); res = await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/check_signed.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((res) => { return res }) } catch (e) { console.log('failed check_signer') }
    console.log('AFTER SIGN CHECK', res, 'signed', signed)
    if (res.result !== 'OK' && signed === '' && /my-nfts$/i.test(window.location.href) && !param) { dispatch(setLooping(true)); signature = await signPersonal(provider, signature); /* signature = await signer.signMessage(signature); console.log('signature set to', signature); */ setSigned(signature); dispatch(setLooping(false)) }
    await getAndSetAccountAndBalance(provider, signerAddress)
    const networkName = await getAndSetNetwork(provider)
    const success = await setupContracts(signer, networkName)
    if (loading) setIsReady(success)
    // console.log('with signer, isready?', success)
    // dispatch(setFullyLoaded(true))
  }

  async function getAndSetWeb3ContextWithoutSigner (provider) {
    // console.log('w/o signer, setting isready false, hasInit', hasInit)
    if (!hasInit) setIsReady(false)
    const networkName = await getAndSetNetwork(provider)
    console.log('1: network', networkName)
    const success = await setupContracts(provider, networkName)
    console.log('2: setupContracts', success)
    if (!hasInit) setIsReady(success)
    // dispatch(setFullyLoaded(true))
    setHasInit(true)
  }

  async function getAndSetAccountAndBalance (provider, address) {
    setAccount(address)
    console.log('set address to', address)
    const signerBalance = await provider.getBalance(address)
    const balanceInEther = ethers.utils.formatEther(signerBalance, 'ether')
    setBalance(balanceInEther)
  }

  async function getAndSetNetwork (provider) {
    const { name: network } = await provider.getNetwork()
    const networkName = networkNames[network]
    setNetwork(networkName)
    return networkName
  }

  async function setupContracts (signer, networkName) {
    if (!networkName) {
      setMarketplaceContract(null)
      setNFTContract(null)
      return false
    }
    // const { data } = await axios(`/api/addresses?network=${networkName}`)
    const { data } = typeof window !== 'undefined' && (window.location.hostname === 'happydox.room-house.com' || window.location.hostname === 'mydocs.room-house.com') ? await axios(`/api/addresses?network=${networkName + '_HD'}`) : split96 ? await axios(`/api/addresses?network=${networkName + '_HD96'}`) : await axios(`/api/addresses?network=${networkName}`)
    // console.log('Here wind type', typeof window, 'location', window.location.hostname)
    const marketplaceContract = typeof window !== 'undefined' && (window.location.hostname === 'happydox.room-house.com' || window.location.hostname === 'mydocs.room-house.com' || window.location.hostname === 'split.room-house.com') ? new ethers.Contract(data.marketplaceAddress, MarketHD.abi, signer) : new ethers.Contract(data.marketplaceAddress, Market.abi, signer)
    setMarketplaceContract(marketplaceContract)
    const nftContract = typeof window !== 'undefined' && (window.location.hostname === 'happydox.room-house.com' || window.location.hostname === 'mydocs.room-house.com' || window.location.hostname === 'split.room-house.com') ? new ethers.Contract(data.nftAddress, NFT_HD.abi, signer) : new ethers.Contract(data.nftAddress, NFT.abi, signer)
    setNFTContract(nftContract)
    // console.log('web3Provider, market addr', marketplaceContract.address, 'nft contract addr', nftContract.address)
    return true
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        signed,
        marketplaceContract,
        nftContract,
        isReady,
        network,
        balance,
        initializeWeb3,
        hasWeb3,
        hasInit
      }}
    >
      {children}
    </Web3Context.Provider>
  )
};
