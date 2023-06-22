import { Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Image from 'next/image'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 25px',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'center',
      width: '50%'
    }
  },
  mainContainer: {
    borderRadius: '3px',
    height: '90vh',
    overflowY: 'scroll',
    flexDirection: 'row-reverse',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      overflowY: 'hidden'
    }
  },
  imageContainer: {
    height: 'inherit',
    [theme.breakpoints.down('sm')]: {
      height: 'auto'
    }
  }
}))

export default function NFTModalContent ({ nft, onClick }) {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.mainContainer}>
        <Grid item className={classes.imageContainer}>
          <Image src={nft.image} alt={nft.title} layout='fill' objectFit='contain' loading='lazy' placeholder='blur' blurDataURL='data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRm knyJckliyjqTzSlT54b6bk+h0R//2Q==' onClick={onClick}/>
        </Grid>
      </Grid>
    </Paper>
  )
}
