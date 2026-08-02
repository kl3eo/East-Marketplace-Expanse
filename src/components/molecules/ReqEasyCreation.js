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

export default function ReqEasyCreation () {
  const [file, setFile] = useState(null)
  const classes = useStyles()
  const { register, handleSubmit, reset } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { currLang, setCurrLang } = useContext(NFTModalContext)
  const [currCheck, setCurrCheck] = useState(false)
  const Labee = currLang === 'EN' ? 'Title' : 'Название'
  const Descee = currLang === 'EN' ? 'Description' : 'Описание'

  const defaultFileUrl = currLang === 'EN' ? '/nft_rh_250_bw.png' : '/nft_rh_250_ru_bw.png'
  const defaultVideoFileUrl = '/nft_rh_250_blank.png'
  const defaultFileTypeUrl = '/nft_rh_250_blank.png'
  const [fileUrl, setFileUrl] = useState(defaultFileUrl)

  useEffect(() => {
    setTimeout(() => { if (!file) setFileUrl(defaultFileUrl) }, 100)
  }, [currLang])

  /* useEffect(() => {
    setTimeout(() => { setFileUrl(defaultFileUrl); setFile(null); document.getElementById('labelFileName').innerText = ''; document.getElementById('labelFileName').style.display = 'none' }, 100)
  }, [currCheck]) */

  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }
  const toggleCheck = () => {
    document.getElementById('reqformdiv4').style.visibility = 'hidden' // always down the flag
    currCheck ? setCurrCheck(false) : setCurrCheck(true)
    // console.log('current check', currCheck)
  }
  function createNFTFormDataFile (name, description, file, sum, origN, size, par) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    par === 1 && formData.append('file', file)
    par === 2 && formData.append('checksum', sum)
    par === 2 && formData.append('originalFilename', origN)
    par === 2 && formData.append('size', size)
    par === 1 && formData.append('account', 'DUMMY')
    par === 2 && formData.append('account', 'DUMMY2')
    if (typeof window !== 'undefined' && window.location.hostname.match(/tokenizer/ig)) formData.append('network', 'hd')
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

  async function onSubmitEasy ({ name, description }) {
    if ((!name.length || !description.length || !file) && currLang === 'EN') { alert('Please provide File, Title and Description!'); return }
    if ((!name.length || !description.length || !file) && currLang !== 'EN') { alert('Нужно указать файл, его название и описание!'); return }
    const yon = currLang === 'EN' ? window.confirm('This Token only saves hash of the file in blockchain. OK?') : window.confirm('Он только сохраняет хэш сумму файла в блокчейн. OK?')
    if (yon) {
      try {
        if (!file) { alert('No file selected!'); return }
        if (isLoading) return
        // console.log("Here File:", file)
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const csum = async (file) => {
          if (Object.prototype.toString.call(file) === '[object File]') {
            const buffer = await file.arrayBuffer()
            const hash = await crypto.subtle.digest('SHA-256', buffer)
            const ret = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
            // console.log('csum is', ret)
            return ret
          } else throw Error('File is not valid.')
        }
        const checksum = await csum(file); console.log('checksum', checksum, 'name', file.name, 'size', file.size) // correct
        const formData = createNFTFormDataFile(name, description, null, checksum, file.name, file.size, 2)
        const [metadataUrl, hash2, check] = await uploadFileToIPFS(formData)
        formData.delete('file')
        formData.delete('name')
        formData.delete('description')
        console.log('metadataUrl', metadataUrl)
        if (typeof metadataUrl === 'undefined') { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Please try later.' : 'Ошибка. Попробуйте позже.'; document.getElementById('reqformdiv4').style.display = 'block'; document.getElementById('reqformdiv4').style.visibility = 'visible'; return }
        if (metadataUrl === 'null' || metadataUrl === null) { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Check file size must be <= 2Gb.' : 'Ошибка. Проверьте размер файла <= 2Gb.'; document.getElementById('reqformdiv4').style.display = 'block'; document.getElementById('reqformdiv4').style.visibility = 'visible'; return }

        document.getElementById('reqformdiv4').innerText = hash2
        if (check === 'OK') document.getElementById('reqformdiv4').click(); else document.getElementById('reqformdiv4').style.display = 'block'
        // setFileUrl(defaultFileUrl)
        reset()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  async function onSubmitCheck () {
    // const yon = currLang === 'EN' ? window.confirm('Check the selected file hashsum. OK?') : window.confirm('Check the selected file hashsum. OK?')
    const yon = currLang.length // always do
    if (yon) {
      try {
        if (!file) { alert('No file selected!'); return }
        if (isLoading) return
        // console.log("Here File:", file)
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const csum = async (file) => {
          if (Object.prototype.toString.call(file) === '[object File]') {
            const buffer = await file.arrayBuffer()
            const hash = await crypto.subtle.digest('SHA-256', buffer)
            const ret = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
            // console.log('csum is', ret)
            return ret
          } else throw Error('File is not valid.')
        }
        const checksum = await csum(file); console.log('checksum', checksum, 'name', file.name, 'size', file.size) // correct
        document.getElementById('reqformdiv4').innerText = '0x' + checksum
        document.getElementById('alerter').innerHTML = 'Click to Copy 0x' + checksum.substr(0, 6) + '..'
        document.getElementById('alerter').style.display = 'block'
        // setFileUrl(defaultFileUrl)
        reset()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <Card className={classes.root} component="form" sx={{ maxWidth: 345, margin: '0 auto', border: '1px solid #fff', position: 'relative', background: '#012', width: isMobile ? '77%' : '96%', height: isMobile ? '77%' : '84%' }} onSubmit={handleSubmit(onSubmitEasy)}>
      <><div onClick={toggleLang} style={{ zIndex: '100001', position: 'absolute', display: 'block', color: '#fff', backgroundColor: '#012', border: '1px solid #fff', fontSize: '24px', width: '40px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{currLang}</div>
      <div onClick={toggleCheck} style={{ zIndex: '100001', position: 'absolute', right: '1%', display: 'block', color: '#fff', backgroundColor: '#012', border: '1px solid #fff', fontSize: '24px', width: currLang === 'EN' ? '120px' : '120px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{ currCheck ? currLang === 'EN' ? 'Mint' : 'Токен' : currLang === 'EN' ? 'Check' : 'Сумма' }</div></>
      <label htmlFor="file-input">
        <CardMedia
          className={classes.media}
          alt='Select image'
          image={fileUrl} sx={{ position: 'relative' }}>
          <div id="labelFileName" style={{ color: '#369', fontSize: '24px', position: 'absolute', top: '10px', left: '48px', display: 'none' }}></div>
        </CardMedia>
      </label>
      <input
          style={{ display: 'none' }}
          type="file"
          name="file"
          id="file-input"
          disabled={isLoading}
          onChange={onFileChange}
        />
      <CardContent sx={{ paddingBottom: 0 }}>
        {!currCheck && <TextField
          id="name-input"
          label={Labee}
          name="name"
          size="small"
          InputProps={{ style: { border: '1px solid #fff', fontSize: 24, color: '#fed' } }}
          InputLabelProps={{ style: { fontSize: 24, color: '#fed' } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('name')}
        />}
         {!currCheck && <TextField
          id="description-input"
          label={Descee}
          name="description"
          size="small"
          multiline
          rows={1}
          InputProps={{ style: { border: '1px solid #fff', fontSize: 24, color: '#fed' } }}
          InputLabelProps={{ style: { fontSize: 24, color: '#fed' } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('description')}
        />}
      </CardContent>
      <CardActions className={classes.cardActions}>
        {!currCheck && <Button style={{ position: 'absolute', textAlign: 'center', fontSize: '24px', bottom: '2px', marginBottom: '5px' }} size="small" color="secondary" onClick={handleSubmit(onSubmitEasy)}>{isLoading ? <CircularProgress size="20px" /> : currLang === 'EN' ? 'Mint Token' : 'Создать Токен'}</Button>}
        {currCheck && <Button style={{ position: 'absolute', textAlign: 'center', fontSize: '24px', bottom: '2px', marginBottom: '5px' }} size="small" color="secondary" onClick={handleSubmit(onSubmitCheck)}>{isLoading ? <CircularProgress size="20px" /> : currLang === 'EN' ? 'Check Sum' : 'Проверить Сумму'}</Button>}
      </CardActions>
    </Card>
  )
}
