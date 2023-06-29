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
// import { useSelector } from 'react-redux'
import { store } from '../../../store/store'

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

export default function NFTCardList ({ nfts, setNfts, filteredItems, withCreateNFT }) {
  const classes = useStyles()
  const { account, marketplaceContract, nftContract, searchStr } = useContext(Web3Context)
  // const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  useEffect(() => {
    window.addEventListener('scroll', relo)
  }, [])
  function relo () {
    if (withCreateNFT || searchStr.length) {
      window.removeEventListener('scroll', relo)
      return
    }
    if (window.pageYOffset > 450) {
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { storedFilteredItems } = storedFilteredItemsList
      if (storedFilteredItems.length) {
        window.removeEventListener('scroll', relo)
        setNfts(storedFilteredItems)
        console.log('set nfts to stored!', storedFilteredItems.length)
      }
      // else if (filteredItems.length) {
      // setNfts(filteredItems)
      // console.log('set nfts to filtered!', filteredItems.length)
      // } else {
      // console.log('no change')
      // }
    }
  }
  async function updateNFT (index, tokenId) {
    const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
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
            <Grid item xs={12} sm={6} md={3} className={classes.gridItem} >
                <NFT nft={nft} index={i} />
            </Grid>
          </Fade>
        )}
      </Grid>
    </InfiniteScroll>
  )
}
