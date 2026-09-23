import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import { TextField, Card, CardActions, CardContent, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { isMobile } from 'react-device-detect'

const currentDomain = 'room-house.com'
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

export default function ReqTextCreation ({ updateParent }) {
  const classes = useStyles()
  const { register, handleSubmit, reset } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [currModeFa, setCurrModeFa] = useState(false)
  const { currLang, setCurrLang } = useContext(NFTModalContext)
  const Contee = currLang === 'EN' ? '4-12 Lines' : '4-12 Строк'
  const Labee = currLang === 'EN' ? 'Title&Year' : 'Название&Год'
  const Descee = currLang === 'EN' ? 'Author' : 'Автор'

  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }
  const toggleMode = () => {
    setCurrModeFa(!currModeFa); updateParent(currModeFa)
  }

  function createNFTFormDataText (name, description, textContent) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('textContent', textContent)
    return formData
  }

  async function uploadTextToIPFS (formData) {
    const { data } = await axios.post('/api/upload_text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('upload_text api, data', data)
    if (typeof data === 'undefined') return
    return [data.url, data.hash, data.check]
  }

  async function onSubmit ({ name, description, textContent }) {
    if (isLoading) return
    const yon = currLang === 'EN' ? window.confirm('Mint Token? This site does not use cookies and no personal data is collected.') : window.confirm('Печатаем ТОКЕН? Вы НЕ сообщаете свои персональные данные! Этот сайт НЕ использует куки!')
    if (yon) {
      try {
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const formData = createNFTFormDataText(name, description, textContent)
        const [metadataUrl, hash2, check] = await uploadTextToIPFS(formData)
        formData.delete('name')
        formData.delete('description')
        formData.delete('textContent')
        // console.log('metadataUrl', metadataUrl)
        if (typeof metadataUrl === 'undefined') { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error1 occurred. ' : 'Ошибка1. Проверьте форму'; document.getElementById('reqformdiv4').style.display = 'block'; return }
        if (metadataUrl === 'null' || metadataUrl === null) { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error2 occurred.' : 'Ошибка2. Проверьте форму.'; document.getElementById('reqformdiv4').style.display = 'block'; return }

        document.getElementById('reqformdiv4').innerText = hash2
        if (check === 'OK') document.getElementById('reqformdiv4').click(); else document.getElementById('reqformdiv4').style.display = 'block'
        reset()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
        // setIsReqFormOpen(false)
        // document.getElementById('reqformdiv1').style.display = 'none'
        document.getElementById('reqformdiv2').style.display = 'none'
        // document.getElementById('reqformdiv3').style.display = 'block'
        // document.getElementById('reqformdiv4').style.display = 'block'
        document.getElementById('reqformdiv5').style.display = 'block'
      }
    }
  }

  return (
    <Card className={classes.root} component="form" sx={{ maxWidth: 345, margin: '0 auto', position: 'relative', background: '#ffeedd', width: isMobile ? '77%' : '96%', height: isMobile ? '77%' : '84%' }} onSubmit={handleSubmit(onSubmit)}>
      <div onClick={toggleLang} style={{ zIndex: '100001', position: 'absolute', display: 'block', color: '#fff', backgroundColor: '#906', fontSize: '24px', width: '40px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{currLang}</div>
      <div onClick={toggleMode} style={{ zIndex: '100001', position: 'absolute', display: 'block', color: '#fff', backgroundColor: '#609', fontSize: '24px', width: '40px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px', right: '0px' }}>{currModeFa ? 'FA' : 'P'}</div>
      <CardContent sx={{ paddingBottom: 0, paddingTop: '5vh' }}>
        <TextField
          id="textContent-input"
          label={Contee}
          name="textContent"
          multiline
          minRows={4}
          maxRows={12}
          size="small"
          InputProps={{ style: { fontSize: 16 } }}
          InputLabelProps={{ style: { fontSize: 16 } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('textContent')}
        />
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
            : currLang === 'EN' ? 'Mint Token' : 'Печатать'
          }
        </Button>
        {typeof window !== 'undefined' && window.location.hostname === 'happyminter.' + currentDomain && <a id="retBut" style={{ position: 'absolute', whiteSpace: 'nowrap', right: '10px', bottom: '2px' }} href='https://nft.room-house.com'>
          {currLang === 'EN' ? 'Go To NFTs' : isMobile ? 'NFTs' : 'Перейти на NFTs'}
        </a>}
      </CardActions>
    </Card>
  )
}
