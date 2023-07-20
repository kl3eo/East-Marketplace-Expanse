import { isMobile } from 'react-device-detect'
import InfiniteScroll from 'react-infinite-scroll-component'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Fade from '@mui/material/Fade'
import { makeStyles } from '@mui/styles'
import NFTCard from '../molecules/NFTCard'
import NFTCardCreation from '../molecules/NFTCardCreation'
import { ethers } from 'ethers'
import { Web3Context } from '../providers/Web3Provider'
import { useContext, useEffect, useState } from 'react'
import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft'
import { store } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentDisp, setCurrentSlice, getData, setRelo } from '../../../store/actions/dataAction'

const useStyles = makeStyles((theme) => ({
  grid: {
    spacing: 3,
    alignItems: 'stretch'
  },
  gridItem: {
    display: 'flex',
    transition: 'all .3s',
    [theme.breakpoints.down('sm')]: {
      margin: '0 20px'
    }
  }
}))

export default function NFTCardList ({ nfts, setNfts, withCreateNFT }) {
  const classes = useStyles()
  const [dimmed, setDimmed] = useState(false)
  const { account, marketplaceContract, nftContract } = useContext(Web3Context)
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, loading, currentDisp, relo } = storedFilteredItemsList

  useEffect(() => {
    if (!relo) {
      window.addEventListener('scroll', withRelo)
      console.log('ADDED relo')
      dispatch(setRelo(true))
    }
    dispatch(setCurrentSlice(0))
  }, [])

  const dispatch = useDispatch()
  let diff = 0
  let alreadyDimmed = false
  // let lastScrollTop = 0
  // the more, the easier it catches (360 catches almost all), but the less, the easier to break free from it; as both things are important, some intermediate ~120
  const lazyLoaderCatchParam = 120

  function withRelo () {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, currentDisp, lookupStr, currentSlice, relo } = storedFilteredItemsList
    // const { storedFilteredItems, currentDisp, lookupStr, relo } = storedFilteredItemsList

    // const st = window.pageYOffset || document.documentElement.scrollTop
    // if (st > lastScrollTop) {
    //  if (alreadyDimmed) setDimmed(true); console.log('DIMMING.. already?', alreadyDimmed)
    // }
    // lastScrollTop = st <= 0 ? 0 : st

    if (withCreateNFT || lookupStr.length) {
      if (relo) {
        window.removeEventListener('scroll', withRelo)
        dispatch(setRelo(false))
        console.log('REMOVED relo1')
      }
      dispatch(setCurrentSlice(0))
      return
    }
    console.log('RELO: offset', window.pageYOffset, 'DIFF', diff)
    if (window.pageYOffset < 0) {
      if (storedFilteredItems && storedFilteredItems.length) {
        window.removeEventListener('scroll', withRelo)
        dispatch(setRelo(false))
        console.log('REMOVED relo2')
        if (storedFilteredItems.length > currentDisp) { setNfts(storedFilteredItems); dispatch(setCurrentDisp(storedFilteredItems.length)); console.log('set nfts to stored!', storedFilteredItems.length) }
      }
    // }
    } else {
      const approxRows = currentSlice < 1 && diff === 0 ? parseInt((document.body.offsetHeight - window.innerHeight) / 32) : parseInt((document.body.offsetHeight - window.innerHeight) / 64)
      const itemsInRow = approxRows < 200 ? 4 : approxRows < 400 ? 2 : 1
      const step = isMobile ? approxRows === 1 ? 12000 : 6000 : 3000
      console.log('pageOffset is', window.pageYOffset, 'step is', step, 'length is', storedFilteredItems.length, 'slice is', currentSlice, 'height is', document.body.offsetHeight, 'inH', window.innerHeight, 'diff is', diff)
      if (window.pageYOffset <= step && currentSlice < 0 && storedFilteredItems.length) {
        setDimmed(true)
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, 32)
        console.log('SET NFTS0')
        setNfts(slicedStoredFilteredItems)
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(0))
        diff = 0
        setDimmed(false)
      }
      if (window.pageYOffset > step && currentSlice < 1 && storedFilteredItems.length && storedFilteredItems.length > currentDisp) {
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, 64)
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS1, offset is', window.pageYOffset, 'window inner height is', window.innerHeight)
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(1))
      }
      if (window.pageYOffset > document.body.offsetHeight - window.innerHeight - 300 && currentSlice < (2 + diff) && storedFilteredItems.length && storedFilteredItems.length > 64 + itemsInRow * diff && !alreadyDimmed) {
        // setDimmed(true)
        alreadyDimmed = true
      }
      // manual ll
      // if (window.pageYOffset > document.body.offsetHeight - window.innerHeight - 1 && currentSlice < (2 + diff) && storedFilteredItems.length && storedFilteredItems.length > 64 + itemsInRow * diff) {
      /// automatic lazy loading
      if (window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam && currentSlice < (2 + diff) && storedFilteredItems.length && storedFilteredItems.length > 64 + itemsInRow * diff) {
        // if (!dimmed) setDimmed(true)
        const slicedStoredFilteredItems = storedFilteredItems.slice(itemsInRow + itemsInRow * diff, 64 + itemsInRow + itemsInRow * diff)
        // window.scrollTo({ top: document.body.offsetHeight - window.innerHeight - 180, behavior: 'smooth' })
        // console.log('scrolled back to', window.pageYOffset)
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS2, offset is', window.pageYOffset, 'diff is', diff)
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(2 + diff))
        setTimeout(() => { diff += 1; /* setDimmed(false); */ if (window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam) window.scrollTo({ top: window.pageYOffset - 1, behavior: 'smooth' }) }, 3000)
      }
      // back
      if (window.pageYOffset < 2 && diff >= 0 && (currentSlice === (2 + diff) || currentSlice === (1 + diff)) && storedFilteredItems.length && storedFilteredItems.length > 64 + itemsInRow * diff) {
        // if (!dimmed) { setDimmed(true); setTimeout(() => setDimmed(false), 500) }
        const slicedStoredFilteredItems = storedFilteredItems.slice(itemsInRow + itemsInRow * (diff - 1), 64 + itemsInRow + itemsInRow * (diff - 1))
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS2 back, offset is', window.pageYOffset, 'diff is', diff)
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(currentSlice - 1))
        setTimeout(() => { if (diff) diff -= 1; if (window.pageYOffset < 2) { window.scrollTo({ top: 1, behavior: 'smooth' }); console.log('TIMEOUT1, SCROLLED TO', window.pageYOffset) } }, 1000)
      }
    }
  }
  async function updateNFT (index, tokenId) {
    const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
    dispatch(getData([]))
    dispatch(setRelo(false))
    dispatch(setCurrentDisp(0))
    // dispatch(setCurrentSlice(0))
    setNfts(prevNfts => {
      const updatedNfts = [...prevNfts]
      updatedNfts[index] = updatedNFt
      // dispatch(getData(updatedNfts))
      return updatedNfts
    })
  }

  async function addNFTToList (tokenId) {
    const nft = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
    setNfts(prevNfts => [nft, ...prevNfts])
  }

  function NFT ({ nft, index }) {
    // console.log('nft', nft)
    if (!nft.owner) {
      return <NFTCardCreation addNFTToList={addNFTToList}/>
    }

    if (nft.owner === account && !nft.hasMarketApproval) {
      // return <NFTCard nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)}/>
      return <NFTCard nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)}/>
    }

    if (nft.owner === account) {
      return <NFTCard nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)}/>
    }

    if (nft.seller === account && !nft.sold) {
      return <NFTCard nft={nft} action="cancel" updateNFT={() => updateNFT(index, nft.tokenId)} />
    }

    if (nft.owner === ethers.constants.AddressZero) {
      return <NFTCard nft={nft} action="buy" updateNFT={() => updateNFT(index, nft.tokenId)} />
    }

    return <NFTCard nft={nft} action="none"/>
  }
  console.log('point3')
  return (
    <InfiniteScroll
      dataLength={nfts.length}
      loader={<LinearProgress />}
    >
      <div style={{ width: '100%', height: '100%', textAlign: 'center', margin: '0 auto', fontSize: '30px', color: '#ccc', position: 'fixed', top: isMobile ? '45px' : '1%', opacity: '0.5', display: loading && !isMobile ? 'block' : 'none' }}>..loading..</div>
      <Grid container className={classes.grid} id="grid">
        {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
          <NFTCardCreation addNFTToList={addNFTToList}/>
        </Grid>}
        {nfts.map((nft, i) =>
          <Fade in={true} key={i}>
            <Grid item xs={12} sm={6} md={3} className={classes.gridItem} style={{ opacity: (dimmed || loading) && ((lookupStr && lookupStr.length > 0) || currentDisp) ? '0.5' : '1' }}>
                <NFT nft={nft} index={i} />
            </Grid>
          </Fade>
        )}
      </Grid>
    </InfiniteScroll>
  )
}
