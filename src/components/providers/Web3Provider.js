import { createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import axios from 'axios'
import { store } from '../../../store/store'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../../store/actions/dataAction'

const contextDefaultValues = {
  account: '',
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
    setHasInit(true)
    return window.ethereum.request({ method: 'eth_accounts' })
  }

  async function initializeWeb3WithoutSigner () {
    const providerURL = 'https://node.expanse.tech'
    // const providerURL = 'https://cube.room-house.com:8470'
    console.log('w/o signer, req provider')
    const myProvider = ethers.getDefaultProvider(providerURL)
    console.log('w/o signer, got provider', myProvider)
    setHasInit(true)
    setHasWeb3(false)
    await getAndSetWeb3ContextWithoutSigner(myProvider)
    console.log('w/o signer, after set Context')
  }

  async function initializeWeb3 () {
    try {
      console.log('in initializeWeb3 called, ethereum', window.ethereum)
      const accs = hasInit ? ['a'] : await checkConnection()
      if (!window.ethereum || (window.ethereum && !accs.length)) {
        console.log('going to init w/o signer')
        await initializeWeb3WithoutSigner()
        return
      } else {
        console.log('going to init with signer')
      }

      let onAccountsChangedCooldown = false
      const web3Modal = new Web3Modal()
      console.log('start web3modal.connect')
      await web3Modal.clearCachedProvider()
      console.log('cleared cache')
      const connection = await web3Modal.connect()
      setHasWeb3(true)
      setHasInit(true)
      const myProvider = new ethers.providers.Web3Provider(connection, 'any')
      console.log('calling withsigner!?')
      await getAndSetWeb3ContextWithSigner(myProvider)

      function onAccountsChanged (accounts) {
        // Workaround to accountsChanged metamask mobile bug
        if (onAccountsChangedCooldown) return
        onAccountsChangedCooldown = true
        setTimeout(() => { onAccountsChangedCooldown = false }, 1000)
        const changedAddress = ethers.utils.getAddress(accounts[0])
        return getAndSetAccountAndBalance(myProvider, changedAddress)
      }

      function onChainChanged () {
        dispatch(setLoading(true))
        return initializeWeb3()
      }
      connection.on('accountsChanged', onAccountsChanged)
      connection.on('chainChanged', onChainChanged)
    } catch (error) {
      console.log('2: going to init w/o signer')
      initializeWeb3WithoutSigner()
      console.log(error)
    }
  }

  async function getAndSetWeb3ContextWithSigner (provider) {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { loading } = storedFilteredItemsList
    if (loading) setIsReady(false)
    console.log('with signer, isready false, loading', loading)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    await getAndSetAccountAndBalance(provider, signerAddress)
    const networkName = await getAndSetNetwork(provider)
    const success = await setupContracts(signer, networkName)
    if (loading) setIsReady(success)
    console.log('with signer, isready?', success)
  }

  async function getAndSetWeb3ContextWithoutSigner (provider) {
    setIsReady(false)
    const networkName = await getAndSetNetwork(provider)
    console.log('1: network', networkName)
    const success = await setupContracts(provider, networkName)
    console.log('2: setupContracts', success)
    setIsReady(success)
  }

  async function getAndSetAccountAndBalance (provider, address) {
    setAccount(address)
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
    const { data } = await axios(`/api/addresses?network=${networkName}`)
    const marketplaceContract = new ethers.Contract(data.marketplaceAddress, Market.abi, signer)
    setMarketplaceContract(marketplaceContract)
    const nftContract = new ethers.Contract(data.nftAddress, NFT.abi, signer)
    setNFTContract(nftContract)
    return true
  }

  return (
    <Web3Context.Provider
      value={{
        account,
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
