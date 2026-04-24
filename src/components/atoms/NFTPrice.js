// import { Popover, Typography } from '@mui/material'
import { Typography } from '@mui/material'
import Image from 'next/image'
// import { useState } from 'react'

function getPriceText (nft) {
  const { sold, canceled, price } = nft
  if (sold) {
    return 'Sold for'
  }

  if (canceled) {
    return 'Owned for'
  }

  if (!price) {
    return 'Wait a min..'
  }

  return 'Price'
}

export default function NFTPrice ({ nft, variant }) {
  const priceText = getPriceText(nft)
  /* const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return (
    <div style={{ textAlign: 'center' }}>

      <Typography
      variant={variant}
      color="text.secondary"
      >
        {priceText}
      </Typography>
      <Typography
      gutterBottom
      variant={variant}
      color="text.secondary"
      >
        <span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>
          <Image
            alt='EXP'
            src='/exp.png'
            width="20px"
            height="20px"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        </span>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none'
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>EXP</Typography>
        </Popover>
        {' '}{nft.price}
      </Typography>
    </div>
  ) */
  return (
    <div style={{ textAlign: 'center' }}>

      <Typography
      variant={variant}
      color="text.secondary"
      >
        {priceText}
      </Typography>
      <Typography
      gutterBottom
      variant={variant}
      color="text.secondary"
      >
        <span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>
          <Image
            alt='EXP'
            title='EXP'
            src='/exp.png'
            width="20px"
            height="20px"
          />
        </span>
        {' '}{nft.price}
      </Typography>
    </div>
  )
}
