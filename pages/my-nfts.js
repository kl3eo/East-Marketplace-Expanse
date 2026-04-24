import { LinearProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { NFTModalContext } from '../src/components/providers/NFTModalProvider'
// import InstallMetamask from '../src/components/molecules/InstallMetamask'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
// import { mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds } from '../src/utils/nft'
import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../src/utils/nft'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
// import ConnectWalletMessage from '../src/components/molecules/ConnectWalletMessage'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentDisp, setLoading, setFullyLoaded, setLightBgr } from '../store/actions/dataAction'
import { store } from '../store/store'
// import { isMobile } from 'react-device-detect'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
// const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'

export default function CreatorDashboard () {
  const [nfts, setNfts] = useState([])
  const { setIsDescOpen } = useContext(NFTModalContext)
  const { account, signed, marketplaceContract, nftContract, isReady, hasWeb3, network } = useContext(Web3Context)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, categStr, beau, looping } = storedFilteredItemsList
  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
    // dispatch(setCateg(''))
    // dispatch(setLookup(''))
    // if (document.getElementById('searchInput')) document.getElementById('searchInput').value = ''
    // document.body.style.zoom = typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? '110%' : '110%' // this not working in FF, good in Chrome/Opera
    dispatch(setLightBgr(false))
    setIsDescOpen(true)
  }, [])

  useEffect(() => {
    loadNFTs()
  }, [account, isReady, lookupStr, categStr])

  async function loadNFTs () {
    if (!isReady || !hasWeb3) return <></>
    // const startTime = new Date()

    // const myUniqueCreatedAndOwnedTokenIds = await getUniqueOwnedAndCreatedTokenIds(nftContract)
    // const myUniqueCreatedAndOwnedTokenIds = [603, 604, 605, 606]
    let rawData = []
    const fData = new FormData()

    // this get_data call doesn't need grab param
    fData.append('beau', beau)
    // console.log('append beau in my', beau)
    fData.append('account', account)
    fData.append('sixinro', 0) // always not more than 4 in my-nfts
    if (typeof window !== 'undefined') fData.append('loco', window.location.hostname)
    if (window.location.hostname === 'nudenft.room-house.com') fData.append('theme', 'nude')
    if (window.location.hostname === 'shopping.room-house.com') fData.append('theme', 'eshopping')
    if (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') fData.append('theme', 'portrait')
    if (window.location.hostname === 'mydocs.room-house.com') fData.append('network', 'hd')
    await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
      .then((response) => response.json())
      .then((result) => { rawData = result.map((element) => parseInt(element[0])); rawData = rawData.filter(item => item !== 9598) })
      .catch((err) => { console.log('Fetch fData Error', err) })
    // console.log('rawData', rawData)

    // sort out burned (slow!)
    // const reduced = []; let ii = 0
    // for (ii = 0; ii < rawData.length; ii++) { const el = rawData[ii]; const isBurned = await nftContract.isBurned(el); if (!isBurned) { reduced.push(el) } else { console.log('burned', el) }}
    // rawData = [...reduced]

    const myUniqueCreatedAndOwnedTokenIds = [...rawData]
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { lookupStr, categStr } = storedFilteredItemsList

    // const endTime0 = new Date()
    // const diff = endTime0 - startTime
    // console.log('myUniqueCreatedAndOwnedTokenIds', myUniqueCreatedAndOwnedTokenIds, 'time elapsed', diff)

    // console.log('MYNFTS, signed is', signed)
    let myNfts = []
    try {
      // console.log('my-nfts, market addr', marketplaceContract.address, 'nft contract addr', nftContract.address)
      myNfts = await Promise.all(myUniqueCreatedAndOwnedTokenIds.map(mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account, signed)))
    } catch (e) { console.log(e); alert('Please re-open Metamask and reload this page!'); return }

    // const endTime = new Date()
    // const diff1 = endTime - endTime0
    // console.log('my-nfts', myNfts, 'time elapsed', diff1)

    // myNfts.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })

    const filteredItems = []
    let i = 0
    let j = 0
    const currCateg = categStr.length ? '' : categStr // hack ash
    const currLook = lookupStr.length ? '' : lookupStr // hack ash
    for (i = 0; i < myNfts.length; i++) { const r = new RegExp(currLook, 'gi'); const c = new RegExp(currCateg, 'gi'); if ((currLook.length === 0 && currCateg.length === 0) || (currLook.length === 0 && currCateg.length !== 0 && ((myNfts[i].name && myNfts[i].name.length && c.test(myNfts[i].name)) || (myNfts[i].description && myNfts[i].description.length && c.test(myNfts[i].description)) || (myNfts[i].tags && myNfts[i].tags.length && c.test(myNfts[i].tags)))) || (currLook.length !== 0 && currCateg.length === 0 && ((myNfts[i].name && myNfts[i].name.length && r.test(myNfts[i].name)) || (myNfts[i].description && myNfts[i].description.length && r.test(myNfts[i].description)) || (myNfts[i].tags && myNfts[i].tags.length && r.test(myNfts[i].tags)))) || (currLook.length !== 0 && currCateg.length !== 0 && ((myNfts[i].name && myNfts[i].name.length && r.test(myNfts[i].name) && c.test(myNfts[i].name)) || (myNfts[i].description && myNfts[i].description.length && r.test(myNfts[i].description) && c.test(myNfts[i].description)) || (myNfts[i].tags && myNfts[i].tags.length && r.test(myNfts[i].tags) && c.test(myNfts[i].tags))))) { filteredItems[j] = myNfts[i]; j++ } }
    // console.log('my-nfts: lookup', lookupStr, 'categ:', categStr, 'filtered:', filteredItems)
    setNfts(filteredItems.reverse())
    dispatch(setCurrentDisp(0))
    setIsLoading(false)
    dispatch(setLoading(false))
    if (window.location.hostname === 'shopping.room-house.com') dispatch(setFullyLoaded(false)); else dispatch(setFullyLoaded(true))
  }

  if (!hasWindowEthereum && isReady) return <div style={{ marginTop: '30vh', fontSize: '48px', minWidth: '50vw', textAlign: 'center', marginLeft: 'auto' }}>Install Metamask</div>
  if (looping) return <div style={{ marginTop: '30vh', fontSize: '48px', minWidth: '50vw', textAlign: 'center', marginLeft: 'auto' }}>Some tokens are Locked - Please confirm signing in Metamask!</div>
  // if (!hasWeb3) return <ConnectWalletMessage style={{ marginTop: '64px' }}/>
  if (!network) return <UnsupportedChain style={{ marginTop: '64px' }}/>
  if (isLoading) return <LinearProgress style={{ marginTop: '64px' }}/>

  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={true}/>
  )
}
