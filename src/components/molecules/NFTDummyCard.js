import { useContext } from 'react'
import { makeStyles } from '@mui/styles'
import { Card, CardContent, Typography } from '@mui/material'
import { Text } from '@react-email/text'
import { Hr } from '@react-email/hr'
import { NFTModalContext } from '../providers/NFTModalProvider'
// import { Link } from '@react-email/link'

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    margin: '15px 15px',
    flexGrow: 1
  }
})

export default function NFTDummyCard () {
  const classes = useStyles()
  const { currLang } = useContext(NFTModalContext)
  if (currLang === 'EN') {
    return (
      <Card className={classes.root} sx={{ maxWidth: 345 }}>
       <CardContent sx={{ paddingBottom: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          >
          <Hr/><Hr/><Text>1. Private key (PK) that you have received after minting the token confirms your ownership of the token. If you have saved the PK then you can import it in MetaMask later. Room-House has also saved a copy of this PK.</Text>
          <Text>2. Maximum size for an uploaded file - 100Mb. Control sum for the file SHA256 hash is saved in Expanse blockchain in the gas transaction previous to minting the HappyDox token. Check this hash sum when you need to prove the integrity of your file.</Text><Hr/><Hr/>
          <Text>3. When the token is Locked, download the file every time within 10 sec after this page was signed in Metamask and loaded. There is NO WAY to share an external link to it.</Text>
          <Text>4. You can Edit the token contents, including upload of a new file, while the token is Locked. You can switch the token to Open with Unlock option to Publish it at the Room-House Gallery. When the token becomes Open it CANNOT be edited nor switched back to Locked again.</Text><Hr/><Hr/>
         </Typography>
        </CardContent>
      </Card>
    )
  }
  if (currLang === 'RU') {
    return (
      <Card className={classes.root} sx={{ maxWidth: 345 }}>
       <CardContent sx={{ paddingBottom: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          >
          <Hr/><Hr/><Text>1. Секретный ключ (Private key) подтверждает Ваше право собственности на токен. Если Вы сохранили ключ, Вы можете импортировать его в MetaMask. Room-House также хранит свою копию данного ключа.</Text>
          <Text>2. Максимальный размер загружаемого файла - 100Mb. Контрольная сумма файла SHA256 hash записана в блокчейне Expanse внутри транзакции газа перед печатью HappyDox токена - сверяйте по ней целостность Вашего файла.</Text>
          <Text>3. Ваш файл в режиме токена Locked доступен для скачивания в течение 10 секунд после каждой загрузки страницы, и нет возможности дать на него внешнюю ссылку.</Text>
          <Text>4. Вы можете отредактировать содержимое токена, включая загрузку нового файла, если токен Locked. Вы можете перевести токен в режим Open через опцию Unlock, чтобы опубликовать в Галерее. В режиме Open нет возможности редактировать токен и нельзя вернуть его снова в режим Locked.</Text><Hr/><Hr/>
         </Typography>
        </CardContent>
      </Card>
    )
  }
}
