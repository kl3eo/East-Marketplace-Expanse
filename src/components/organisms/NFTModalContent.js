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
          <Image src={nft.image} alt={nft.title} layout='fill' objectFit='contain' loading='lazy' placeholder='blur' blurDataURL='data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAgDBgf/xAAkEAACAgEEAQQDAAAAAAAAAAABAgMEEQAFBiESEyIxgUFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAAC/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAERIRL/2gAMAwEAAhEDEQA/ALTsfEeQJx/d1v2Tbvt0iSTl4vId+39A9d/0aLfA91rbY8MFiKSWzIIfOLziaMM2fLOSeuvjWyU0Qw5KLkk561I0SMQCoxj41SzA43YKbY4jzOxIX2lblisC0fqNY7LoxRvrKn60aaFaVapmOrAkEZJcrGPEZJyTgfknRpC+2f/Z' onClick={onClick} style={{ borderWidth: '0px', outline: 'none' }}/>
        </Grid>
      </Grid>
    </Paper>
  )
}
