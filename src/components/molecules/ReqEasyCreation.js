import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import { TextField, Card, CardActions, CardContent, CardMedia, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { isMobile } from 'react-device-detect'

// use these to mint on client
import Web3 from 'web3'
import { ethers } from 'ethers'
import contract from '../../../artifacts/contracts/NFT_HD.sol/NFT_HD.json'

// const onClient = true

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

// use these to mint on client
// const contractAddress = process.env.NFT_CONTRACT_ADDRESS_EXPANSE_HD
const contractAddress = '0xaD3321ae0CefC926e2140bDA7c67Aaf5d4432B5A'
const contractInterface = contract.abi
// const providerURL = process.env.DEV_API_URL
const providerURL = 'https://wien.room-house.com'
const provider = ethers.getDefaultProvider(providerURL)
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))

// use this short ABI for export
const HD_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenURI',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'marketplaceAddress',
        type: 'address'
      }
    ],
    name: 'TokenMinted',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
const HDContract = new web3.eth.Contract(HD_ABI, contractAddress)

export default function ReqEasyCreation () {
  const [file, setFile] = useState(null)
  const classes = useStyles()
  const { register, handleSubmit, reset } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { currLang, setCurrLang } = useContext(NFTModalContext)
  const [currCheck, setCurrCheck] = useState(false)
  const [onClient, setOnClient] = useState(true)
  const Labee = currLang === 'EN' ? 'Title' : 'Название'
  const Descee = currLang === 'EN' ? 'Description' : 'Описание'
  const Idee = currLang === 'EN' ? 'Token #' : 'ID Токена'

  const defaultFileUrl = currLang === 'EN' ? '/nft_rh_250_bw2.png' : '/nft_rh_250_ru_bw2.png'
  const defaultVideoFileUrl = '/nft_rh_250_blank.png'
  const defaultFileTypeUrl = '/nft_rh_250_blank.png'
  const [fileUrl, setFileUrl] = useState(defaultFileUrl)

  useEffect(() => {
    setTimeout(() => { if (!file) setFileUrl(defaultFileUrl) }, 100)
  }, [currLang])

  const toggleAlgo = () => {
    onClient ? setOnClient(false) : setOnClient(true)
  }
  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }
  const toggleCheck = () => {
    document.getElementById('reqformdiv4').style.visibility = 'hidden' // always down the flag
    currCheck ? setCurrCheck(false) : setCurrCheck(true)
  }
  function createNFTFormDataFile (name, description, file, sum, origN, size, addr) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('checksum', sum)
    formData.append('originalFilename', origN)
    formData.append('size', size)
    formData.append('account', 'DUMMY2')
    !onClient && formData.append('network', 'hd')
    onClient && formData.append('network', 'easy')
    onClient && formData.append('recv', addr)
    return formData
  }
  async function createNFT (metadataUrl, nftContract) {
    const transaction = await nftContract.WhistlerTurnerGainsboroughReynoldsConstable(metadataUrl)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const tokenId = event.args[2]
    return tokenId
  }
  async function uploadFileToIPFS (formData) {
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
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
    let tid = 0
    if (yon) {
      try {
        if (!file) { alert('No file selected!'); return }
        if (isLoading) return
        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const csum = async (file) => {
          if (Object.prototype.toString.call(file) === '[object File]') {
            const buffer = await file.arrayBuffer()
            const hash = await crypto.subtle.digest('SHA-256', buffer)
            const ret = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')
            return ret
          } else throw Error('File is not valid.')
        }
        const checksum = await csum(file); console.log('checksum', checksum, 'name', file.name, 'size', file.size) // correct
        // now let's create a new account
        const pkey = web3.utils.randomHex(32)
        const account = web3.eth.accounts.privateKeyToAccount(pkey)
        console.log('new acc addr', account.address)

        const formData = createNFTFormDataFile(name, description, null, checksum, file.name, file.size, account.address)
        const [metadataUrl, hash2, check] = await uploadFileToIPFS(formData)
        formData.delete('file')
        formData.delete('name')
        formData.delete('description')
        console.log('metadataUrl', metadataUrl)
        if (typeof metadataUrl === 'undefined') { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Please try later.' : 'Ошибка. Попробуйте позже.'; document.getElementById('reqformdiv4').style.display = 'block'; document.getElementById('reqformdiv4').style.visibility = 'visible'; return }
        if (metadataUrl === 'null' || metadataUrl === null) { document.getElementById('reqformdiv4').innerText = currLang === 'EN' ? 'Error occurred. Check file size must be <= 2Gb.' : 'Ошибка. Проверьте размер файла <= 2Gb.'; document.getElementById('reqformdiv4').style.display = 'block'; document.getElementById('reqformdiv4').style.visibility = 'visible'; return }

        if (onClient) { const wallet = new ethers.Wallet(pkey, provider); const myTokens = new ethers.Contract(contractAddress, contractInterface, wallet); const tokenId = await createNFT(metadataUrl, myTokens); console.log('minted tokenId', tokenId._hex); tid = parseInt(tokenId._hex, 16) }
        document.getElementById('reqformdiv4').innerText = onClient ? 'Private key: ' + pkey + ' for token #' + tid : 'Private key: ' + hash2.split('Private key: ')[1]
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
  async function onSubmitCheck ({ tId }) {
    const yon = currLang.length // always do
    if (yon) {
      try {
        if (!file) { alert('No file selected!'); return }
        if (isLoading) return

        setIsLoading(true)
        if (document.getElementById('retBut')) document.getElementById('retBut').style.display = 'none'
        const csum = async (file) => {
          if (Object.prototype.toString.call(file) === '[object File]') {
            const buffer = await file.arrayBuffer()
            const hash = await crypto.subtle.digest('SHA-256', buffer)
            const ret = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('')

            return ret
          } else throw Error('File is not valid.')
        }
        const checksum = await csum(file); console.log('checksum', checksum, 'name', file.name, 'size', file.size) // correct
        const csInBc = await fetchTokenMintedForTokenId(tId)
        document.getElementById('reqformdiv4').innerText = '0x' + checksum
        // document.getElementById('alerter').innerHTML = 'Click to Copy 0x' + checksum.substr(0, 6) + '..'
        document.getElementById('alerter').innerHTML = document.getElementById('reqformdiv4').innerText === csInBc ? 'OK Badge for Token #' + tId : 'Error: Wrong Badge for Token #' + tId
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

  async function getSendFirstGasTxByAccount (address, startBlock, endBlock) {
    const transactions = []

    try {
      for (let i = startBlock; i <= endBlock; i++) {
        const block = await web3.eth.getBlock(i, true)
        if (block && block.transactions) {
          block.transactions.forEach((tx) => {
            if (tx.to?.toLowerCase() === address.toLowerCase()) {
              transactions.push(tx)
            }
          })
        }
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
    return transactions
  }

  async function fetchTokenMintedForTokenId (tokenId) {
    let ret = ''
    try {
      const startBlock = Number(12493000) // up from 192
      const events = await HDContract.getPastEvents('TokenMinted', {
        filter: { tokenId: tokenId },
        fromBlock: startBlock,
        toBlock: 'latest'
      })
      const owner = await HDContract.methods.ownerOf(tokenId).call()
      for (const event of events) {
        const endBlock = Number(event.blockNumber)
        const startBlock = endBlock - 10 // overkill?

        const txs = await getSendFirstGasTxByAccount(owner, startBlock, endBlock)
        console.log(`Hashsum is ${txs[0].input}`); ret = txs[0].input
      }
    } catch (error) {
      console.error(`Error fetching event for token ${tokenId}:`, error)
    }
    return ret
  }
  return (
    <Card className={classes.root} component="form" sx={{ maxWidth: 345, margin: '0 auto', border: '1px solid #fff', position: 'relative', background: '#012', width: isMobile ? '77%' : '96%', height: isMobile ? '77%' : '84%' }} onSubmit={handleSubmit(onSubmitEasy)}>
      <><div onClick={toggleLang} style={{ zIndex: '100001', position: 'absolute', display: 'block', color: '#fff', backgroundColor: '#012', border: '1px solid #fff', fontSize: '24px', width: '40px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{currLang}</div>
      <div id='algoClicker' onClick={toggleAlgo} style={{ zIndex: '100001', position: 'absolute', left: '48px', display: 'block', color: onClient ? '#fff' : 'ddd', backgroundColor: onClient ? '#012' : '#012', border: '1px solid #fff', fontSize: '24px', width: '76px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{onClient ? 'CliHD' : 'SrvHD'}</div>
      <div id='checkClicker' onClick={toggleCheck} style={{ zIndex: '100001', position: 'absolute', right: '1%', display: 'block', color: '#fff', backgroundColor: '#012', border: '1px solid #fff', fontSize: '24px', width: '130px', height: '40px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '36px' }}>{ currCheck ? currLang === 'EN' ? 'Mint Token' : 'Токен' : currLang === 'EN' ? 'Check File' : 'Хэш' }</div></>
      <label htmlFor="file-input">
        <CardMedia
          className={classes.media}
          alt='Select image'
          image={fileUrl} sx={{ position: 'relative' }}>
          <div id="labelFileName" style={{ color: '#369', fontSize: '24px', position: 'absolute', top: '48px', left: '8px', display: 'none' }}></div>
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
         {currCheck && <TextField
          id="tId-input"
          label={Idee}
          name="tId"
          size="small"
          multiline
          rows={1}
          InputProps={{ style: { border: '1px solid #fff', fontSize: 24, color: '#fed' } }}
          InputLabelProps={{ style: { fontSize: 24, color: '#fed' } }}
          fullWidth
          required
          margin="dense"
          disabled={isLoading}
          {...register('tId')}
        />}
      </CardContent>
      <CardActions className={classes.cardActions}>
        {!currCheck && <Button style={{ position: 'absolute', textAlign: 'center', fontSize: '24px', bottom: '2px', marginBottom: '5px' }} size="small" color="secondary" onClick={handleSubmit(onSubmitEasy)}>{isLoading ? <><CircularProgress size="20px" /><span style={{ fontSize: '1em' }}>..please wait ..</span></> : currLang === 'EN' ? 'Mint Token' : 'Создать Токен'}</Button>}
        {currCheck && <Button style={{ position: 'absolute', textAlign: 'center', fontSize: '24px', bottom: '2px', marginBottom: '5px' }} size="small" color="secondary" onClick={handleSubmit(onSubmitCheck)}>{isLoading ? <CircularProgress size="20px" /> : currLang === 'EN' ? 'Check Sum' : 'Проверить Сумму'}</Button>}
      </CardActions>
    </Card>
  )
}
