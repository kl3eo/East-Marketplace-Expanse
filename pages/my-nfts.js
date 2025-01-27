import { LinearProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import InstallMetamask from '../src/components/molecules/InstallMetamask'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds } from '../src/utils/nft'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import ConnectWalletMessage from '../src/components/molecules/ConnectWalletMessage'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentDisp, setLoading } from '../store/actions/dataAction'
import { store } from '../store/store'

export default function CreatorDashboard () {
  const [nfts, setNfts] = useState([])
  const { account, marketplaceContract, nftContract, isReady, hasWeb3, network } = useContext(Web3Context)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr } = storedFilteredItemsList
  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
  }, [])

  useEffect(() => {
    loadNFTs()
  }, [account, isReady, lookupStr])

  async function loadNFTs () {
    if (!isReady || !hasWeb3) return <></>
    // const startTime = new Date()
    const myUniqueCreatedAndOwnedTokenIds = await getUniqueOwnedAndCreatedTokenIds(nftContract)
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { lookupStr } = storedFilteredItemsList
    // const endTime0 = new Date()
    // const diff = endTime0 - startTime
    // console.log('myUniqueCreatedAndOwnedTokenIds', myUniqueCreatedAndOwnedTokenIds, 'time elapsed', diff)
    const myNfts = await Promise.all(myUniqueCreatedAndOwnedTokenIds.map(
      mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)
    ))
    // const endTime = new Date()
    // const diff1 = endTime - endTime0
    // console.log('my-nfts', myNfts, 'time elapsed', diff1)
    myNfts.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const filteredItems = []
    let i = 0
    let j = 0
    for (i = 0; i < myNfts.length; i++) { const r = new RegExp(lookupStr, 'gi'); if (lookupStr.length === 0 || (myNfts[i].name && myNfts[i].name.length && r.test(myNfts[i].name)) || (myNfts[i].description && myNfts[i].description.length && r.test(myNfts[i].description)) || (myNfts[i].tags && myNfts[i].tags.length && r.test(myNfts[i].tags))) { filteredItems[j] = myNfts[i]; j++ } }
    setNfts(filteredItems)
    dispatch(setCurrentDisp(0))
    setIsLoading(false)
    dispatch(setLoading(false))
  }

  if (!hasWindowEthereum && isReady) return <InstallMetamask/>
  if (!hasWeb3) return <ConnectWalletMessage/>
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>

  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={true}/>
  )
}
