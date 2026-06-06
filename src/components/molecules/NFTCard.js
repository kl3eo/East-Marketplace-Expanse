import { isMobile } from 'react-device-detect'
import { ethers } from 'ethers'
import { useContext, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import { TextField, Card, CardActions, CardContent, CardMedia, Button, Divider, Box, CircularProgress } from '@mui/material'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { Web3Context } from '../providers/Web3Provider'
// import NFTDescription from '../atoms/NFTDescription'
import NFTPrice from '../atoms/NFTPrice'
import NFTName from '../atoms/NFTName'
import NavDesc from '../atoms/NavDesc'
import NavMuseo from '../atoms/NavMuseo'
import CardAddresses from './CardAddresses'
import PriceTextField from '../atoms/PriceTextField'
import { useDispatch, useSelector } from 'react-redux'
import { setFullyLoaded, setAutoScroll } from '../../../store/actions/dataAction'
import sendEmail from '../../utils/sendEmail'
import axios from 'axios'
import styles from '../layout/Button.module.css'

const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'
const notebook = typeof window !== 'undefined' && window.screen.width < 1920
const goodNotebook = typeof window !== 'undefined' && window.screen.width > 1600
const hiResScreen = typeof window !== 'undefined' && window.screen.width >= 1920

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    margin: isMobile ? '15px 2px' : '15px',
    flexGrow: 1,
    maxWidth: 345
  },
  media: {
    height: 0,
    // paddingTop: isMobile ? '120%' : '138%',
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
  addressesContainer: {
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

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
const resServer = process.env.RES_SERVER
// const resServerPort = process.env.RES_SERVER_PORT

const defaultFileUrl = '/nft_rh_250.png'
const defaultVideoFileUrl = '/nft_video_250.png'
const defaultAudioFileUrl = '/nft_audio_250.png'
const defaultFileTypeUrl = '/filetype.png'

const videoW = '100%'
async function getAndSetListingFee (marketplaceContract, setListingFee) {
  if (!marketplaceContract) return
  const listingFee = await marketplaceContract.getListingFee()
  setListingFee(ethers.utils.formatUnits(listingFee, 'ether'))
}

export default function NFTCard ({ nft, action, updateNFT, onCliCliCli }) {
  const { pathname } = useRouter()
  const bigger = pathname === '/my-nfts'
  const { setModalNFT, setIsModalOpen, isDescOpen, currSize, currLang } = useContext(NFTModalContext)
  const { account, nftContract, marketplaceContract, hasWeb3, signed } = useContext(Web3Context)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [isBurnable, setIsBurnable] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [fullName, setFullName] = useState(false)
  const [listingFee, setListingFee] = useState('')
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(defaultFileUrl)
  const [priceError, setPriceError] = useState(false)
  const [newPrice, setPrice] = useState(0)
  const [isShortDesc, setIsShortDesc] = useState(true)

  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { loading, fullyLoaded, autoScroll, lightBgr, scalingAllowed } = storedFilteredItemsList
  // const [isVisible, setIsVisible] = useState(false)
  const classes = useStyles()
  const { name, description, image, tags } = nft
  // const href = mydocs ? 'https://nft.room-house.com/?' + description : '/?' + description
  const href = '/?' + description
  const localProvider = 0
  const regex = new RegExp(`${resServer}.room-house.com`)
  const curImage = localProvider ? image.replace(regex, currentServer + '.room-house.com') : image
  const tId = typeof nft.tokenId === 'object' ? parseInt(nft.tokenId._hex, 16) : parseInt(nft.tokenId)
  const { register, handleSubmit, reset } = useForm()
  const Cancel = <a href=''>Cancel</a>
  /* const WarningBurn = <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fed', fontSize: '24px', color: '#222', textAlign: 'center', paddingTop: '10%', display: 'none' }}>
            {currLang === 'EN' && <span>WARNING!<br/><hr/>If You Really Want to Burn This Token, Click &apos;BURN&apos; Again!<br/>Or click {Cancel} and Return.</span>}
            {currLang === 'RU' && <span>ПРЕДУПРЕЖДЕНИЕ!<br/><hr/>Если Вы реально хотите сжечь свой Токен, ещё раз кликните &apos;BURN&apos;!<br/>Или нажмите {Cancel} чтобы вернуться.</span>}
          </div> */
  let img = curImage
  // console.log('currImage', curImage)
  const m = curImage.replace('filename=', '').split('?') /* console.log('HERE M1', m[1]); if (typeof m[1] !== 'undefined' && m[1] !== 'undefined' && document.getElementById('labelFileName' + tId)) { document.getElementById('labelFileName' + tId).style.border = '1px'; document.getElementById('labelFileName' + tId).style.backgroundColor = m[1] === 'Easy_HD_Token' ? '#fed' : '#59b'; document.getElementById('labelFileName' + tId).style.color = m[1] === 'Easy_HD_Token' ? '#222' : '#fff'; document.getElementById('labelFileName' + tId).style.textDecoration = m[1] === 'Easy_HD_Token' ? 'none' : 'underline'; document.getElementById('labelFileName' + tId).style.display = 'block' } */
  const isVideo = curImage.match(/\.(mp4|webm)$/ig)
  const isAudio = curImage.match(/\.(mp3|wav)$/ig)
  const isExcel = !curImage.match(/\.(jpg|jpeg|png|webm|mp4)$/ig) && curImage.match(/\?/) && typeof m[1] !== 'undefined' && m[1] !== 'undefined'
  const loadingUrl = '/loading.png'
  const fileType = isVideo ? defaultVideoFileUrl : isAudio ? defaultAudioFileUrl : '/filetype.png'
  const isWebRTC = curImage.match(/_screen_/g) || tags.match(/eshopping/g) || tags.match(/oocoocooc/g)
  img = curImage.match(/blue_screen_/g) ? 'https://cine.room-house.com/#BLUEHALL' : img
  img = curImage.match(/red_screen_/g) ? 'https://cine.room-house.com/#REDHALL' : img
  img = curImage.match(/green_screen_/g) ? 'https://cine.room-house.com/#GREENHALL' : img
  const tagees = tags.match(/eshopping/g) || tags.match(/oocoocooc/g) ? tags.split(',') : []
  const musees = tags.match(/museo_/g) ? tags.split(',') : []
  const sizees = tags.match(/sizee_/g) ? tags.split(',') : []
  const permees = tags.match(/permee_/g) ? tags.split(',') : []
  let addree = []
  let sizee = []
  let permee = []
  let musee = []
  let museoReal = ''
  let i = 0
  let j = 0
  let k = 0
  let l = 0
  let splitName = []
  let currName = ''

  while (i < tagees.length) {
    addree = tagees[i].split('#')
    if (addree.length === 2) break
    i++
  }
  while (j < musees.length) {
    musee = musees[j].split('_')
    if (musee.length === 2 && musee[0] === 'museo') break
    j++
  }
  while (k < sizees.length) {
    sizee = sizees[k].split('_')
    if (sizee.length === 2 && sizee[0] === 'sizee') break
    k++
  }
  while (l < permees.length) {
    permee = permees[l].split('_p#l_')
    if (permee.length === 2 && permee[0] === 'permee') break
    l++
  }
  // console.log('here addree is', addree)
  img = (tags.match(/eshopping/) || tags.match(/oocoocooc/g)) && addree.length === 2 && addree[0] === addree[1] ? 'https://' + addree[0] + '.room-house.com/' : (tags.match(/eshopping/) || tags.match(/oocoocooc/g)) && addree.length === 2 ? 'https://' + addree[0] + '.room-house.com/#' + addree[1] : img
  // console.log('here len is', addree.length, 'here img is', img, 'isWebRTC', isWebRTC)
  const Sizeo = sizee.length === 2 && sizee[0] === 'sizee' ? sizee[1] : ''
  const Museo = musee.length === 2 && musee[0] === 'museo' ? musee[1] : ''

  const museoHref = musee.length === 2 && musee[0] === 'museo' ? Museo === 'cmamuseum' ? 'https://www.clevelandart.org/art/' + permee[1] : Museo === 'ngamuseum' ? 'https://www.nga.gov/content/ngaweb/Collection/art-object-page.' + permee[1] + '.html' : Museo === 'altepinakothek' || Museo === 'neuepinakothek' || Museo === 'modernepinakothek' ? 'https://www.sammlung.pinakothek.de/en/artwork/' + permee[1] : Museo === 'metmuseum' ? 'https://www.metmuseum.org/art/collection/search/' + permee[1] : Museo === 'hmbgksthalle' ? 'https://online-sammlung.hamburger-kunsthalle.de/de/objekt/' + permee[1] : Museo === 'tmamuseum' ? 'https://emuseum.toledomuseum.org/objects/' + permee[1] : Museo === 'saam' ? 'https://americanart.si.edu/artwork/' + permee[1] : Museo === 'philamuseum' ? 'https://philamuseum.org/collection/object/' + permee[1] : Museo === 'mfamuseum' ? 'https://collections.mfa.org/objects/' + permee[1] : Museo === 'lacma' ? 'https://collections.lacma.org/' + permee[1] : Museo === 'slammuseum' ? 'https://www.slam.org/collection/objects/' + permee[1] : Museo === 'belvederemuseum' ? 'https://sammlung.belvedere.at/objects/' + permee[1] : Museo === 'kunstbasel' ? 'https://sammlungonline.kunstmuseumbasel.ch/eMP/eMuseumPlus?service=ExternalInterface&module=collection&objectId=' + permee[1] + '&viewType=detailView' : Museo === 'brooklynmuseum' ? 'https://www.brooklynmuseum.org/objects/' + permee[1] : Museo === 'mauritshuis' ? 'https://www.mauritshuis.nl/ontdek-collectie/kunstwerken/' + permee[1] : Museo === 'pradomuseum' ? 'https://www.museodelprado.es/en/the-collection/art-work/' + permee[1] : Museo === 'mnac' ? 'https://www.museunacional.cat/ca/colleccio/' + permee[1] : Museo === 'smkmuseum' ? 'https://open.smk.dk/en/artwork/image/' + permee[1] : Museo === 'artic' ? 'https://www.artic.edu/artworks/' + permee[1] : Museo === 'dia' ? 'https://dia.org/collection/' + permee[1] : Museo === 'siedu' ? 'https://collections.si.edu/search/detail/' + permee[1] : Museo === 'kmska' ? 'https://www.kmska.be/en/' + permee[1] : Museo === 'nms' ? 'https://collection.nationalmuseum.se/en/collection/item/' + permee[1] : Museo === 'imamuseum' ? 'https://collections.discovernewfields.org/art/artwork/' + permee[1] : Museo === 'getty' ? 'https://www.getty.edu/art/collection/object/' + permee[1] : Museo === 'currier' ? 'https://collections.currier.org/objects-1/info/' + permee[1] : Museo === 'staedel' ? 'https://sammlung.staedelmuseum.de/en/work/' + permee[1] : Museo === 'bruggea' ? 'https://collectie.museabrugge.be/collection/work/id/' + permee[1] : Museo === 'harvardmuseum' ? 'https://harvardartmuseums.org/collections/object/' + permee[1] : Museo === 'ghentmuseum' ? 'https://www.mskgent.be/en/collection/' + permee[1] : Museo === 'waltersmuseum' ? 'https://art.thewalters.org/object/' + permee[1] : Museo === 'princely' ? 'https://www.liechtensteincollections.at/en/collections-online/' + permee[1] : Museo === 'carnegieart' ? 'https://collection.carnegieart.org/objects/' + permee[1] : Museo === 'gemaldesmb' ? 'https://recherche.smb.museum/detail/' + permee[1] : Museo === 'artsmia' ? 'https://collections.artsmia.org/art/' + permee[1] : Museo === 'gardner' ? 'https://www.gardnermuseum.org/experience/collection/' + permee[1] : Museo === 'clark' ? 'https://www.clarkart.edu/ArtPiece/Detail/' + permee[1] : Museo === 'canada' ? 'https://www.gallery.ca/collection/artwork/' + permee[1] : Museo === 'risdmuseum' ? 'https://risdmuseum.org/art-design/collection/' + permee[1] : Museo === 'pafamuseum' ? 'https://www.pafa.org/museum/collection/item/' + permee[1] : Museo === 'akronartmuseum' ? 'https://akronartmuseum.org/collection/?object=' + permee[1] : Museo === 'princetonmuseum' ? 'https://artmuseum.princeton.edu/art/collections/objects/' + permee[1] : Museo === 'whitneymuseum' ? 'https://whitney.org/collection/works/' + permee[1] : Museo === 'phillipscollection' ? 'https://www.phillipscollection.org/collection/' + permee[1] : Museo === 'yaleartgallery' ? 'https://artgallery.yale.edu/collections/objects/' + permee[1] : Museo === 'momamuseum' ? 'https://www.moma.org/collection/works/' + permee[1] : Museo === 'walkermuseum' ? 'https://walkerart.org/collections/artworks/' + permee[1] : Museo === 'desmoinesartcenter' ? 'https://emuseum.desmoinesartcenter.org/objects/' + permee[1] : Museo === 'crystalbridges' ? 'https://crystalbridges.emuseum.com/objects/' + permee[1] : Museo === 'thyssenmuseum' ? 'https://www.museothyssen.org/en/collection/' + permee[1] : Museo === 'courtauld' ? 'https://gallerycollections.courtauld.ac.uk/' + permee[1] : Museo === 'scotland' ? 'https://www.nationalgalleries.org/art-and-artists/' + permee[1] : Museo === 'tours' ? 'https://musees.tours.fr/collections/' + permee[1] : Museo === 'bellasartesba' ? 'https://www.bellasartes.gob.ar/coleccion/obra/' + permee[1] : Museo === 'fivecolleges' ? 'https://museums.fivecolleges.edu/collection/search/' + permee[1] : Museo === 'museefabre' ? 'https://www.museefabre.fr/' + permee[1] : Museo === 'marmottan' ? 'https://www.marmottan.fr/notice/' + permee[1] : Museo === 'toulouselautrec' ? 'https://www.musee-toulouse-lautrec.com/collections/chefs-d-oeuvre/' + permee[1] : Museo === 'lenbachhaus' ? 'https://www.lenbachhaus.de/digital/sammlung-online/detail/' + permee[1] : Museo === 'mahmah' ? 'https://www.mahmah.ch/collection/oeuvres/' + permee[1] : Museo === 'mcbamuseum' ? 'https://www.mcba.ch/en/collection/' + permee[1] : Museo === 'ludwig' ? 'https://museum-ludwig.kulturelles-erbe-koeln.de/documents/obj/' + permee[1] : Museo === 'centraalmuseum' ? 'https://collectie.centraalmuseum.nl/details/collection/' + permee[1] : Museo === 'wienmuseum' ? 'https://sammlung.wienmuseum.at/objekt/' + permee[1] : Museo === 'nasjonalmuseet' ? 'https://www.nasjonalmuseet.no/en/collection/object/' + permee[1] : Museo === 'buffaloakg' ? 'https://buffaloakg.org/artworks/' + permee[1] : Museo === 'albertina' ? 'https://sammlungenonline.albertina.at/en/objects/' + permee[1] : Museo === 'manchesterag' ? 'https://collections.manchesterartgallery.org/collections/item/' + permee[1] : Museo === 'victoria' ? 'https://www.ngv.vic.gov.au/explore/collection/work/' + permee[1] : Museo === 'guggenheim' ? 'https://www.guggenheim.org/artwork/' + permee[1] : Museo === 'buehrle' ? 'https://buehrle.ch/en/artworks/' + permee[1] : Museo === 'vangoghmuseum' ? 'https://www.vangoghmuseum.nl/en/collection/' + permee[1] : Museo === 'hagginmuseum' ? 'https://hagginmuseum.org/collections/' + permee[1] : Museo === 'sdmart' ? 'https://collection.sdmart.org/' + permee[1] : Museo === 'artsbma' ? 'https://www.artsbma.org/collection/' + permee[1] : Museo === 'tatemuseum' ? 'https://www.tate.org.uk/art/artworks/' + permee[1] : Museo === 'dmamuseum' ? 'https://www.dma.org/art/collection/object/' + permee[1] : Museo === 'famsf' ? 'https://www.famsf.org/artworks/' + permee[1] : Museo === 'chrysler' ? 'https://chrysler.emuseum.com/objects/' + permee[1] : Museo === 'terra' ? 'https://collection.terraamericanart.org/objects/' + permee[1] : Museo === 'reinasofia' ? 'https://www.museoreinasofia.es/en/collections/artwork/' + permee[1] : Museo === 'royaltrust' ? 'https://www.rct.uk/collection/' + permee[1] : Museo === 'karlsruhe' ? 'https://www.kunsthalle-karlsruhe.de/kunstwerke/' + permee[1] : Museo === 'dulwich' ? 'https://www.dulwichpicturegallery.org.uk/explore/explore-the-collection/' + permee[1] : Museo === 'khm' ? 'https://www.khm.at/en/artworks/' + permee[1] : Museo === 'worcester' ? 'https://worcester.emuseum.com/objects/' + permee[1] : Museo === 'carmenthyssen' ? 'https://www.carmenthyssenmalaga.org/obra/' + permee[1] : Museo === 'mesdag' ? 'https://www.demesdagcollectie.nl/en/collection/' + permee[1] : Museo === 'bruecke' ? 'https://www.bruecke-museum.de/en/sammlung/werke/' + permee[1] : Museo === 'allen' ? 'https://allenartcollection.oberlin.edu/objects/' + permee[1] : Museo === 'thorvald' ? 'https://kataloget.thorvaldsensmuseum.dk/' + permee[1] : Museo === 'aargauer' ? 'https://aargauerkunsthaus.ch/werk/' + permee[1] : Museo === 'muzee' ? 'https://www.muzee.be/en/' + permee[1] : '/?' + Museo : ''

  museoReal = Museo === 'neuepinakothek' ? 'Neue Pinakothek, Munchen' : museoReal // CC BY-SA 4.0 for public domain
  museoReal = Museo === 'altepinakothek' ? 'Alte Pinakothek, Munchen' : museoReal // the same
  museoReal = Museo === 'modernepinakothek' ? 'Pinakothek der Moderne, Munchen' : museoReal // the same
  museoReal = Museo === 'belvederemuseum' ? 'Galerie Belvedere, Wien' : museoReal // store 0xB38D permission by email for educ.&non-comm. purposes; https://www.belvedere.at/en/legal-notice
  museoReal = Museo === 'kunstbasel' ? 'Kunstmuseum, Basel' : museoReal // open access for PD e.g. https://download.kunstmuseumbasel.ch/#/ImageRequestFormular/1502
  museoReal = Museo === 'metmuseum' ? 'Met Museum, New York' : museoReal // open access for PD https://www.metmuseum.org/policies/terms-and-conditions
  museoReal = Museo === 'slammuseum' ? 'Art Museum, Saint Louis' : museoReal // open access for PD
  museoReal = Museo === 'philamuseum' ? 'Museum of Art, Philadelphia' : museoReal // open access for PD
  museoReal = Museo === 'cmamuseum' ? 'Museum of Art, Cleveland' : museoReal // open access
  museoReal = Museo === 'ngamuseum' ? 'NGA, Washington' : museoReal // open access
  museoReal = Museo === 'saam' ? 'Smithsonian AAM' : museoReal // open access cc0
  museoReal = Museo === 'lacma' ? 'County Museum of Art, LA' : museoReal // without restriction on PD
  museoReal = Museo === 'smkmuseum' ? 'SMK, Copenhagen' : museoReal // open access
  museoReal = Museo === 'artic' ? 'Art Institute, Chicago' : museoReal // open access with CC0 tag
  museoReal = Museo === 'dia' ? 'Detroit Inst. of Arts' : museoReal // open access for PD
  museoReal = Museo === 'siedu' ? 'Smithsonian NMAA' : museoReal // open access cc0
  museoReal = Museo === 'kmska' ? 'KMSKA, Antwerpen' : museoReal // open access
  museoReal = Museo === 'nms' ? 'Nationalmuseum, Stockholm' : museoReal // CC BY-SA, or no CR https://www.nationalmuseum.se/en/explore-art-and-design/images/rights-and-reproductions
  museoReal = Museo === 'imamuseum' ? 'IMA, Indianapolis' : museoReal // cc0 for PD
  museoReal = Museo === 'getty' ? 'Getty Museum, LA' : museoReal // any purpose Getty Open Content
  museoReal = Museo === 'staedel' ? 'Staedel, Frankfurt' : museoReal // open access on PD
  museoReal = Museo === 'ghentmuseum' ? 'Ghent Museum, Belgium' : museoReal // unrestricted use for PD https://www.mskgent.be/en/collection/image-rights
  museoReal = Museo === 'waltersmuseum' ? 'Walters Museum, Baltimore' : museoReal // cc0 for PD https://thewalters.org/about/policies/rights-reproductions/
  museoReal = Museo === 'gemaldesmb' ? 'Staatliche Museen zu Berlin' : museoReal // open access https://www.smb.museum/en/open-science/use/ Gemäldegalerie, Berlin
  museoReal = Museo === 'artsmia' ? 'Minneapolis Inst. of Art' : museoReal // open access on PD
  museoReal = Museo === 'clark' ? 'Clark Art Institute, MA' : museoReal // open access for PD https://www.clarkart.edu/museum/collections/image-resources
  museoReal = Museo === 'yaleartgallery' ? 'Yale Art Gallery, New Haven' : museoReal // open access
  museoReal = Museo === 'courtauld' ? 'Courtauld Gallery, London' : museoReal // CC license whenever possible https://courtauld.ac.uk/gallery/copyright/
  museoReal = Museo === 'lenbachhaus' ? 'Lenbachhaus, Munchen' : museoReal // tags with Creative Commons license CC0 1.0 are free to dnld
  museoReal = Museo === 'centraalmuseum' ? 'Centraal Museum, Utrecht' : museoReal // images have public domain notice and ask to mention the Museo. which we do.
  museoReal = Museo === 'wienmuseum' ? 'Wien Museum, Vienna' : museoReal // public domain free use CC-BY
  museoReal = Museo === 'nasjonalmuseet' ? 'National Museum, Oslo' : museoReal // public domain free use CC-BY
  museoReal = Museo === 'albertina' ? 'Albertina Museum, Vienna' : museoReal // free on PD to 1200px
  museoReal = Museo === 'manchesterag' ? 'Art Gallery, Manchester' : museoReal // CC BY-SA https://manchesterartgallery.org/about/loans-and-licensing
  museoReal = Museo === 'artsbma' ? 'Birmingham Museum of Art, AL' : museoReal // open access for PD
  museoReal = Museo === 'dmamuseum' ? 'Dallas Museum of Art, TX' : museoReal // open access for PD
  museoReal = Museo === 'karlsruhe' ? 'Staatliche Kunsthalle, Karlsruhe' : museoReal // download in high res & no english
  museoReal = Museo === 'bruecke' ? 'Bruecke-Museum, Berlin' : museoReal // CC-BY-SA https://www.bruecke-museum.de/en/sammlung/nutzungsrechte/846/creative-commons-lizenz-cc-by-sa-4-0
  museoReal = Museo === 'thorvald' ? 'Thorvaldsen\'s Museum, Denmark' : museoReal // open access
  museoReal = Museo === 'muzee' ? 'Museum of Modern Art, Ostend' : museoReal // hi-res and dnld button, no terms of use, open access

  // total removed 33 + 31 + 111 + 13 + 17 + 5 + 21 + 21 + 7 + 39 + 9 + 18 + 10 + 6 + 20 + 9 + 6 + 9 + 33 + 20 + 18 + 30 + 5 + 1 + 1 + 3 + 4 + 2 + 3 + 1 + 1 + 1 + 1 + 1 + 3 + 2 + 1 + 5 + 3 + 5 + 2 + 1 + 1 + 2 + 3 + 1 + 9 + 3 = 551 items 48 museums

  museoReal = Museo === 'mauritshuis' ? 'Mauritshuis, The Hague' : museoReal // REMOVED; 33 items bought 0x1c1e - non-commercial warning on download button
  museoReal = Museo === 'dulwich' ? 'Dulwich Picture Gallery, London' : museoReal // REMOVED; bought 0x4599 4 items; low res; personal use inc. educational non-profit
  museoReal = Museo === 'khm' ? 'Kunsthistorisches Museum, Wien' : museoReal // REMOVED; https://www.khm.at/en/museum/rights-reproduction all 21 bought by 0xbc26; total 22 tokens
  museoReal = Museo === 'worcester' ? 'Worcester Art Museum, MA' : museoReal // REMOVED; bought 0x4599 2 items; 3 items total; fair use
  museoReal = Museo === 'carmenthyssen' ? 'Museo Carmen Thyssen, Malaga' : museoReal // REMOVED; bought 0x4599 3 items; legal 2018 bad but download is in high res (3k)
  museoReal = Museo === 'famsf' ? 'Fine Arts Museums, SF' : museoReal // REMOVED; bought 0x4599 5 items; fair use
  museoReal = Museo === 'chrysler' ? 'Chrysler Art Museum, Norfolk, VA' : museoReal // REMOVED; bought 0x4599 1 item; fair use
  museoReal = Museo === 'terra' ? 'Terra Foundation for American Art, IL' : museoReal // REMOVED; bought 0x4599 1 item; fair use https://www.terraamericanart.org/collection/image-rights-and-reproductions/
  museoReal = Museo === 'reinasofia' ? 'Museo Reina Sofia, Madrid' : museoReal // REMOVED; bought 0x4599 3 items;non-commercial CC https://www.museoreinasofia.es/aviso-legal
  museoReal = Museo === 'royaltrust' ? 'Royal Collection Trust, UK' : museoReal // REMOVED; 9 items bought 0xB38D written permission for commercial https://www.rct.uk/about/policies/copyright
  museoReal = Museo === 'tatemuseum' ? 'Tate Gallery, UK' : museoReal // REMOVED; 18 items bought 0xCfE8 non-commercial https://www.tate.org.uk/about-us/policies-and-procedures/website-terms-use; total 20 tokens
  museoReal = Museo === 'victoria' ? 'National Gal. of Victoria, Melbourne' : museoReal // REMOVED; all 5 bought by 0x5F4B - lots of BAD stuff at https://www.ngv.vic.gov.au/about/reports-and-documents/copyright-and-reproductions/
  museoReal = Museo === 'scotland' ? 'National Gals. of Scotland, Edinburgh' : museoReal // REMOVED; 9 items bought 0x6BbF educational with link back; https://www.nationalgalleries.org/website-terms-of-use
  museoReal = Museo === 'thyssenmuseum' ? 'Museo Thyssen-Bornemisza, Madrid' : museoReal // REMOVED; bought by 0x2Ed 17 items; 21 tokens total; educational&noncommercial
  museoReal = Museo === 'princetonmuseum' ? 'Princeton Univ. Art Museum' : museoReal // REMOVED; 10 items bought 0xCfE8 fair use non-commercial https://artmuseum.princeton.edu/terms-and-conditions
  museoReal = Museo === 'whitneymuseum' ? 'Whitney Museum, NYC' : museoReal // REMOVED; 6 items bought 0xCfE8 fair use non-commercial https://whitney.org/terms-and-conditions
  museoReal = Museo === 'phillipscollection' ? 'Phillips Collection, Washington' : museoReal // REMOVED; bought by 0x2Ed 13 items; 17 items total noncommercial educational with link back
  museoReal = Museo === 'canada' ? 'National Gallery of Canada, Ottawa' : museoReal // REMOVED; 6 items bought 0x6BbF non-commercial https://www.gallery.ca/terms-of-use
  museoReal = Museo === 'risdmuseum' ? 'RISD Museum, Providence' : museoReal // REMOVED; 7 items bought by c16f8 CC BY-NC-SA 3.0 US https://risdmuseum.org/terms-use
  museoReal = Museo === 'gardner' ? 'I.S.Gardner Museum, Boston' : museoReal // REMOVED; 21 items owned by c16f8; Creative Commons license (CC BY-NC-ND 4.0) https://www.gardnermuseum.org/organization/rights-reproductions
  museoReal = Museo === 'bruggea' ? 'Musea Brugge, Belgium' : museoReal // REMOVED; 9 items owner 0x55a PD non-commercial and link to https://artinflanders.be/en; FORBIDDEN
  museoReal = Museo === 'harvardmuseum' ? 'Harvard Art Museums, MA' : museoReal // REMOVED; 39 items owner 0x55a non-commercial&educational https://harvardartmuseums.org/terms-of-use
  museoReal = Museo === 'mfamuseum' ? 'Museum of Fine Arts, Boston' : museoReal // REMOVED; 111 items by 3 buyers; fair use for non-commercial&educational purpose; otherwise prohibited https://www.mfa.org/about/terms-of-use
  museoReal = Museo === 'mnac' ? 'MNAC, Barcelona' : museoReal // REMOVED; 20 items bought 0x6BbF CC BY-NC-SA 3.0.0 https://www.museunacional.cat/en/legal-notice
  museoReal = Museo === 'pradomuseum' ? 'Museo del Prado, Madrid' : museoReal // REMOVED; non-commercial&educational; all 31 items bought by 0x9e3A
  museoReal = Museo === 'tmamuseum' ? 'Toledo Museum of Art' : museoReal // REMOVED; 30 items owned by 0xd166 FAIR USE FOR PUBLIC DOMAIN https://toledomuseum.org/collection/image-resources/
  museoReal = Museo === 'brooklynmuseum' ? 'Brooklyn Museum, New York' : museoReal // REMOVED; 18 items bought 0xa54c; 19 tokens total; brooklynmuseum.org/image-services - use for noncommercial purposes with proper attribution
  museoReal = Museo === 'hmbgksthalle' ? 'Kunsthalle, Hamburg' : museoReal // REMOVED; 20 items bought 0xa54C; no explicit CR message, no dnld button but good quality dnld is possible
  museoReal = Museo === 'marmottan' ? 'Musée Marmottan Monet, Paris' : museoReal // REMOVED; bought 0x4599 1 item; no info about CR; no dnld button but good quality images
  museoReal = Museo === 'toulouselautrec' ? 'Musée Toulouse-Lautrec, Albi' : museoReal // REMOVED; bought 0x4599 1 item; no info on copyright; old school online gallery
  museoReal = Museo === 'mahmah' ? 'Museum of Art and History, Geneva' : museoReal // REMOVED; bought 0x4599 1 item; personal&educational ok https://www.mahmah.ch/faq
  museoReal = Museo === 'momamuseum' ? 'Museum of Modern Art, NYC' : museoReal // REMOVED; bought 0x4599 1 item; fair use for educational and non-commercial; 4 tokens total
  museoReal = Museo === 'walkermuseum' ? 'Walker Art Center, MN' : museoReal // REMOVED; bought 0xA298 1 item; non-commercial & educational only CR 2020
  museoReal = Museo === 'guggenheim' ? 'Guggenheim, New York' : museoReal // REMOVED; bought 0x4599 3 items; fair use & educational non-commercial
  museoReal = Museo === 'buehrle' ? 'Emil Buehrle Collection, Zurich' : museoReal // REMOVED; bought 0x4599 2 items; no info at the site; asked on email; good qual images
  museoReal = Museo === 'princely' ? 'Liechtenstein Collections' : museoReal // REMOVED; bought 0x4599 1 item;
  museoReal = Museo === 'akronartmuseum' ? 'Akron Art Museum, OH' : museoReal // REMOVED; bought 0x4599 5 items; no comment on CR on the site. Asked them.
  museoReal = Museo === 'mcbamuseum' ? 'Musée cantonal des Beaux-Arts, Lausanne' : museoReal // REMOVED; bought 0x4599 3 items; no information on usage terms; asked in email; no good reply
  museoReal = Museo === 'ludwig' ? 'Museum Ludwig, Cologne' : museoReal // REMOVED; bought 0xE0FD 6 items; download button 1200 pix no mention of Public Domain or copyright. Dubious. Need to write them.
  museoReal = Museo === 'vangoghmuseum' ? 'Van Gogh Museum, Amsterdam' : museoReal // REMOVED; bought 0xe4 2 items;low quality images but can be dnld; no comment on terms
  museoReal = Museo === 'hagginmuseum' ? 'Haggin Museum, Stockton, CA' : museoReal // REMOVED; 1 item bought 0xe4 no comment on terms of use
  museoReal = Museo === 'sdmart' ? 'San Diego Museum of Art, CA' : museoReal // REMOVED; 1 item bought 0xe4; no terms of use, low qual
  museoReal = Museo === 'mesdag' ? 'Mesdag Collection, The Hague' : museoReal // REMOVED bought 2 items 0xE0FD; low res downloads, non-commercial https://www.demesdagcollectie.nl/en/about/terms-and-conditions
  museoReal = Museo === 'allen' ? 'Allen Memorial Art Museum, OH' : museoReal // REMOVED; owner 0x082 3 items download button, no Terms of Use found; low res
  museoReal = Museo === 'aargauer' ? 'Aargauer Kunsthaus, Switzerland' : museoReal // REMOVED; bought 0x082 1 item; no terms of use
  museoReal = Museo === 'bellasartesba' ? 'MN Bellas Artes, Buenos Aires' : museoReal // REMOVED; bought 0x082 9 items; no info; asked by email
  museoReal = Museo === 'buffaloakg' ? 'Buffalo AKG Art Museum' : museoReal // REMOVED 10 items; images download for educ only; https://buffaloakg.org/terms-use
  museoReal = Museo === 'currier' ? 'Currier MA, NH' : museoReal // dubious; asked on email, no reply; REMOVED 3 items

  museoReal = Museo === 'pafamuseum' ? 'PAFA Museum, Philadelphia' : museoReal // BAD https://www.pafa.org/legal
  museoReal = Museo === 'fivecolleges' ? 'Five College Museums, Amherst, MA' : museoReal // real BAD
  museoReal = Museo === 'museefabre' ? 'Musée Fabre, Montpellier' : museoReal // BAD
  museoReal = Museo === 'tours' ? 'Musée des Beaux-arts de Tours, France' : museoReal // BAD
  museoReal = Museo === 'desmoinesartcenter' ? 'Des Moines Art Center, IA' : museoReal // no access, really BAD
  museoReal = Museo === 'crystalbridges' ? 'Crystal Bridges, Bentonville, AR' : museoReal // no access, really BAD
  museoReal = Museo === 'carnegieart' ? 'Carnegie MA, Pittsburgh' : museoReal // BAD

  const curSizee = Sizeo === 'long' ? '84%' : currSize
  const curBo = Sizeo === 'long' && currSize === '138%' ? '54%' : '0'

  const museoCol = Museo === 'mauritshuis' ? '#963' : Museo === 'belvederemuseum' ? '#639' : Museo === 'hmbgksthalle' ? '#936' : Museo === 'kunstbasel' ? '#69c' : Museo === 'metmuseum' ? '#4a7' : Museo === 'slammuseum' ? '#a47' : Museo === 'philamuseum' ? '#47a' : Museo === 'tmamuseum' ? '#53a' : Museo === 'saam' ? '#5a3' : Museo === 'cmamuseum' ? '#35a' : Museo === 'ngamuseum' ? '#3a5' : Museo === 'brooklynmuseum' ? '#a35' : Museo === 'mfamuseum' ? '#a74' : Museo === 'lacma' ? '#d48' : Museo === 'mnac' ? '#4d8' : Museo === 'smkmuseum' ? '#48d' : Museo === 'artic' ? '#246' : Museo === 'dia' ? '#462' : Museo === 'siedu' ? '#624' : Museo === 'kmska' ? '#642' : Museo === 'nms' ? '#264' : Museo === 'imamuseum' ? '#468' : Museo === 'getty' ? '#648' : Museo === 'currier' ? '#684' : Museo === 'staedel' ? '#864' : Museo === 'bruggea' ? '#846' : Museo === 'harvardmuseum' ? '#735' : Museo === 'ghentmuseum' ? '#375' : Museo === 'waltersmuseum' ? '#357' : Museo === 'princely' ? '#753' : Museo === 'carnegieart' ? '#573' : Museo === 'gemaldesmb' ? '#537' : Museo === 'artsmia' ? '#648' : Museo === 'gardner' ? '#975' : Museo === 'clark' ? '#795' : Museo === 'canada' ? '#957' : Museo === 'risdmuseum' ? '#597' : Museo === 'pafamuseum' ? '#759' : Museo === 'akronartmuseum' ? '#258' : Museo === 'princetonmuseum' ? '#528' : Museo === 'whitneymuseum' ? '#285' : Museo === 'phillipscollection' ? '#825' : Museo === 'yaleartgallery' ? '#582' : Museo === 'momamuseum' ? '#852' : Museo === 'walkermuseum' ? '#652' : Museo === 'desmoinesartcenter' ? '#526' : Museo === 'crystalbridges' ? '#265' : Museo === 'thyssenmuseum' ? '#625' : Museo === 'courtauld' ? '#562' : Museo === 'scotland' ? '#256' : Museo === 'tours' ? '#653' : Museo === 'bellasartesba' ? '#563' : Museo === 'fivecolleges' ? '#356' : Museo === 'museefabre' ? '#365' : Museo === 'marmottan' ? '#536' : Museo === 'toulouselautrec' ? '#456' : Museo === 'lenbachhaus' ? '#546' : Museo === 'mahmah' ? '#645' : Museo === 'mcbamuseum' ? '#564' : Museo === 'ludwig' ? '#465' : Museo === 'centraalmuseum' ? '#654' : Museo === 'wienmuseum' ? '#754' : Museo === 'nasjonalmuseet' ? '#574' : Museo === 'buffaloakg' ? '#745' : Museo === 'albertina' ? '#547' : Museo === 'manchesterag' ? '#475' : Museo === 'victoria' ? '#457' : Museo === 'guggenheim' ? '#755' : Museo === 'buehrle' ? '#557' : Museo === 'vangoghmuseum' ? '#575' : Museo === 'hagginmuseum' ? '#686' : Museo === 'artsbma' ? '#668' : Museo === 'tatemuseum' ? '#866' : Museo === 'dmamuseum' ? '#977' : Museo === 'famsf' ? '#797' : Museo === 'chrysler' ? '#779' : Museo === 'terra' ? '#880' : Museo === 'reinasofia' ? '#808' : Museo === 'royaltrust' ? '#088' : Museo === 'karlsruhe' ? '#244' : Museo === 'dulwich' ? '#242' : Museo === 'khm' ? '#224' : Museo === 'worcester' ? '#422' : Museo === 'carmenthyssen' ? '#424' : Museo === 'mesdag' ? '#442' : Museo === 'bruecke' ? '#553' : Museo === 'allen' ? '#355' : Museo === 'thorvald' ? '#533' : Museo === 'aargauer' ? '#353' : Museo === 'muzee' ? '#335' : '#693'

  useEffect(() => {
    getAndSetListingFee(marketplaceContract, setListingFee)
    if (mydocs) setPrice('100000000')
    // console.log('NFTCard nft is', nft)
    // checkSigned(nft)
  }, [])
  /* useEffect(() => {
    const m = image.replace('filename=', '').split('?'); if (typeof m[1] !== 'undefined' && m[1] !== 'undefined' && document.getElementById('labelFileName' + tId)) { document.getElementById('labelFileName' + tId).innerText = m[1] }
    // console.log('NFTCard nft is', nft)
  }, [image, isEdited]) */

  const dispatch = useDispatch()
  /*
.htaccess for temp to download to filename param
RewriteEngine On
RewriteCond %{QUERY_STRING} (?:^|&)filename=([^&]+)
RewriteRule ^ - [E=FILENAME:%1]
Header set "Content-Disposition" "attachment; filename=\"%{FILENAME}e\"" env=FILENAME
*/
  const fileBanner = <a href={curImage} download={typeof m[1] !== 'undefined' && m[1] !== 'undefined' && m[1] !== 'Easy_HD_Token' ? m[1] : ''} id={'labelFileName' + tId} style={{ color: m[1] === 'Easy_HD_Token' ? '#222' : '#fff', fontSize: '20px', position: 'absolute', top: '10px', left: '10px', background: m[1] === 'Easy_HD_Token' ? '#fed' : '#59b', padding: '2px 4px', display: 'block', opacity: '1' }}>{m[1]}</a>

  const clickerSigned = nft.isSigned || ((mydocs || split96) && bigger) ? <div className={styles.noCursor} id={'cs_' + tId} style={{ minWidth: '48px', minHeight: '48px', width: '3vw', height: '3vw', borderRadius: isMobile ? '24px' : '1.5vw', background: isVideo ? '#b58' : isAudio ? '#8b5' : !isExcel ? '#ddb' : '#58b', color: !isExcel ? '#222' : '#fff', position: 'absolute', bottom: goodNotebook ? split96 ? '-3.3vw' : '-5vw' : '-4vw', right: '10px', zIndex: '999', fontStyle: 'italic', lineHeight: isMobile ? '36px' : '3vw', fontSize: isMobile ? '18px' : '24px', fontFamily: 'Times', textAlign: 'center' }} onClick={getFileInfo}>info</div> : (mydocs || split96) && !bigger ? <div className={styles.noCursor} id={'cs_' + tId} style={{ minWidth: '24px', minHeight: '24px', width: '1.5vw', height: '1.5vw', borderRadius: '1vw', background: isVideo ? '#b58' : isAudio ? '#8b5' : !isExcel ? '#ddb' : '#58b', color: !isExcel ? '#222' : '#fff', position: 'absolute', bottom: isDescOpen ? '-1.6vw' : '-0.5vw', right: '10px', zIndex: '999', fontStyle: 'italic', lineHeight: '1,5vw', fontSize: '20px', fontWeight: 'bold', fontFamily: 'Times', textAlign: 'center' }} onClick={getFileInfo2}>i</div> : ''
  const ifrMemo = <div style={{ backgroundColor: '#112', height: '480px', width: '100%', position: 'relative', top: '0px', opacity: fullyLoaded ? '1' : '1' }}><iframe allow='camera; microphone' src={img} style={{ height: '480px', width: '100%', position: 'relative', top: '0px', border: '0px' }}></iframe></div>

  const Informer = <div id={'informer' + tId} style={{ display: 'none', position: 'relative', width: '100%', height: '100%', minHeight: split96 ? '52vh' : '480px', background: '#fed', color: '#369', padding: '5px', fontSize: isMobile ? '12px' : '16px', textAlign: 'center' }}><div style={{ display: 'table-cell', verticalAlign: 'middle', margin: '0 auto' }}><div id={'informer_text' + tId} style={{ width: '100%', fontSize: isMobile ? '12px' : '14px', lineHeight: isMobile ? '14px' : '24px', textAlign: 'left', padding: '3px' }}>Hash Match: &#x2705; OK, &#x274C; no, ? no data<hr/><div><b>File:</b> <span id={'informer_text_0_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>File Size:</b> <span id={'informer_text_0a_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Sha256:</b> <span id={'informer_text_1_' + tId} style={{ background: '#fff', padding: '2px' }}></span><span style={{ fontSize: '24px' }} id={'informer_checkbox_1_' + tId}></span><span style={{ display: 'none' }} id={'informer_hidden_1_' + tId}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_1_' + tId).innerText) }>Copy</span></div><div><b>Creator:</b> <span id={'informer_text_6_' + tId} style={{ background: '#fff', padding: '2px' }}></span><span style={{ display: 'none' }} id={'informer_hidden_6_' + tId}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_6_' + tId).innerText) }>Copy</span></div><div><b>TX with data:</b> <span id={'informer_text_3_' + tId} style={{ background: '#fff', padding: '2px' }}></span><span style={{ display: 'none' }} id={'informer_hidden_3_' + tId}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_3_' + tId).innerText) }>Copy</span></div><div><b>Token ID:</b> <span id={'informer_text_7_' + tId} style={{ background: '#fff', padding: '2px' }}>{tId}</span></div><div><b>Minted at:</b> <span id={'informer_text_2_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Mint in Block:</b> <span id={'informer_text_5_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Title:</b> <span id={'informer_text_8_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Description:</b> <span id={'informer_text_4_' + tId} style={{ background: '#fff', padding: '2px' }}></span></div></div><div style={{ width: '75px', textAlign: 'center', position: 'absolute', bottom: '2vw', right: '5px' }} onClick={() => { document.getElementById('informer' + tId).style.display = 'none'; document.getElementById('cm_' + tId).style.opacity = 1; document.getElementById('cm_' + tId).style.display = 'block'; document.getElementById('cc_' + tId).style.display = 'block' }}><span style={{ display: 'inline', background: 'transparent', border: '1px solid #222', borderRadius: '3px', padding: '4px', cursor: 'pointer' }}>Close</span></div></div></div>

  const Unlocker = currLang === 'EN' ? <div id={'unlocker' + tId} style={{ display: 'none', position: 'relative', width: '100%', height: '100%', background: '#fed', color: '#369', padding: '5px', fontSize: '16px', textAlign: 'center' }}><div style={{ display: 'table-cell', verticalAlign: 'middle', margin: '0 auto' }}>Hello, Friend!<p>You understand that you cannot Lock this Token again after Unlocking?</p><p>While this Token is Locked, nobody can see it but You. After Unlocking, You can sell this Token on the Marketplace, and everyone will be able to see it. Do you REALLY want to Unlock it?</p><div style={{ position: 'relative', width: '100%' }}><div style={{ float: 'left', width: '50%', background: '#fff', border: '1px', cursor: 'pointer' }} onClick={async () => { document.getElementById('unlocker' + tId).style.display = 'none'; document.getElementById('cm_' + tId).style.display = 'block'; document.getElementById('cc_' + tId).style.display = 'block' /* const fData = new FormData(); fData.append('tId', tId); fData.append('signed', signed); const { data } = await axios.post('/api/test_api', fData, { headers: { 'Content-Type': 'multipart/form-data' } }); console.log('testApi res', data) */ }}>No. Go back</div><div style={{ float: 'left', width: '50%', background: '#9cf', border: '1px', cursor: 'pointer' }} onClick={async () => { const res = await unlockToken(tId, signed); if (typeof res.result !== 'undefined' && res.result === 'OK') { location.reload() } else { location.reload() } }}>Yes, I want!</div><div style={{ float: 'none' }}/></div></div></div> : <div id={'unlocker' + tId} style={{ display: 'none', position: 'relative', width: '100%', height: '100%', background: '#fed', color: '#369', padding: '5px', fontSize: '16px', textAlign: 'center' }}><div style={{ display: 'table-cell', verticalAlign: 'middle', margin: '0 auto' }}>Привет, товарищ!<p>Вы понимаете, что нельзя снова сделать токен Locked после Unlock?</p><p>Пока он Locked, никто не видит его кроме Вас. После Unlock он станет доступен для просмотра всем. Вы точно хотите Unlock токена?</p><div style={{ position: 'relative', width: '100%' }}><div style={{ float: 'left', width: '50%', background: '#fff', border: '1px', cursor: 'pointer' }} onClick={async () => { document.getElementById('unlocker' + tId).style.display = 'none'; document.getElementById('cm_' + tId).style.display = 'block'; document.getElementById('cc_' + tId).style.display = 'block' }}>Нет, иду обратно.</div><div style={{ float: 'left', width: '50%', background: '#9cf', border: '1px', cursor: 'pointer' }} onClick={async () => { const res = await unlockToken(tId, signed); if (typeof res.result !== 'undefined' && res.result === 'OK') { location.reload() } else { location.reload() } }}>Да, хочу!</div><div style={{ float: 'none' }}/></div></div></div>

  const Memoized = isExcel || isVideo || isAudio ? <CardMedia id={'cm_' + tId} className={classes.media} href={curImage} download={typeof m[1] !== 'undefined' && m[1] !== 'undefined' && m[1] !== 'Easy_HD_Token' ? m[1] : ''} alt={name} image={fileType} component="a" onClick={handleCardImageClick} sx={{ position: 'relative', paddingTop: curSizee, marginTop: curBo }}>{fileBanner}{clickerSigned}</CardMedia> : isVideo && !loading && fullyLoaded ? <CardMedia id={'cm_' + tId} className="MuiCardMedia-root MuiCardMedia-media" alt={name} image={curImage} component="video" controls onClick={handleCardVideoClick} sx={{ width: { videoW }, height: '195px', paddingTop: curSizee, marginTop: curBo }} /> : isVideo && (loading || !fullyLoaded) ? <CardMedia id={'cm_' + tId} className={classes.media} alt={name} image={loadingUrl} component="a" onClick={handleCardImageClick} sx={{ paddingTop: curSizee, marginTop: curBo }} /> : isWebRTC && isClicked ? ifrMemo : isWebRTC && (loading || !fullyLoaded) ? <CardMedia id={'cm_' + tId} className={classes.media} alt={name} image={curImage} component="a" onClick={handleWebRTCClick} style={{ opacity: fullyLoaded ? '1' : '1', paddingTop: curSizee, marginTop: curBo }}/> : <CardMedia id={'cm_' + tId} className={classes.media} alt={name} image={curImage} component="a" onClick={handleCardImageClick} sx={{ position: 'relative', paddingTop: curSizee, marginTop: curBo, backgroundColor: bigger ? '#fff' : '#58b' }}>{clickerSigned}</CardMedia>

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
    burn: {
      text: 'Burn',
      method: burnNft
    },
    /* sell: {
      text: isBurnable ? 'Send a postcard' : (mydocs) ? 'Burn' : listingFee ? `Sell (${listingFee} fee)` : 'Sell',
      method: isBurnable || (mydocs) ? burnNft : sellNft
    }, */
    sell: {
      text: isBurnable ? 'Send a postcard' : ((mydocs || split96) && nft.isLocked) ? 'Burn' : mydocs || split96 ? 'Publish' : listingFee ? `Sell (${listingFee} fee)` : 'Sell',
      method: isBurnable || ((mydocs || split96) && nft.isLocked) ? burnNft : sellNft
    },
    sellnoburn: {
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
      value: price,
      gasLimit: 192000,
      gasPrice: 6000000000
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

  async function burnNft (nft) {
    const burnTx = await nftContract.burner(nft.tokenId)
    await burnTx.wait()
    updateNFT()
    await sendEmail('alexshevlakov@yandex.ru', 'token ' + nft.tokenId + ' burned', '')
    return burnTx
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
    isWebRTC && setIsClicked(true)
    if (isWebRTC || isExcel) return
    isBurnable ? setIsBurnable(false) : setIsBurnable(true)
    setModalNFT(nft)
    setIsModalOpen(true)
    if (autoScroll) dispatch(setAutoScroll(false))
    // getFileInfo()
    // console.log('here webrtc is', isWebRTC, 'is clicked is', isClicked, 'burnable', setModalNFT)
  }
  function handleWebRTCClick (e) {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(false)
    setIsClicked(true)
  }

  function handleCardVideoClick (e) {
    e.preventDefault()
  }

  async function onClicker (nft, par) {
    try {
      setIsLoading(true)
      par ? await burnNft(nft) : await actions[action].method(nft)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      dispatch(setFullyLoaded(true))
      console.log('ACSHHHN!', nft.tokenId, actions[action].text)
    }
  }

  /* async function checkSigned (nft) {
    if (isLocked) return // but it never is
    // console.log('check signed: going to try!')
    try { const fData1 = new FormData(); fData1.append('tid', tId); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/check_signed.pl', { body: fData1, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((res) => { if (typeof res.result !== 'undefined' && res.result === 'ERR') setIsLocked(true); else setIsLocked(false); console.log('checked signed:', res, 'locked:', isLocked) }) } catch (e) { console.log('failed check signed') }
  } */
  async function getFileInfo (e) {
    e.stopPropagation(); e.preventDefault(); document.getElementById('cm_' + tId).style.opacity = 0.5; const fData = new FormData(); fData.append('tId', tId); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); const { data } = await axios.post('/api/get_file_info', fData, { headers: { 'Content-Type': 'multipart/form-data' } }); if (data.mData.fn) { /* alert('CHECK SUM ' + data.mData.hs + ' MINTED AT ' + data.mData.ts) */ document.getElementById('informer_text_0_' + tId).innerText = '"' + data.mData.fn + '"'; document.getElementById('informer_text_0a_' + tId).innerText = data.mData.fs + ' bytes'; document.getElementById('informer_text_1_' + tId).innerText = data.mData.hs.substring(0, 12) + '..'; document.getElementById('informer_checkbox_1_' + tId).innerHTML = data.mData.eq === '1' ? '&#x2705;' : data.mData.eq === '-1' ? '&#x274C;' : '?'; document.getElementById('informer_hidden_1_' + tId).innerText = data.mData.hs; document.getElementById('informer_text_2_' + tId).innerText = data.mData.ts; document.getElementById('informer_text_3_' + tId).innerText = data.mData.tx.substring(0, 12) + '..'; document.getElementById('informer_hidden_3_' + tId).innerText = data.mData.tx; document.getElementById('informer_text_4_' + tId).innerText = '"' + description + '"'; document.getElementById('informer_text_8_' + tId).innerText = '"' + name + '"'; document.getElementById('informer_text_5_' + tId).innerText = data.mData.bn; document.getElementById('informer_text_6_' + tId).innerText = data.mData.cr.substring(0, 12) + '..'; document.getElementById('informer_hidden_6_' + tId).innerText = data.mData.cr; document.getElementById('informer' + tId).style.display = 'block'; document.getElementById('cm_' + tId).style.display = 'none'; document.getElementById('cc_' + tId).style.display = 'none' } else { alert('No data received!'); document.getElementById('cm_' + tId).style.opacity = 1 }
  }
  async function getFileInfo2 (e) {
    e.stopPropagation(); e.preventDefault(); let finalStr = ''; if (split96) { const descStr = description.split('Tags:'); finalStr = descStr[0] + 'Tags:'; const partTwo = descStr[1].trim().replace('.', ''); const tags = partTwo.split(','); for (let i = 0; i < tags.length; i++) { const a = '<a href="/?' + tags[i].trim() + '" target=new>' + tags[i].trim() + '</a>'; finalStr = finalStr + a; if (i < tags.length - 1) finalStr = finalStr + ', ' }; finalStr.trim() }
    document.getElementById('informer_text_0').innerText = '. .wait. .'; document.getElementById('informer_text_0a').innerText = '. .wait. .'; document.getElementById('informer_text_1').innerText = '. .wait. .'; document.getElementById('informer_checkbox_1').innerHTML = ''; document.getElementById('informer_hidden_1').innerText = ''; document.getElementById('informer_text_2').innerText = '. .wait. .'; document.getElementById('informer_text_3').innerText = '. .wait. .'; document.getElementById('informer_hidden_3').innerText = ''; document.getElementById('informer_text_4').innerText = '. .wait. .'; document.getElementById('informer_text_8').innerText = '. .wait. .'; document.getElementById('informer_text_5').innerText = '. .wait. .'; document.getElementById('informer_text_6').innerText = '. .wait. .'; document.getElementById('informer_hidden_6').innerText = ''; document.getElementById('commonInformer').style.display = 'block'; const fData = new FormData(); fData.append('tId', tId); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); const { data } = await axios.post('/api/get_file_info', fData, { headers: { 'Content-Type': 'multipart/form-data' } }); if (data.mData.fn) { document.getElementById('informer_text_0').innerText = '"' + m[1] + '"'; document.getElementById('informer_text_0a').innerText = data.mData.fs + ' bytes'; document.getElementById('informer_text_1').innerText = data.mData.hs.substring(0, 12) + '..'; document.getElementById('informer_checkbox_1').innerHTML = data.mData.eq === '1' ? '&#x2705;' : data.mData.eq === '-1' ? '&#x274C;' : '?'; document.getElementById('informer_hidden_1').innerText = data.mData.hs; document.getElementById('informer_text_2').innerText = data.mData.ts; document.getElementById('informer_text_3').innerText = data.mData.tx.substring(0, 12) + '..'; document.getElementById('informer_hidden_3').innerText = data.mData.tx; document.getElementById('informer_text_4').innerHTML = split96 ? '"' + finalStr + '"' : '"' + description + '"'; document.getElementById('informer_text_7').innerText = tId; document.getElementById('informer_text_8').innerText = '"' + name + '"'; document.getElementById('informer_text_5').innerText = data.mData.bn; document.getElementById('informer_text_6').innerText = data.mData.cr.substring(0, 12) + '..'; document.getElementById('informer_hidden_6').innerText = data.mData.cr } else { alert('No data received!') }
  }
  async function unlockToken (tid, signed) {
    let res = ''
    try { const fData = new FormData(); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); fData.append('tid', tId); fData.append('signed', signed); res = await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/unlock_token.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((res) => { return res }) } catch (e) { console.log('failed unlock token') }
    return res
  }
  /* async function unlockToken (formData) {
    const { data } = await axios.post('/api/unlock_token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return data
  } */

  function createNFTFormDataFile (name, description, file, account, signed, tId) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('file', file)
    formData.append('account', account)
    formData.append('signed', signed)
    formData.append('tid', tId)
    if (mydocs) formData.append('network', 'hd')
    if (split96) formData.append('network', 'hd96')
    // console.log('using account', account)
    return formData
  }

  async function uploadFileToIPFS (formData) {
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return data.check
  }
  function handleChange (event) {
    // console.log(event)
    this.props.defaultValue = event.target.value
  }
  async function onFileChange (event) {
    if (!event.target.files[0]) return
    setFile(event.target.files[0])
    event.target.files[0].name.match(/\.(mp4|MP4|webm|WEBM)$/ig) ? setFileUrl(defaultVideoFileUrl) : event.target.files[0].name.match(/\.(jpg|jpeg|png)$/ig) ? setFileUrl(URL.createObjectURL(event.target.files[0])) : setFileUrl(defaultFileTypeUrl)
    console.log('setting label to', event.target.files[0].name)
    document.getElementById('labelFileName' + tId).innerText = event.target.files[0].name
    document.getElementById('labelFileName' + tId).style.display = event.target.files[0].name.match(/\.(jpg|jpeg|png|mp4|webm)$/ig) ? 'none' : 'block'
  }

  async function onSubmit ({ name, description }) {
    try {
      // if (!file || isLoading) { console.log('no file?'); return }
      setIsLoading(true)
      const formData = createNFTFormDataFile(name, description, file, account, signed, tId)
      const check = await uploadFileToIPFS(formData)
      if (typeof check === 'undefined') { alert('Error occurred. Check file size must be < 100M.'); return }
      if (check === 'null' || check === null) { alert('Error occurred. Check file size must be < 100M.'); return }
      if (check === 'OK') { alert('SUCCESS! click to reload'); location.reload() }
      // console.log('CHECK IS', check)
      // const tokenId = await createNft(metadataUrl)
      // console.log('new token:', tokenId)
      // addNFTToList(tokenId)
      setFileUrl(defaultFileUrl)
      reset()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (name.match(/ \| /)) splitName = name.split(' | ')
  const secondName = name.match(/ \| /) ? splitName[1] : name
  const firstName = name.match(/ \| /) ? splitName[0] : name
  if (currLang === 'EN') currName = firstName; else currName = secondName
  const stringLengthLimit = goodNotebook && !isDescOpen ? 18 : 18
  const shortName = currName.length > stringLengthLimit ? currName.substr(0, stringLengthLimit) + '..' : currName
  const shortDesc = description.length > stringLengthLimit ? description.substr(0, stringLengthLimit) + '..' : description // max 3 rows of text
  // const badThingsHappen = shortName === 'Token Missing or Locked' && shortDesc === 'Reload the page'
  const badThingsHappen = shortName.match(/Token Missing/ig) && shortDesc === 'Reload the page'
  // const cC = ''

  const emptyBucket = () => {
    console.log('empty bucket')
  }

  // checkSigned(nft)
  return (
    !isEdited
      ? <Card
        className={classes.root} sx={{ backgroundColor: lightBgr ? mydocs ? '#fff' : '#012' : '#fff', maxHeight: scalingAllowed && hiResScreen ? '25vh' : goodNotebook && !bigger ? isDescOpen ? mydocs || split96 ? '66vh' : '98vh' : mydocs || split96 ? 480 : '60vh' : null, minHeight: scalingAllowed && hiResScreen ? '22vh' : goodNotebook && !bigger ? isDescOpen ? mydocs || split96 ? '66vh' : 590 : mydocs || split96 ? '56vh' : 510 : null }}
        raised={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ><><div id={'warnerburn' + tId} style={{ position: 'relative', width: '100%', height: '100%', background: '#fed', fontSize: '24px', color: '#222', textAlign: 'center', paddingTop: '10%', display: 'none' }}>
            {currLang === 'EN' && <span>WARNING!<br/><hr/>If You Really Want to Burn This Token, Click <span style={{ cursor: 'pointer', textDecoration: 'underline', color: '#009' }} onClick={() => { dispatch(setFullyLoaded(false)); setTimeout(() => { document.getElementById('act' + tId).click() }, 500) }}>YES</span>!<br/>Or click {Cancel} and Return.</span>}
            {currLang === 'RU' && <span>ПРЕДУПРЕЖДЕНИЕ!<br/><hr/>Если Вы реально хотите сжечь свой Токен, ещё раз кликните <span style={{ cursor: 'pointer', textDecoration: 'underline', color: '#009' }} onClick={() => { dispatch(setFullyLoaded(false)); setTimeout(() => { document.getElementById('act' + tId).click() }, 500) }}>YES</span>!<br/>Или нажмите {Cancel} чтобы вернуться.</span>}
          </div>{Unlocker}{Informer}
        {Memoized}
        {museoReal !== '' && <div style={{ backgroundColor: '#fff', textAlign: 'right', lineHeight: '16px', fontSize: '16px' }}><NavMuseo onClick={emptyBucket} title={museoReal} href={museoHref} col={museoCol} /></div>}
        {museoReal === '' && typeof window !== 'undefined' && window.location.hostname === 'canneverbe.room-house.com' && <div style={{ fontSize: '8px' }}>&nbsp;</div>}
        <CardContent id={'cc_' + tId} style={{ backgroundColor: '#fff', marginTop: '-4px', display: scalingAllowed && hiResScreen ? 'none' : 'block' }} className={classes.cardContent} onClick={() => { setFullName(!fullName) }}>
          <NFTName name={(isDescOpen && name.length < stringLengthLimit) || fullName ? currName : shortName} variant={notebook ? 'h6' : 'h6'}/>
          {!badThingsHappen && typeof window !== 'undefined' && window.location.hostname !== 'mydocs.room-house.com' && window.location.hostname !== 'split.room-house.com' && <NavDesc onClick={emptyBucket} title={isShortDesc && !fullName ? shortDesc : description} href={href} />}
          {!badThingsHappen && typeof window !== 'undefined' && window.location.hostname === 'mydocss.room-house.com' && <div onClick={isShortDesc ? setIsShortDesc(false) : setIsShortDesc(true)}>{isShortDesc && !fullName ? shortDesc : description}</div>}
          {badThingsHappen && <div style={{ cursor: 'pointer' }} onClick={() => { location.reload() }}>CLICK TO RELOAD</div>}
          {isDescOpen
            ? <>
          <Divider style={{ marginTop: '-3px', display: badThingsHappen ? 'none' : 'block' }} className={classes.firstDivider} />
          <Box className={classes.addressesAndPrice} style={{ display: badThingsHappen ? 'none' : 'block' }}>
            <div className={classes.addressesContainer} style={{ float: 'left' }} >
              <CardAddresses nft={nft}/>
            </div>
            <div className={classes.priceContainer} style={{ float: 'right', display: nft.isLocked || (mydocs) ? 'none' : 'block' }}>
              {action === 'sell'
                ? <PriceTextField listingFee={listingFee} error={priceError} disabled={isLoading} onChange={e => setPrice(e.target.value)}/>
                : <NFTPrice nft={nft} variant={notebook ? 'h6' : 'h6'}/>
              }
            </div>
            <div className={classes.priceContainer} style={{ float: 'right', display: nft.isLocked ? 'block' : 'none' }}>
              This Token is Locked. <span style={{ color: '#369', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { document.getElementById('unlocker' + tId).style.display = 'table'; document.getElementById('cm_' + tId).style.display = 'none'; document.getElementById('cc_' + tId).style.display = 'none' }}>Unlock</span>&nbsp;<span style={{ color: '#59c', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsEdited(true) }}>Edit</span>
            </div>
          </Box>
          <Divider style={{ marginBottom: '-5px' }} className={classes.lastDivider} />
            </>
            : <Divider className={classes.firstDivider} style={{ display: 'none' }}/>
          }
        </CardContent>
        <CardActions className={classes.cardActions} style={{ backgroundColor: '#fff', display: isDescOpen ? badThingsHappen ? 'none' : (mydocs) && actions[action].text !== 'Burn' && actions[action].text !== 'cancel' && actions[action].text !== 'Publish' ? 'none' : 'block' : 'none' }}>
          <Button size="small" id={'act' + tId} onClick={() => { if ((actions[action].text === 'Send a postcard' || actions[action].text === 'Burn') && fullyLoaded) { document.getElementById('warnerburn' + tId).style.display = 'table'; document.getElementById('cm_' + tId).style.display = 'none'; document.getElementById('cc_' + tId).style.display = 'none' }; !isLoading && (!fullyLoaded || (actions[action].text !== 'Send a postcard' && actions[action].text !== 'Burn')) && onClicker(nft, 0) }}>
            {isLoading
              ? <CircularProgress size="20px" />
              : hasWeb3 && actions[action].text
            }
          </Button>
          <Button size="small" style={{ display: (mydocs || split96) && actions[action].text === 'Publish' ? 'block' : 'none', float: 'right' }} onClick={() => { onClicker(nft, 1) }}>{isLoading ? <CircularProgress size="20px" /> : hasWeb3 && 'Burn'}</Button>
        </CardActions></>
      </Card>
      : <Card className={classes.root} component="form" id={'cf_' + tId} sx={{ maxWidth: 345 }} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor={'file-input' + tId}>
        <CardMedia id={'cm_' + tId}
          className={classes.media}
          alt='Upload image'
          image={fileUrl} sx={{ position: 'relative', paddingTop: curSizee, marginTop: curBo }}>
          <a href={curImage} download={typeof m[1] !== 'undefined' && m[1] !== 'undefined' && m[1] !== 'Easy_HD_Token' ? m[1] : ''} id={'labelFileName' + tId} style={{ background: typeof m[1] !== 'undefined' && m[1] === 'Easy_HD_Token' ? '#fed' : 'transparent', color: '#369', fontSize: '24px', position: 'absolute', top: '10px', left: '10px', display: 'block' }}>{m[1]}</a>
        </CardMedia>
        </label>
        <input
          style={{ display: 'none' }}
          type="file"
          name={'file' + tId}
          id={'file-input' + tId}
          onChange={onFileChange}
        />
        <CardContent sx={{ paddingBottom: 0 }}>
          <TextField
            id={'name-input' + tId}
            label="Name"
            name={'name' + tId}
            size="small"
            defaultValue={shortName}
            onChange={(e) => handleChange(e)}
            fullWidth
            required
            margin="dense"
            disabled={isLoading}
            {...register('name')}
          />
           <TextField
            id={'description-input' + tId}
            label="Description"
            name={'description' + tId}
            size="small"
            multiline
            rows={2}
            defaultValue={shortDesc}
            onChange={(e) => handleChange(e)}
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
              : 'Send'
            }
          </Button>
          <Button size="small" onClick={() => { setIsEdited(false) }}>Cancel</Button>
        </CardActions>
      </Card>
  )
}
