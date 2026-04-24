import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import { TextField, Card, CardActions, CardContent, CardMedia, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { isMobile } from 'react-device-detect'

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

export default function ReqCardCreation () {
  const [file, setFile] = useState(null)
  const classes = useStyles()
  const { register, handleSubmit, reset } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { setIsReqFormOpen, currLang, setCurrLang } = useContext(NFTModalContext)
  const Labee = currLang === 'EN' ? 'Title' : 'Название'
  const Descee = currLang === 'EN' ? 'Description' : 'Описание'

  const defaultFileUrl = currLang === 'EN' ? '/nft_rh_250.png' : '/nft_rh_250_ru.png'
  const defaultVideoFileUrl = '/nft_video_250.png'
  const defaultFileTypeUrl = '/filetype.png'
  const [fileUrl, setFileUrl] = useState(defaultFileUrl)

  useEffect(() => {
    setTimeout(() => { if (!file) setFileUrl(defaultFileUrl) }, 100)
  }, [currLang])

  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }

  function createNFTFormDataFile (name, description, file, par) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('file', file)
    par === 1 && formData.append('account', 'DUMMY')
    par === 2 && formData.append('account', 'DUMMY2')
    if (typeof window !== 'undefined' && window.location.hostname === 'happydox.room-house.com') formData.append('network', 'hd')
    return formData
  }

  async function uploadFileToIPFS (formData) {
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('upload api, data', data)
    if (typeof data === 'undefined') return
    return [data.url, data.hash, data.check]
  }

  async function onFileChange (event) {
    if (!event.target.files[0]) return
    setFile(event.target.files[0])
    event.target.files[0].name.match(/\.(mp4|MP4|webm|WEBM)$/ig) ? setFileUrl(defaultVideoFileUrl) : event.target.files[0].name.match(/\.(jpg|jpeg|png)$/ig) ? setFileUrl(URL.createObjectURL(event.target.files[0])) : setFileUrl(defaultFileTypeUrl)
    document.getElementById('labelFileName').innerText = event.target.files[0].name
    document.getElementById('labelFileName').style.display = event.target.files[0].name.match(/\.(jpg|jpeg|png|mp4|webm)$/ig) ? 'none' : 'block'
  }

  async function onSubmit ({ name, description }) {
    if (!file || isLoading) return
    const yon = currLang === 'EN' ? window.confirm('Mint HappyDox token? This site does not use cookies and no personal data is collected.') : window.confirm('Печатаем ТОКЕН? Вы НЕ сообщаете свои персональные данные! Этот сайт НЕ использует куки!')
    if (yon) {
      try {
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const formData = createNFTFormDataFile(name, description, file, 1)
        const [metadataUrl, hash2, check] = await uploadFileToIPFS(formData)
        formData.delete('file')
        formData.delete('name')
        formData.delete('description')
        // console.log('metadataUrl', metadataUrl)
        if (typeof metadataUrl === 'undefined') { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Check file size must be < 100M.' : 'Проверьте размер файла < 100M.'; document.getElementById('reqformdiv4').style.display = 'block'; return }
        if (metadataUrl === 'null' || metadataUrl === null) { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Check file size must be < 100M.' : 'Ошибка. Проверьте размер файла < 100M.'; document.getElementById('reqformdiv4').style.display = 'block'; return }

        document.getElementById('reqformdiv4').innerText = hash2
        if (check === 'OK') document.getElementById('reqformdiv4').click(); else document.getElementById('reqformdiv4').style.display = 'block'
        setFileUrl(defaultFileUrl)
        reset()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
        // setIsReqFormOpen(false)
        document.getElementById('reqformdiv1').style.display = 'none'
        document.getElementById('reqformdiv2').style.display = 'none'
        document.getElementById('reqformdiv3').style.display = 'block'
        // document.getElementById('reqformdiv4').style.display = 'block'
        document.getElementById('reqformdiv5').style.display = 'block'
      }
    }
  }

  async function onSubmitEasy ({ name, description }) {
    if ((!name.length || !description.length) && currLang === 'EN') { alert('Please provide File, Title and Description!'); return }
    if ((!name.length || !description.length) && currLang !== 'EN') { alert('Нужно указать файл, его название и описание!'); return }
    const yon = currLang === 'EN' ? window.confirm('EasyHD Token Mint selected. This Token only saves hash of the file in blockchain. OK?') : window.confirm('Печатаем EasyHD ТОКЕН? Он только сохраняет хэш сумму файла в блокчейн. ')
    if (yon) {
      try {
        if (!file || isLoading) return
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const formData = createNFTFormDataFile(name, description, file, 2)
        const [metadataUrl, hash2, check] = await uploadFileToIPFS(formData)
        formData.delete('file')
        formData.delete('name')
        formData.delete('description')
        console.log('metadataUrl', metadataUrl)
        if (typeof metadataUrl === 'undefined') { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Please try later.' : 'Ошибка. Попробуйте позже.'; document.getElementById('reqformdiv4').style.display = 'block'; return }
        if (metadataUrl === 'null' || metadataUrl === null) { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Check file size must be < 3M.' : 'Ошибка. Проверьте размер файла < 1M.'; document.getElementById('reqformdiv4').style.display = 'block'; return }

        document.getElementById('reqformdiv4').innerText = hash2
        if (check === 'OK') document.getElementById('reqformdiv4').click(); else document.getElementById('reqformdiv4').style.display = 'block'
        setFileUrl(defaultFileUrl)
        reset()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
        // setIsReqFormOpen(false)
        document.getElementById('reqformdiv1').style.display = 'none'
        document.getElementById('reqformdiv2').style.display = 'none'
        document.getElementById('reqformdiv3').style.display = 'block'
        // document.getElementById('reqformdiv4').style.display = 'block'
        document.getElementById('reqformdiv5').style.display = 'block'
      }
    }
  }
  // const testClick = () => { console.log('test clicked!') }
  return (
    <Card className={classes.root} component="form" sx={{ maxWidth: 345, margin: '0 auto', position: 'relative', background: '#ffeedd', width: isMobile ? '77%' : '96%', height: isMobile ? '77%' : '84%' }} onSubmit={handleSubmit(onSubmit)}>
      <div onClick={toggleLang} style={{ zIndex: '100001', position: 'absolute', display: 'block', color: '#fff', backgroundColor: '#906', fontSize: '24px', width: '40px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{currLang}</div>
      <label htmlFor="file-input">
        <CardMedia
          className={classes.media}
          alt='Upload image'
          image={fileUrl} sx={{ position: 'relative' }}>
          <div id="labelFileName" style={{ color: '#369', fontSize: '24px', position: 'absolute', top: '10px', left: '48px', display: 'none' }}></div>
        </CardMedia>
      </label>
      <input
          style={{ display: 'none' }}
          type="file"
          name="file"
          id="file-input"
          onChange={onFileChange}
        />
      <CardContent sx={{ paddingBottom: 0 }}>
        <TextField
          id="name-input"
          label={Labee}
          name="name"
          size="small"
          InputProps={{ style: { fontSize: 24 } }}
          InputLabelProps={{ style: { fontSize: 24 } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('name')}
        />
         <TextField
          id="description-input"
          label={Descee}
          name="description"
          size="small"
          multiline
          rows={1}
          InputProps={{ style: { fontSize: 24 } }}
          InputLabelProps={{ style: { fontSize: 24 } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('description')}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button style={{ fontSize: '24px', position: 'absolute', left: '10px', bottom: '2px', marginBottom: '5px', backgroundImage: 'linear-gradient(.25turn, #f00, #00f)', color: '#fed' }} size="small" type="submit" >
          {isLoading
            ? <CircularProgress size="20px" />
            : currLang === 'EN' ? typeof window !== 'undefined' && window.location.hostname !== 'happydox.room-house.com' ? 'Mint Token' : 'Gold Token' : typeof window !== 'undefined' && window.location.hostname !== 'happydox.room-house.com' ? 'Печатать' : 'Gold Токен'
          }
        </Button>
        {typeof window !== 'undefined' && window.location.hostname !== 'happyminter.room-house.com' && window.location.hostname !== 'happydox.room-house.com' && <Button id="retBut" onClick={ (e) => { e.stopPropagation(); setIsReqFormOpen(false); if (document.getElementById('getRoom')) document.getElementById('getRoom').style.display = 'block' }} style={{ position: 'absolute', right: '10px', bottom: '2px' }} size="small" type="close">
          {currLang === 'EN' ? 'Return' : isMobile ? 'Назад' : 'Вернуться'}
        </Button>}
        {typeof window !== 'undefined' && window.location.hostname === 'happydoxx.room-house.com' && <a id="retBut" style={{ float: 'right', marginLeft: currLang === 'EN' ? '54px' : '48px', whiteSpace: 'nowrap' }} href='https://mydocs.room-house.com/my-nfts'>
          {currLang === 'EN' ? 'Go To MyDocs' : isMobile ? 'MyDocs' : 'Перейти на MyDocs'}
        </a>}
        {typeof window !== 'undefined' && window.location.hostname === 'happydox.room-house.com' && <Button style={{ position: 'absolute', fontSize: '24px', right: '10px', bottom: '2px', marginBottom: '5px' }} size="small" color="secondary" onClick={handleSubmit(onSubmitEasy)}>{isLoading ? <CircularProgress size="20px" /> : currLang === 'EN' ? 'Easy Token' : 'Easy Токен'}</Button>}
        {typeof window !== 'undefined' && window.location.hostname === 'happyminter.room-house.com' && <a id="retBut" style={{ position: 'absolute', whiteSpace: 'nowrap', right: '10px', bottom: '2px' }} href='https://nft.room-house.com'>
          {currLang === 'EN' ? 'Go To NFTs' : isMobile ? 'NFTs' : 'Перейти на NFTs'}
        </a>}
      </CardActions>
    </Card>
  )
}
