
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import { TextField, Card, CardActions, CardContent, CardMedia, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { Web3Context } from '../providers/Web3Provider'

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    margin: '15px 15px',
    flexGrow: 1
  },
  cardActions: {
    marginTop: 'auto'
  },
  media: {
    height: 0,
    paddingTop: '84%', // 16:9
    cursor: 'pointer'
  }
})

const defaultFileUrl = 'https://club.room-house.com/img/nft_rh_250.png'
const defaultVideoFileUrl = 'https://club.room-house.com/img/nft_video_250.png'

export default function NFTCardCreation ({ addNFTToList }) {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(defaultFileUrl)
  const classes = useStyles()
  const { register, handleSubmit, reset } = useForm()
  const { nftContract } = useContext(Web3Context)
  const [isLoading, setIsLoading] = useState(false)

  async function createNft (metadataUrl) {
    const transaction = await nftContract.mintToken(metadataUrl)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const tokenId = event.args[2]
    return tokenId
  }

  function createNFTFormDataFile (name, description, file) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('file', file)
    return formData
  }

  async function uploadFileToIPFS (formData) {
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return data.url
  }

  async function onFileChange (event) {
    if (!event.target.files[0]) return
    setFile(event.target.files[0])
    event.target.files[0].name.match(/\.(mp4|MP4|webm|WEBM)$/ig) ? setFileUrl(defaultVideoFileUrl) : setFileUrl(URL.createObjectURL(event.target.files[0]))
  }

  async function onSubmit ({ name, description }) {
    try {
      if (!file || isLoading) return
      setIsLoading(true)
      const formData = createNFTFormDataFile(name, description, file)
      const metadataUrl = await uploadFileToIPFS(formData)
      const tokenId = await createNft(metadataUrl)
      console.log('new token:', tokenId)
      addNFTToList(tokenId)
      setFileUrl(defaultFileUrl)
      reset()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={classes.root} component="form" sx={{ maxWidth: 345 }} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="file-input">
        <CardMedia
          className={classes.media}
          alt='Upload image'
          image={fileUrl}
        />
      </label>
      <input
          style={{ display: 'none' }}
          type="file"
          name="file"
          id="file-input"
          accept="image/png, image/jpeg, video/mp4, video/webm"
          onChange={onFileChange}
        />
      <CardContent sx={{ paddingBottom: 0 }}>
        <TextField
          id="name-input"
          label="Name"
          name="name"
          size="small"
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('name')}
        />
         <TextField
          id="description-input"
          label="Description"
          name="description"
          size="small"
          multiline
          rows={2}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('description')}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" type="submit">
          {isLoading
            ? <CircularProgress size="20px" />
            : 'Create'
          }
        </Button>
      </CardActions>
    </Card>
  )
}
