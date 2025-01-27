import { isMobile } from 'react-device-detect'
import { ethers } from 'ethers'
import { useContext, useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@mui/styles'
import { Card, CardActions, CardContent, CardMedia, Button, Divider, Box, CircularProgress } from '@mui/material'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { Web3Context } from '../providers/Web3Provider'
import NFTDescription from '../atoms/NFTDescription'
import NFTPrice from '../atoms/NFTPrice'
import NFTName from '../atoms/NFTName'
import CardAddresses from './CardAddresses'
import PriceTextField from '../atoms/PriceTextField'
import { useSelector } from 'react-redux'

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    margin: '15px',
    flexGrow: 1,
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: '84%', // 16:9
    cursor: 'pointer'
  },
  cardContent: {
    paddingBottom: '8px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  firstDivider: {
    margin: 'auto 0 10px'
  },
  lastDivider: {
    marginTop: '10px'
  },
  addressesAndPrice: {
    display: 'flex',
    flexDirection: 'row'
  },
  addessesContainer: {
    margin: 'auto',
    width: '60%'
  },
  priceContainer: {
    width: '40%',
    margin: 'auto'
  },
  cardActions: {
    marginTop: 'auto',
    padding: '0 16px 8px 16px'
  }
})

const videoW = '100%'
async function getAndSetListingFee (marketplaceContract, setListingFee) {
  if (!marketplaceContract) return
  const listingFee = await marketplaceContract.getListingFee()
  setListingFee(ethers.utils.formatUnits(listingFee, 'ether'))
}

export default function NFTCard ({ nft, action, updateNFT }) {
  const { setModalNFT, setIsModalOpen } = useContext(NFTModalContext)
  const { nftContract, marketplaceContract, hasWeb3 } = useContext(Web3Context)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listingFee, setListingFee] = useState('')
  const [priceError, setPriceError] = useState(false)
  const [newPrice, setPrice] = useState(0)
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { loading, fullyLoaded } = storedFilteredItemsList
  const classes = useStyles()
  const { name, description, image } = nft
  let img = image
  const isVideo = image.match(/\.(mp4|MP4|webm|WEBM)$/ig)
  const loadingUrl = '/loading.png'
  const isWebRTC = image.match(/_screen_/g)
  img = image.match(/blue_screen_/g) ? 'https://cine.room-house.com/#BLUEHALL' : img
  img = image.match(/red_screen_/g) ? 'https://cine.room-house.com/#REDHALL' : img
  img = image.match(/green_screen_/g) ? 'https://cine.room-house.com/#GREENHALL' : img
  useEffect(() => {
    getAndSetListingFee(marketplaceContract, setListingFee)
  }, [])
  const ifrMemo = <div style={{ backgroundColor: '#112', height: isMobile ? '270px' : '380px', width: '100%', position: 'relative', top: '0px', opacity: fullyLoaded ? '1' : '0.5' }}><iframe src={img} style={{ height: isMobile ? '270px' : '380px', width: '100%', position: 'relative', top: '0px', border: '0px' }}></iframe></div>
  const Memoized = isVideo && !loading && fullyLoaded ? <CardMedia className="MuiCardMedia-root MuiCardMedia-media" alt={name} image={image} component="video" controls onClick={handleCardVideoClick} sx={{ width: { videoW }, height: '195px' }} /> : isVideo && (loading || !fullyLoaded) ? <CardMedia className={classes.media} alt={name} image={loadingUrl} component="a" onClick={handleCardImageClick} /> : isWebRTC && !loading && fullyLoaded ? ifrMemo : isWebRTC && (loading || !fullyLoaded) ? <CardMedia className={classes.media} alt={name} image={image} component="a" onClick={handleCardImageClick} style={{ opacity: fullyLoaded ? '1' : '0.5' }}/> : <CardMedia className={classes.media} alt={name} image={image} component="a" onClick={handleCardImageClick} />
  useMemo(() => ifrMemo, [nft])
  const actions = {
    buy: {
      text: 'buy',
      method: buyNft
    },
    cancel: {
      text: 'cancel',
      method: cancelNft
    },
    approve: {
      text: 'Approve for selling',
      method: approveNft
    },
    sell: {
      text: listingFee ? `Sell (${listingFee} fee)` : 'Sell',
      method: sellNft
    },
    none: {
      text: '',
      method: () => {}
    }
  }

  async function buyNft (nft) {
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await marketplaceContract.createMarketSale(nftContract.address, nft.marketItemId, {
      value: price
    })
    await transaction.wait()
    updateNFT()
  }

  async function cancelNft (nft) {
    const transaction = await marketplaceContract.cancelMarketItem(nftContract.address, nft.marketItemId)
    await transaction.wait()
    updateNFT()
  }

  async function approveNft (nft) {
    const approveTx = await nftContract.approve(marketplaceContract.address, nft.tokenId)
    await approveTx.wait()
    updateNFT()
    return approveTx
  }

  async function sellNft (nft) {
    if (!newPrice) {
      setPriceError(true)
      return
    }
    setPriceError(false)
    const listingFee = await marketplaceContract.getListingFee()
    const priceInWei = ethers.utils.parseUnits(newPrice, 'ether')
    const transaction = await marketplaceContract.createMarketItem(nftContract.address, nft.tokenId, priceInWei, { value: listingFee.toString() })
    await transaction.wait()
    updateNFT()
    return transaction
  }

  function handleCardImageClick () {
    setModalNFT(nft)
    setIsModalOpen(true)
  }

  function handleCardVideoClick (e) {
    e.preventDefault()
  }
  async function onClick (nft) {
    try {
      setIsLoading(true)
      await actions[action].method(nft)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={classes.root}
      raised={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
      {Memoized}

      <CardContent className={classes.cardContent} >
        <NFTName name={name}/>
        <NFTDescription description={description} />
        <Divider className={classes.firstDivider} />
        <Box className={classes.addressesAndPrice}>
          <div className={classes.addessesContainer}>
            <CardAddresses nft={nft} />
          </div>
          <div className={classes.priceContainer}>
            {action === 'sell'
              ? <PriceTextField listingFee={listingFee} error={priceError} disabled={isLoading} onChange={e => setPrice(e.target.value)}/>
              : <NFTPrice nft={nft}/>
            }
          </div>
        </Box>
        <Divider className={classes.lastDivider} />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" onClick={() => !isLoading && onClick(nft)}>
          {isLoading
            ? <CircularProgress size="20px" />
            : hasWeb3 && actions[action].text
          }
        </Button>
      </CardActions>
    </Card>
  )
}

/*       {useMemo(() => { isVideo && !loading ? <CardMedia className="MuiCardMedia-root MuiCardMedia-media" alt={name} image={image} component="video" controls onClick={handleCardVideoClick} sx={{ width: { videoW }, height: '195px' }} /> : isVideo && loading ? <CardMedia className={classes.media} alt={name} image={loadingUrl} component="a" onClick={handleCardImageClick} /> : isWebRTC && !loading ? <div style={{ backgroundColor: '#112', height: isMobile ? '270px' : '380px', width: '100%', position: 'relative', top: '0px' }}><iframe src={img} style={{ height: isMobile ? '270px' : '435px', width: '100%', position: 'relative', top: '0px', border: '0px' }}></iframe></div> : isWebRTC && loading ? <CardMedia className={classes.media} alt={name} image={image} component="a" onClick={handleCardImageClick} /> : <CardMedia className={classes.media} alt={name} image={image} component="a" onClick={handleCardImageClick} /> }, [])} */
