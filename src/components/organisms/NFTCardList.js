// import { isMobile } from 'react-device-detect'
import InfiniteScroll from 'react-infinite-scroll-component'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Fade from '@mui/material/Fade'
import { makeStyles } from '@mui/styles'
import NFTCard from '../molecules/NFTCard'
import NFTCardCreation from '../molecules/NFTCardCreation'
import { ethers } from 'ethers'
import { Web3Context } from '../providers/Web3Provider'
import { useContext, useEffect } from 'react'
import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft'
import { store } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
// import { setCurrentDisp, setCurrentSlice, getData, setRelo } from '../../../store/actions/dataAction'
import { setCurrentDisp, setRelo, getData } from '../../../store/actions/dataAction'

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
  const { account, marketplaceContract, nftContract } = useContext(Web3Context)
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, loading, fullyLoaded, currentDisp, relo } = storedFilteredItemsList

  useEffect(() => {
    if (!relo) {
      window.addEventListener('scroll', withRelo)
      console.log('ADDED relo')
      dispatch(setRelo(true))
    }
    // dispatch(setCurrentSlice(0))
  }, [])

  const dispatch = useDispatch()
  function withRelo () {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    // const { storedFilteredItems, currentDisp, lookupStr, currentSlice, relo } = storedFilteredItemsList
    const { storedFilteredItems, currentDisp, lookupStr, relo } = storedFilteredItemsList

    if (withCreateNFT || lookupStr.length) {
      if (relo) {
        window.removeEventListener('scroll', withRelo)
        dispatch(setRelo(false))
        console.log('REMOVED relo1')
      }
      // dispatch(setCurrentSlice(0))
      return
    }

    // if (window.pageYOffset < 0) {
    if (window.pageYOffset > 450) {
      if (storedFilteredItems && storedFilteredItems.length) {
        window.removeEventListener('scroll', withRelo)
        dispatch(setRelo(false))
        console.log('REMOVED relo2')
        if (storedFilteredItems.length > currentDisp) { setNfts(storedFilteredItems); dispatch(setCurrentDisp(storedFilteredItems.length)); console.log('set nfts to stored!', storedFilteredItems.length) }
      }
    }
    /* } else {
      // console.log('pageOffset is', window.pageYOffset)
      const step = isMobile ? 6000 : 3000
      if (window.pageYOffset <= step && currentSlice < 0 && storedFilteredItems.length) {
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, 60)
        setNfts(slicedStoredFilteredItems)
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(0))
      }
      // if (window.pageYOffset > 6000 && window.pageYOffset <= 12000 && currentSlice !== 1) {
      console.log('pageOffset is', window.pageYOffset, 'step is', step, 'length is', storedFilteredItems.length, 'slice is', currentSlice)
      if (window.pageYOffset > step && currentSlice < 1 && storedFilteredItems.length && storedFilteredItems.length > currentDisp) {
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, 120)
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS1')
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(1))
      }
      // if (window.pageYOffset > 12000 && window.pageYOffset <= 18000 && currentSlice !== 2) {
      if (window.pageYOffset > 2 * step && currentSlice < 2 && storedFilteredItems.length && storedFilteredItems.length > currentDisp) {
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, storedFilteredItems.length)
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS2')
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(2))
      }
    } */
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

    if (nft.owner === account && nft.marketItemId && !nft.hasMarketApproval) {
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
  // if (loading) return (<div style={{ width: '100%', height: '100%', textAlign: 'center', margin: '0 auto', fontSize: '48px' }}>..loading..</div>)
  console.log('point3')
  return (
    <InfiniteScroll
      dataLength={nfts.length}
      loader={<LinearProgress />}
    >
      <Grid container className={classes.grid} id="grid">
        {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
          <NFTCardCreation addNFTToList={addNFTToList}/>
        </Grid>}
        {nfts.map((nft, i) =>
          <Fade in={true} key={i}>
            <Grid item xs={12} sm={6} md={3} className={classes.gridItem} style={{ opacity: (loading || !fullyLoaded) && ((lookupStr && lookupStr.length > 0) || currentDisp) ? '0.5' : '1' }}>
                <NFT nft={nft} index={i} />
            </Grid>
          </Fade>
        )}
      </Grid>
    </InfiniteScroll>
  )
}
